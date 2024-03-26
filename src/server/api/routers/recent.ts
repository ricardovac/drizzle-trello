import { boards } from "@/server/db/schema"
import { createRecentSchema, getRecentSchema } from "@/server/schema/board.schema"
import { and, desc, eq, isNotNull } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const recentRouter = createTRPCRouter({
  create: protectedProcedure.input(createRecentSchema).mutation(async ({ ctx, input }) => {
    return await ctx.db
      .update(boards)
      .set({
        openedAt: new Date()
      })
      .where(and(eq(boards.id, input.boardId), eq(boards.ownerId, input.userId)))
  }),
  get: protectedProcedure.input(getRecentSchema).query(async ({ ctx, input }) => {
    const { userId } = input

    const board = await ctx.db.query.boards.findMany({
      columns: {
        id: true,
        title: true,
        background: true
      },
      limit: 5,
      where: and(eq(boards.ownerId, userId), isNotNull(boards.openedAt)),
      with: {
        members: true,
        owner: {
          columns: {
            name: true
          }
        }
      },
      orderBy: [desc(boards.openedAt)]
    })

    return board
  })
})
