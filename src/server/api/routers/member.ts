import { boardMembers, boards } from "@/server/db/schema"
import { addMember, getMembers } from "@/server/schema/board.schema"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const memberRouter = createTRPCRouter({
  add: protectedProcedure.input(addMember).mutation(async ({ ctx, input }) => {
    const { shareMessage, boardId, userId } = input

    const foundBoard = await ctx.db.query.boards.findFirst({
      where: eq(boards.id, boardId),
      with: {
        members: true
      }
    })

    if (!foundBoard) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Board not found"
      })
    }

    if (foundBoard.members.some((member) => member.userId === userId)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "O usuário já é membro do quadro"
      })
    }

    // do something with shareMessage
    console.log(shareMessage)

    return await ctx.db.insert(boardMembers).values({
      boardId,
      userId,
      role: "member",
      status: "invited"
    })
  }),
  get: protectedProcedure.input(getMembers).query(async ({ ctx, input }) => {
    const { boardId } = input

    const boardQuery = await ctx.db.query.boards.findFirst({
      where: and(eq(boards.id, boardId)),
      with: {
        members: {
          columns: {
            role: true,
            status: true,
            addedAt: true,
            removedAt: true
          },
          with: {
            user: {
              columns: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })

    return boardQuery?.members
  })
})
