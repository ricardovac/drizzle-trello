import { z } from "zod"

export const createCard = z.object({
  title: z.string().min(1, "O título deve ter pelo menos 1 caractere"),
  description: z.string().nullish(),
  listId: z.string()
})

export type createCardSchema = z.TypeOf<typeof createCard>

export const updateCardPosition = z.object({
  cardId: z.string(),
  position: z.number()
})

export type updateCardPositionSchema = z.TypeOf<typeof updateCardPosition>

export const updateCard = z.object({
  cardId: z.string(),
  card: z.object({
    listId: z.string()
  })
})

export type updateCardSchema = z.TypeOf<typeof updateCard>
