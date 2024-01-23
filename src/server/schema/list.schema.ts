import { z } from 'zod';

export const getAllListsByBoardId = z.object({ boardId: z.string() });

export type getAllListsByBoardIdSchema = z.TypeOf<typeof getAllListsByBoardId>;

export const createList = z.object({
  title: z.string(),
  boardId: z.string(),
  position: z.number(),
});

export type createListSchema = z.TypeOf<typeof createList>;

export const editList = z.object({
  listId: z.string(),
  title: z.string(),
});

export type editTitleSchema = z.TypeOf<typeof editList>;
