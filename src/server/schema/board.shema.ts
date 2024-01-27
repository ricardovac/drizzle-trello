import { z } from 'zod';

export const getBoardById = z.object({
  id: z.string(),
});

export type getBoardByIdSchema = z.TypeOf<typeof getBoardById>;

export const getAllBoards = z.object({
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100),
  userId: z.string(),
});

export type getAllBoardsSchema = z.TypeOf<typeof getAllBoards>;

export const createBoard = z.object({
  title: z.string().min(2),
  background: z.string(),
  ownerId: z.string(),
  public: z.boolean(),
});

export type createBoardSchema = z.TypeOf<typeof createBoard>;
