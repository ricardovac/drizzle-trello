import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { boardMembers, boards } from "@/server/db/schema"
import {
  createBoard,
  createRecent,
  getAllBoards,
  getBoardById,
  getRecent,
  updateBoard
} from "@/server/schema/board.schema"
import { TRPCError } from "@trpc/server"
import { and, desc, eq, isNotNull, sql } from "drizzle-orm"

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(getBoardById).query(async ({ ctx, input }) => {
    const board = await ctx.db.query.boards.findFirst({
      where: eq(boards.id, input.id),
      with: {
        members: true
      }
    })

    if (!board) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Board not found"
      })
    }

    return board
  }),
  all: protectedProcedure.input(getAllBoards).query(async ({ ctx, input }) => {
    const { db } = ctx

    const limit = input.limit ?? 20
    const countRows = await db
      .select({
        board_count: sql<number>`count(${boards.id})`.as("board_count")
      })
      .from(boards)
    const totalCount = countRows[0]?.board_count
    if (totalCount === undefined) throw new Error("totalCount is undefined")

    let boardsQuery = await db.query.boards.findMany({
      limit,
      where: eq(boards.ownerId, input.userId),
      orderBy: desc(boards.createdAt),
      with: {
        members: true
      }
    })

    let nextCursor: typeof input.cursor | undefined = undefined
    if (boardsQuery.length > limit) {
      const nextItem = boardsQuery.pop()!
      nextCursor = nextItem.id
    }

    return {
      items: boardsQuery,
      nextCursor,
      totalCount
    }
  }),
  create: protectedProcedure.input(createBoard).mutation(async ({ ctx, input }) => {
    const board = await ctx.db.transaction(async (tx) => {
      const foundBoard = await tx
        .select({ id: boards.id })
        .from(boards)
        .where(and(eq(boards.title, input.title), eq(boards.ownerId, input.userId)))
        .limit(1)
        .execute()

      if (!!foundBoard.length) {
        tx.rollback()
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Board already exists"
        })
      }

      await tx.insert(boards).values({
        title: input.title,
        background: input.background,
        ownerId: input.userId,
        public: input.public
      })

      const [returnedBoard] = await tx
        .select({ id: boards.id })
        .from(boards)
        .where(and(eq(boards.title, input.title), eq(boards.ownerId, input.userId)))
        .orderBy(desc(boards.createdAt))
        .limit(1)

      if (!returnedBoard) {
        tx.rollback()
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Created board not found" })
      }

      await tx.insert(boardMembers).values({
        boardId: returnedBoard.id,
        userId: input.userId
      })
    })

    return board
  }),
  edit: protectedProcedure.input(updateBoard).mutation(async ({ ctx, input }) => {
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
  }),
  createRecent: protectedProcedure.input(createRecent).mutation(async ({ ctx, input }) => {
    return await ctx.db
      .update(boards)
      .set({
        openedAt: new Date()
      })
      .where(and(eq(boards.id, input.boardId), eq(boards.ownerId, input.userId)))
  }),
  getRecent: protectedProcedure.input(getRecent).query(async ({ ctx, input }) => {
    const { userId } = input

    const board = await ctx.db.query.boards.findMany({
      limit: 5,
      where: and(eq(boards.ownerId, userId), isNotNull(boards.openedAt)),
      with: {
        members: true
      }
    })

    return board
  })
})
