import { addMember, getMembers } from "@/server/schema/board.schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { boardMembers, boards } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const memberRouter = createTRPCRouter({
  add: protectedProcedure.input(addMember).mutation(async ({ ctx, input }) => {
    const {shareMessage, boardId, userId} = input

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
      boardId: input.boardId,
      userId: input.userId,
      role: "member"
    })
  }),
  get: protectedProcedure.input(getMembers).query(async ({ ctx, input }) => {
    const { boardId } = input

    const membersQuery =  await ctx.db.query.boardMembers.findMany({
      where: and(eq(boardMembers.boardId, boardId)),
      with: {
        user: {
          columns: {
            image: true,
            name: true,
            email: true
          }
        }
      }
    })

    const returnableItems = membersQuery.map((item) => {
      return {
        image: item.user?.image,
        name: item.user?.name,
        email: item.user?.email
      }
    })

    return returnableItems
  })
})
