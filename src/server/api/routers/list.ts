import { boards, cards, lists } from "@/server/db/schema"
import { createList, editList, getAllListsByBoardId } from "@/server/schema/list.schema"
import { TRPCClientError } from "@trpc/client"
import { TRPCError } from "@trpc/server"
import { asc, eq } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const listRouter = createTRPCRouter({
  all: protectedProcedure.input(getAllListsByBoardId).query(async ({ ctx, input }) => {
    const { db } = ctx

    return await db
      .select({
        id: lists.id,
        title: lists.title,
        boardId: lists.boardId,
        position: lists.position,
        cards: {
          id: cards.id,
          title: cards.title,
          listId: cards.listId,
          position: cards.position
        }
      })
      .from(lists)
      .innerJoin(cards, eq(cards.listId, lists.id))
      .where(eq(lists.boardId, input.boardId))
      .orderBy(asc(cards.position))
      .execute()
  }),
  create: protectedProcedure.input(createList).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx
    const { title, boardId, position } = input

    const board = await db
      .select({ id: boards.id, ownerId: boards.ownerId })
      .from(boards)
      .where(eq(boards.id, input.boardId))
      .limit(1)

    if (board[0]?.ownerId !== session.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not the ownerId of this board"
      })
    }

    try {
      await db.insert(lists).values({ title, boardId, position }).execute()
    } catch (error) {
      throw new TRPCClientError("Error creating list")
    }
  }),
  edit: protectedProcedure.input(editList).mutation(async ({ ctx, input }) => {
    const { db } = ctx
    const { listId, title } = input

    if (title === "") throw new TRPCClientError("Title cannot be empty")

    try {
      await db.update(lists).set({ title }).where(eq(lists.id, listId)).execute()
    } catch (error) {
      throw new TRPCClientError("Error updating list")
    }
  })
})
