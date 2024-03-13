import { boards, cards, cardsToLabels, lists } from "@/server/db/schema"
import { createListSchema, editListSchema, getAllListsByBoardIdSchema } from "@/server/schema/list.schema"
import { TRPCClientError } from "@trpc/client"
import { TRPCError } from "@trpc/server"
import { asc, eq } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const listRouter = createTRPCRouter({
  all: protectedProcedure.input(getAllListsByBoardIdSchema).query(async ({ ctx, input }) => {
    const { db } = ctx

    return await db.query.lists.findMany({
      orderBy: asc(lists.position),
      where: eq(lists.boardId, input.boardId),
      with: {
        cards: {
          orderBy: asc(cards.position),
          with: {
            cardsToLabels: {
              where: eq(cardsToLabels.status, "active"),
              with: { label: true }
            }
          }
        }
      }
    })
  }),
  create: protectedProcedure.input(createListSchema).mutation(async ({ ctx, input }) => {
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
  edit: protectedProcedure.input(editListSchema).mutation(async ({ ctx, input }) => {
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
