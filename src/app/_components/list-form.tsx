"use client"

import { useEffect, useRef, useState } from "react"
import { api } from "@/trpc/react"
import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { Input } from "components/ui/input"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"

import { useClickOutside } from "@/hooks/useClickOutside"

import { useAuthContext } from "../context/auth-context"
import { useBoardContext } from "../context/board-context"

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

  const form = useForm({
    defaultValues: {
      title: "",
    },
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
        cards: [],
      }

      utils.list.all.setData({ boardId }, previousList ? [...previousList, newList] : [newList])

      return { previousList }
    },
    onError: (_, __, context) => {
      utils.list.all.setData({ boardId }, context?.previousList)
    },
    onSettled: () => {
      form.reset()
      setMode("button")
      void utils.list.all.invalidate({ boardId })
    },
  })

  useEffect(() => {
    if (mode && ref.current) ref.current.focus()
  }, [ref, mode])

  const onSubmit = form.handleSubmit((values) => {
    mutate({ title: values.title, boardId, position: (lists.at(-1)?.position ?? 0) + 1 })
    form.reset()
  })

  return (
    <Card ref={cardRef}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-10">
          <Input
            placeholder="Insira o título da lista..."
            {...form.register("title", { required: "Digite um titulo para a lista" })}
            name="title"
            ref={ref}
          />
          <div className="flex items-center justify-between">
            <Button type="submit">Adicionar lista</Button>
            <Button variant="destructive" onClick={() => setMode("button")}>
              <X />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
