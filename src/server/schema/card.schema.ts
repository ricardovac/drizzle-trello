import { InferInsertModel } from "drizzle-orm"
import { z } from "zod"
import { cards } from "../db/schema"

export const createCardSchema = z.object({
  title: z.string().min(1, "O título deve ter pelo menos 1 caractere"),
  description: z.string().nullish(),
  listId: z.string()
})

export type CreateCardInput = z.TypeOf<typeof createCardSchema>

export const updateCardPositionSchema = z.object({
  cardId: z.string(),
  position: z.number()
})

export type UpdateCardPositionInput = z.TypeOf<typeof updateCardPositionSchema>

export const updateCardSchema = z.object({
  cardId: z.string(),
  card: z.object({
    description: z.string().nullish(),
    listId: z.string().nullish()
  })
})

export type UpdateCardInput = z.TypeOf<typeof updateCardSchema>

export const getCardSchema = z.object({
  cardId: z.string()
})

export type GetCardInput = z.TypeOf<typeof getCardSchema>
