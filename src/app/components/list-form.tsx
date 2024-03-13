"use client"

import { useEffect, useState } from "react"
import { useAuthContext } from "@/context/auth-context"
import { useBoardContext } from "@/context/board-context"
import { CreateListInput, createListSchema } from "@/server/schema/list.schema"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "components/ui/button"
import { Card, CardFooter, CardHeader } from "components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"

import { useClickOutside } from "@/hooks/useClickOutside"

export default function ListForm() {
  const [mode, setMode] = useState<"button" | "form">("button")
  const cardRef = useClickOutside(() => setMode("button"))
  const { board, lists } = useBoardContext()

  if (mode === "button") {
    return (
      <Button ref={cardRef} onClick={() => setMode("form")} className="opacity-45">
        Adicionar {lists.length === 0 ? "uma" : "outra"} lista
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
  const utils = api.useUtils()
  const userId = user.id ?? ""
  const cardRef = useClickOutside(() => setMode("button"))

  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
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
    if (mode) form.setFocus("title")
  }, [form, mode])

  const onSubmit = (values: CreateListInput) => {
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
                    <Input placeholder="Insira o título da lista..." {...field} />
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
