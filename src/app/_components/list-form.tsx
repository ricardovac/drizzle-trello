"use client"

import { useEffect, useRef, useState } from "react"
import { createList } from "@/server/schema/list.schema"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "components/ui/button"
import { Card, CardFooter, CardHeader } from "components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useClickOutside } from "@/hooks/useClickOutside"
import { useBoardContext } from "@/context/board-context"
import { useAuthContext } from "@/context/auth-context"


export default function ListForm() {
  const [mode, setMode] = useState<"button" | "form">("button")
  const cardRef = useClickOutside(() => setMode("button"))
  const { board } = useBoardContext()

  if (mode === "button") {
    return (
      <Button ref={cardRef} onClick={() => setMode("form")} className="opacity-45">
        Adicionar uma lista
      </Button>
    )
  }

  return <ListFormField boardId={board.id} setMode={setMode} mode={mode} />
}

interface CreateListFormProps {
  boardId: string
  setMode: (value: "button" | "form") => void
  mode: "button" | "form"
}

function ListFormField({ boardId, setMode, mode }: CreateListFormProps) {
  const { lists } = useBoardContext()
  const { user } = useAuthContext()
  const ref = useRef<HTMLInputElement>(null)
  const utils = api.useUtils()
  const userId = user.id ?? ""
  const cardRef = useClickOutside(() => setMode("button"))

  const form = useForm<z.infer<typeof createList>>({
    resolver: zodResolver(createList),
    defaultValues: {
      title: "",
      boardId: "",
      position: 0
    }
  })

  const { mutate } = api.list.create.useMutation({
    onMutate: async (newData) => {
      await utils.list.all.cancel()

      const previousList = utils.list.all.getData({ boardId })

      const newList = {
        ...newData,
        id: "",
        createdById: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: []
      }

      utils.list.all.setData({ boardId }, previousList ? [...previousList, newList] : [newList])

      return { previousList }
    },
    onError: (_, __, context) => {
      utils.list.all.setData({ boardId }, context?.previousList)
    },
    onSettled: () => {
      form.reset()
      void utils.list.all.invalidate({ boardId })
    }
  })

  useEffect(() => {
    if (mode && ref.current) ref.current.focus()
  }, [ref, mode])

  const onSubmit = (values: z.infer<typeof createList>) => {
    mutate({ title: values.title, boardId, position: (lists.at(-1)?.position ?? 0) + 1 })
    form.reset()
  }

  return (
    <Card ref={cardRef}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Insira o título da lista..." {...field} ref={ref} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardHeader>
          <CardFooter>
            <div className="flex w-full items-center justify-between">
              <Button type="submit">Adicionar lista</Button>
              <Button variant="destructive" onClick={() => setMode("button")}>
                <X />
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
