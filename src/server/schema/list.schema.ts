import { z } from "zod"

export const getAllListsByBoardIdSchema = z.object({ boardId: z.string() })

export type GetAllListsByBoardIdInput = z.TypeOf<typeof getAllListsByBoardIdSchema>

export const createListSchema = z.object({
  title: z.string().min(1, "O título deve ter pelo menos 1 caractere"),
  boardId: z.string(),
  position: z.number()
})

export type CreateListInput = z.TypeOf<typeof createListSchema>

export const editListSchema = z.object({
  listId: z.string(),
  title: z.string()
})

export type EditTitleInput = z.TypeOf<typeof editListSchema>
