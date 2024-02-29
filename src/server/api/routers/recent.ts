import { boardMembers, boards, users } from "@/server/db/schema"
import { createRecent, getRecent } from "@/server/schema/board.schema"
import { and, desc, eq, isNotNull } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const recentRouter = createTRPCRouter({
  create: protectedProcedure.input(createRecent).mutation(async ({ ctx, input }) => {
    return await ctx.db
      .update(boards)
      .set({
        openedAt: new Date()
      })
      .where(and(eq(boards.id, input.boardId), eq(boards.ownerId, input.userId)))
  }),
  get: protectedProcedure.input(getRecent).query(async ({ ctx, input }) => {
    const { userId } = input

    // return await ctx.db.query.boards.findMany({
    //   columns: {
    //     id: true,
    //     title: true,
    //     background: true
    //   },
    //   limit: 5,
    //   where: and(eq(boards.ownerId, userId), isNotNull(boards.openedAt)),
    //   with: {
    //     members: true,
    //     owner: {
    //       columns: {
    //         name: true
    //       }
    //     }
    //   },
    //   orderBy: [desc(boards.openedAt)]
    // })

    return await ctx.db
      .select({
        id: boards.id,
        title: boards.title,
        background: boards.background,
        owner: {
          name: users.name
        },
        members: {
          userId: boardMembers.userId,
          boardId: boardMembers.boardId,
          role: boardMembers.role,
          status: boardMembers.status
        }
      })
      .from(boards)
      .innerJoin(boardMembers, eq(boardMembers.boardId, boards.id))
      .innerJoin(users, eq(users.id, boardMembers.userId))
      .where(and(eq(boards.ownerId, userId), isNotNull(boards.openedAt)))
      .orderBy(desc(boards.openedAt))
      .limit(5)
  })
})
