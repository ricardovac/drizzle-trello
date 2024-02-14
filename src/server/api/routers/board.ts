import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { boardMembers, boardRoles, boards, users } from "@/server/db/schema"
import {
  createBoard,
  createRecent,
  getAllBoards,
  getBoardById,
  getRecent,
  updateBoard
} from "@/server/schema/board.schema"
import { TRPCError } from "@trpc/server"
import { and, desc, eq, gte, isNotNull, sql } from "drizzle-orm"

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(getBoardById).query(async ({ ctx, input }) => {
    const [board] = await ctx.db
      .select({
        id: boards.id,
        title: boards.title,
        background: boards.background,
        ownerId: boards.ownerId,
        public: boards.public,
        memberId: boardMembers.userId
      })
      .from(boards)
      .where(eq(boards.id, input.id))
      .leftJoin(boardMembers, eq(boardMembers.boardId, boards.id))
      .limit(1)
      .execute()

    if (!board) {
      throw new TRPCError({
        code: "NOT_FOUND"
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

    let boardsQuery = db
      .select({
        id: boards.id,
        title: boards.title,
        background: boards.background,
        createdAt: boards.createdAt,
        ownerId: boards.ownerId,
        openedAt: boards.openedAt,
        role: boardRoles.name
      })
      .from(boards)
      .leftJoin(boardRoles, eq(boardRoles.boardId, boards.id))
      .leftJoin(
        boardMembers,
        and(eq(boardMembers.boardId, boards.id), eq(boardMembers.roleId, boardRoles.id))
      )
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
      nextCursor = nextItem.id
    }

    const returnableItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      background: item.background,
      createdAt: item.createdAt,
      ownerId: item.ownerId,
      openedAt: item.openedAt,
      role: item.role
    }))

    return {
      items: returnableItems,
      nextCursor,
      totalCount
    }
  }),
  create: protectedProcedure.input(createBoard).mutation(async ({ ctx, input }) => {
    const board = await ctx.db.transaction(async (tx) => {
      const foundBoard = await tx
        .select({ id: boards.id })
        .from(boards)
        .where(and(eq(boards.title, input.title), eq(boards.ownerId, input.ownerId)))
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
        ...input
      })

      const [returnedBoard] = await tx
        .select({ id: boards.id })
        .from(boards)
        .where(and(eq(boards.title, input.title), eq(boards.ownerId, input.ownerId)))
        .orderBy(desc(boards.createdAt))
        .limit(1)

      if (!returnedBoard) {
        tx.rollback()
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Created board not found" })
      }

      await tx.insert(boardRoles).values({
        boardId: returnedBoard.id,
        name: "ADMIN"
      })

      const [adminRole] = await tx
        .select({ id: boardRoles.id })
        .from(boardRoles)
        .where(and(eq(boardRoles.boardId, returnedBoard.id), eq(boardRoles.name, "ADMIN")))
        .orderBy(desc(boardRoles.id))
        .limit(1)

      if (!adminRole) {
        tx.rollback()
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Admin role not found" })
      }

      await tx.insert(boardMembers).values({
        boardId: returnedBoard.id,
        roleId: adminRole.id,
        userId: input.ownerId
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

    return ctx.db
      .select({
        id: boards.id,
        title: boards.title,
        background: boards.background,
        createdAt: boards.createdAt,
        openedAt: boards.openedAt,
        ownerId: boards.ownerId
      })
      .from(boards)
      .where(and(eq(boards.ownerId, userId), isNotNull(boards.openedAt)))
      .orderBy(desc(boards.openedAt))
      .limit(5)
      .execute()
  })
})
