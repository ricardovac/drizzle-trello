import { z } from "zod"

export const getBoardByIdSchema = z.object({
  boardId: z.string()
})

export type GetBoardByIdInput = z.TypeOf<typeof getBoardByIdSchema>

export const getAllBoardsSchema = z.object({
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100),
  userId: z.string(),
})

export type GetAllBoardsSchemaInput = z.TypeOf<typeof getAllBoardsSchema>

export const createBoardSchema = z.object({
  title: z.string().min(2, "O título deve conter pelo menos 2 caracteres").max(54),
  background: z.object({
    type: z.enum(["color", "image", "gradient"]),
    value: z.string()
  })
})

export type CreateBoardInput = z.TypeOf<typeof createBoardSchema>

export type BackgroundTypeSchema = z.infer<typeof createBoardSchema.shape.background>

export const updateBoardSchema = z.object({
  title: z.string().min(2, "O título deve conter pelo menos 2 caracteres").max(54),
  boardId: z.string()
})

export type UpdateBoardInput = z.TypeOf<typeof updateBoardSchema>

export const createRecentSchema = z.object({
  boardId: z.string(),
  userId: z.string()
})

export type CreateRecentInput = z.TypeOf<typeof createRecentSchema>

export const getRecentSchema = z.object({
  userId: z.string()
})

export type GetRecentInput = z.TypeOf<typeof getRecentSchema>

export const addMemberSchema = z.object({
  boardId: z.string(),
  userId: z.string(),
  shareMessage: z.string().optional()
})

export type AddMemberInput = z.TypeOf<typeof addMemberSchema>

export const getMembersSchema = z.object({
  boardId: z.string(),
  ownerId: z.string()
})

export type GetMembersInput = z.TypeOf<typeof getMembersSchema>

export const starBoardSchema = getBoardByIdSchema
