import { boards, lists } from "@/server/db/schema"
import { createList, editList, getAllListsByBoardId } from "@/server/schema/list.schema"
import { TRPCClientError } from "@trpc/client"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const listRouter = createTRPCRouter({
  all: protectedProcedure.input(getAllListsByBoardId).query(async ({ ctx, input }) => {
    const { db } = ctx

    return await db.query.lists.findMany({
      orderBy: (lists, { asc }) => [asc(lists.position)],
      where(fields) {
        return eq(fields.boardId, input.boardId)
      },
      with: {
        cards: {
          orderBy: (cards, { asc }) => [asc(cards.position)],
        },
      },
    })
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
        message: "You are not the ownerId of this board",
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
  }),
})
