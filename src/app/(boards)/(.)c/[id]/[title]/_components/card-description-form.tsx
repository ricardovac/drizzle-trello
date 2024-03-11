"use client"

import { useCallback, useEffect, useState } from "react"
import { useCardContext } from "@/context/card-context"
import { updateCard, updateCardSchema } from "@/server/schema/card.schema"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Textarea } from "components/ui/textarea"
import { cn } from "lib/utils"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

const CardDescriptionForm = () => {
  const { card } = useCardContext()

  const list = card?.list
  const cardId = card?.id as string

  const [mode, setMode] = useState<"button" | "form">("button")
  const form = useForm<updateCardSchema>({
    resolver: zodResolver(updateCard),
    defaultValues: {
      cardId,
      card: {
        listId: list?.id,
        description: card?.description ?? ""
      }
    }
  })

  const router = useRouter()

  const { mutate: update } = api.card.updateCard.useMutation({
    onSuccess: () => void router.refresh()
  })

  const previousDescription = card?.description

  const description = form.watch("card.description")

  const onSubmit = useCallback(
    ({ card }: updateCardSchema) => {
      if (previousDescription === card.description || !card.description.length) {
        setMode("button")
        return
      }

      update({
        cardId,
        card: {
          description: card.description
        }
      })

      setMode("button")
    },
    [cardId, previousDescription, update]
  )

  useEffect(() => {
    if (mode) form.setFocus("card.description", { shouldSelect: true })
  }, [form, mode])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="card.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                {mode === "button" ? (
                  <div className="w-full">
                    <Button
                      variant="ghost"
                      onClick={() => setMode("form")}
                      className={cn(
                        "w-full justify-start",
                        !description.length && "hover:text-none text-muted-foreground"
                      )}
                    >
                      {!!description.length
                        ? description
                        : "Adicionar uma descrição mais detalhada"}
                    </Button>
                  </div>
                ) : (
                  <Textarea
                    placeholder="Adicione uma descrição mais detalhada"
                    className="resize-none"
                    onBlur={form.handleSubmit(onSubmit)}
                    value={field.value}
                    ref={field.ref}
                    onChange={field.onChange}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default CardDescriptionForm
