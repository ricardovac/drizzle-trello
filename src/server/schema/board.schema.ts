import { z } from "zod"

export const getBoardById = z.object({
  id: z.string()
})

export type getBoardByIdSchema = z.TypeOf<typeof getBoardById>

export const getAllBoards = z.object({
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100),
  userId: z.string()
})

export type getAllBoardsSchema = z.TypeOf<typeof getAllBoards>

export const createBoard = z.object({
  title: z.string().min(2, "O título deve conter pelo menos 2 caracteres").max(54),
  background: z.object({
    type: z.enum(["color", "image"]),
    value: z.string()
  }),
  userId: z.string(),
  public: z.boolean().default(false)
})

export type createBoardSchema = z.TypeOf<typeof createBoard>

export type BackgroundTypeSchema = z.infer<typeof createBoard.shape.background>

export const updateBoard = z.object({
  title: z.string().min(2, "O título deve conter pelo menos 2 caracteres").max(54),
  boardId: z.string()
})

export const createRecent = z.object({
  boardId: z.string(),
  userId: z.string()
})

export type createRecentSchema = z.TypeOf<typeof createRecent>

export const getRecent = z.object({
  userId: z.string(),
})

export type getRecentSchema = z.TypeOf<typeof getRecent>

