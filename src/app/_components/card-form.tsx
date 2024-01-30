import { useEffect, useRef, useState, type FC } from "react"
import { createCard } from "@/server/schema/card.schema"
import { api } from "@/trpc/react"
import { type SingleList } from "@/trpc/shared"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "components/ui/form"
import { Textarea } from "components/ui/textarea"
import { Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useClickOutside } from "@/hooks/useClickOutside"

interface CardFormProps {
  list: SingleList
}

const CardForm: FC<CardFormProps> = ({ list }) => {
  const [mode, setMode] = useState<"button" | "form">("button")
  const listRef = useClickOutside(() => setMode("button"))
  const utils = api.useUtils()

  const form = useForm<z.infer<typeof createCard>>({
    resolver: zodResolver(createCard),
    defaultValues: {
      title: "",
      listId: "",
    },
  })

  const { mutate } = api.card.create.useMutation({
    onSuccess: async () => {
      const boardId = list.boardId
      await utils.list.all.invalidate({ boardId })

      form.reset()
      setMode("button")
    },
  })
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (mode && ref.current) {
      ref.current.focus()
      ref.current.select()
    }
  }, [ref, mode])

  if (mode === "button") {
    return (
      <Button onClick={() => setMode("form")} variant="ghost">
        <Plus className="mr-2 size-5" />
        Adicionar um cartão
      </Button>
    )
  }

  const onSubmit = (values: z.infer<typeof createCard>) => {
    mutate({ title: values.title, listId: list.id })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} ref={listRef}>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Insira um título para este cartão..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex justify-between gap-10">
          <Button type="submit">Adicionar um cartã́o</Button>
          <Button variant="ghost" onClick={() => setMode("button")}>
            <X />
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CardForm
