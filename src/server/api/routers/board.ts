import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { boardMembers, boards } from "@/server/db/schema"
import {
  createBoardSchema,
  getAllBoardsSchema,
  getBoardByIdSchema,
  updateBoardSchema
} from "@/server/schema/board.schema"
import { TRPCError } from "@trpc/server"
import { and, desc, eq, sql } from "drizzle-orm"

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(getBoardByIdSchema).query(async ({ ctx, input }) => {
    const { session } = ctx
    const { boardId } = input
    const userId = session.user.id

    const board = await ctx.db.query.boardMembers.findFirst({
      with: {
        board: {
          with: {
            labels: true
          },
          columns: {
            id: true,
            title: true,
            background: true,
            ownerId: true
          }
        }
      },
      where: and(eq(boardMembers.userId, userId), eq(boardMembers.boardId, boardId))
    })

    if (!board) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Board not found"
      })
    }

    return board
  }),
  all: protectedProcedure.input(getAllBoardsSchema).query(async ({ ctx, input }) => {
    const { db } = ctx
    const { onlyAdmin, userId } = input

    const limit = input.limit ?? 20
    const countRows = await db
      .select({
        board_count: sql<number>`count(${boards.id})`.as("board_count")
      })
      .from(boards)
    const totalCount = countRows[0]?.board_count
    if (totalCount === undefined) throw new Error("totalCount is undefined")

    let userBoards = await db.query.boardMembers.findMany({
      columns: {
        role: true
      },
      where: onlyAdmin
        ? and(eq(boardMembers.userId, userId), eq(boardMembers.role, "admin"))
        : and(eq(boardMembers.userId, userId), eq(boardMembers.role, "member")),
      with: {
        user: {
          columns: {
            name: true
          }
        },
        board: {
          columns: {
            id: true,
            title: true,
            background: true
          }
        }
      }
    })

    let nextCursor: typeof input.cursor | undefined = undefined
    if (userBoards.length > limit) {
      const nextItem = userBoards.pop()!
      nextCursor = nextItem.board.id
    }

    return {
      items: userBoards,
      nextCursor,
      totalCount
    }
  }),
  create: protectedProcedure.input(createBoardSchema).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx
    const userId = session.user.id

    const board = await db.transaction(async (tx) => {
      const foundBoard = await tx
        .select({ id: boards.id })
        .from(boards)
        .where(and(eq(boards.title, input.title), eq(boards.ownerId, userId)))
        .limit(1)
        .execute()

      if (!!foundBoard.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Um board com este nome já existe."
        })
      }

      await tx.insert(boards).values({
        title: input.title,
        background: input.background,
        ownerId: userId
      })

      const [returnedBoard] = await tx
        .select({ id: boards.id })
        .from(boards)
        .where(and(eq(boards.title, input.title), eq(boards.ownerId, userId)))
        .orderBy(desc(boards.createdAt))
        .limit(1)

      if (!returnedBoard) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Created board not found" })
      }

      await tx.insert(boardMembers).values({
        boardId: returnedBoard.id,
        userId,
        role: "admin",
        status: "active"
      })
    })

    return board
  }),
  edit: protectedProcedure.input(updateBoardSchema).mutation(async ({ ctx, input }) => {
    const foundBoard = await ctx.db.query.boards.findFirst({
      where: eq(boards.id, input.boardId)
    })

    if (!foundBoard) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Board not found"
      })
    }

    return await ctx.db
      .update(boards)
      .set({
        title: input.title
      })
      .where(eq(boards.id, input.boardId))
  })
})
