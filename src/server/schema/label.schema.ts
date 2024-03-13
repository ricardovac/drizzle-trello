import { z } from "zod";

export const createLabelSchema = z.object({
  title: z.string().min(1, "O título é um campo obrigatório"),
  color: z.string(),
  boardId: z.string(),
  cardId: z.string()
})

export type CreateLabelInput = z.TypeOf<typeof createLabelSchema>

export const addLabelSchema = z.object({
  labelId: z.string(),
  cardId: z.string()
})

export type AddLabelInput = z.TypeOf<typeof addLabelSchema>

export const removeLabelSchema = addLabelSchema

export type RemoveLabelInput = z.TypeOf<typeof removeLabelSchema>