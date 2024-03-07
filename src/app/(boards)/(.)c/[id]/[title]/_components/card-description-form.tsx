"use client"

import { useCallback, useState } from "react"
import { useCardContext } from "@/context/card-context"
import { updateCard, updateCardSchema } from "@/server/schema/card.schema"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Textarea } from "components/ui/textarea"
import { useForm } from "react-hook-form"

const CardDescriptionForm = () => {
  const { list, card } = useCardContext()
  const [mode, setMode] = useState<"button" | "form">("button")
  const cardId = card?.id
  const form = useForm<updateCardSchema>({
    resolver: zodResolver(updateCard),
    defaultValues: {
      cardId,
      card: {
        listId: list?.id,
        description: card?.description ?? ""
      }
    },
  })

  const utils = api.useUtils()

  const { mutate: update } = api.card.updateCard.useMutation({
    onMutate: async ({ card }) => {
      await utils.card.get.cancel({ cardId })

      const prevData = utils.card.get.getData({ cardId })

      utils.card.get.setData({ cardId }, (old) => ({
        card,
        ...old!
      }))

      return { prevData }
    },
    onError: (_, __, context) => {
      utils.card.get.setData({ cardId }, context?.prevData)
    },
    onSuccess: () => {
      void utils.card.get.invalidate({
        cardId
      })
    }
  })

  const onSubmit = useCallback(
    ({ card }: updateCardSchema) => {
      update({
        cardId,
        card: {
          description: card.description
        }
      })
    },
    [cardId, update]
  )

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
                    <Button variant={"ghost"} {...field} onClick={() => setMode("form")}>
                      {card.description}
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
