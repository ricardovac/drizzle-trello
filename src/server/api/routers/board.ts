import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { boards, users } from "@/server/db/schema"
import {
  createBoard,
  createRecent,
  getAllBoards,
  getBoardById,
  getRecent,
  updateBoard
} from "@/server/schema/board.schema"
import { TRPCError } from "@trpc/server"
import { and, desc, eq, gt, gte, isNotNull, sql } from "drizzle-orm"

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(getBoardById).query(async ({ ctx, input }) => {
    const board = await ctx.db.query.boards.findFirst({
      where: eq(boards.id, input.id),
      with: {
        owner: true
      },
      columns: {
        title: true,
        background: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        public: true
      }
    })

    if (!board) {
      throw new TRPCError({
        code: "NOT_FOUND"
      })
    }

    return {
      id: input.id,
      title: board.title,
      background: board.background,
      user: board.owner,
      ownerId: board.ownerId,
      public: board.public
    }
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

    let boardsQuery = db
      .select()
      .from(boards)
      .leftJoin(users, eq(users.id, boards.ownerId))
      .where(eq(boards.ownerId, input.userId))
      .orderBy(desc(boards.createdAt))
      .limit(limit)

    const cursor = input.cursor
    if (cursor) {
      boardsQuery = boardsQuery.where(gte(boards.id, cursor))
    }
    const items = await boardsQuery.execute()

    let nextCursor: typeof input.cursor | undefined = undefined
    if (items.length > limit) {
      const nextItem = items.pop()!
      nextCursor = nextItem.boards.id
    }

    const returnableItems = items.map((item) => ({
      id: item.boards.id,
      title: item.boards.title,
      background: item.boards.background,
      createdAt: item.boards.createdAt,
      ownerId: item.boards.ownerId,
      openedAt: item.boards.openedAt
    }))

    return {
      items: returnableItems,
      nextCursor,
      totalCount
    }
  }),
  create: protectedProcedure.input(createBoard).mutation(async ({ ctx, input }) => {
    const foundBoard = await ctx.db.query.boards.findFirst({
      where: and(eq(boards.title, input.title), eq(boards.ownerId, input.ownerId))
    })

    if (!!foundBoard) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Board already exists"
      })
    }

    return await ctx.db.insert(boards).values({
      ...input
    })
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

    return await ctx.db.query.boards.findMany({
      where: and(eq(boards.ownerId, userId), isNotNull(boards.openedAt)),
      orderBy: desc(boards.openedAt),
      limit: 5
    })
  })
})
