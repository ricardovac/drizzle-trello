import { useEffect, useRef, useState, type FC } from "react"
import { api } from "@/trpc/react"
import { type SingleList } from "@/trpc/shared"
import { Button } from "components/ui/button"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"

interface CardFormProps {
  list: SingleList
}

const CardForm: FC<CardFormProps> = ({ list }) => {
  const [mode, setMode] = useState<"button" | "form">("button")
  const utils = api.useUtils()
  const form = useForm({
    defaultValues: {
      cardTitle: "",
    },
  })

  const createCard = api.card.create.useMutation({
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
      <Button className="justify-start" onClick={() => setMode("form")} variant="default">
        Adicionar um cartäo
      </Button>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        createCard.mutate({ listId: list.id!, title: values.cardTitle })
      })}
    >
      <textarea
        placeholder="Insira um título para este cartão..."
        {...form.register("cardTitle", { required: true })}
        ref={ref}
      />
      <div className="mt-12 flex justify-between gap-10">
        {createCard.isLoading ? (
          <p>Carregando...</p>
        ) : (
          <Button type="submit">Adicionar um cartã́o</Button>
        )}
        <Button variant="default" onClick={() => setMode("button")}>
          <X />
        </Button>
      </div>
    </form>
  )
}

export default CardForm
