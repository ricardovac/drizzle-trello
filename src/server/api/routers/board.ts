import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { boardMembers, boards, users } from "@/server/db/schema"
import { createBoard, getAllBoards, getBoardById, updateBoard } from "@/server/schema/board.schema"
import { TRPCError } from "@trpc/server"
import { and, desc, eq, sql } from "drizzle-orm"

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(getBoardById).query(async ({ ctx, input }) => {
    const { session } = ctx
    const { boardId } = input
    const userId = session.user.id

    const board = await ctx.db
      .select({
        board: {
          id: boards.id,
          title: boards.title,
          background: boards.background,
          ownerId: boards.ownerId
        },
        role: boardMembers.role
      })
      .from(boardMembers)
      .innerJoin(boards, eq(boards.id, boardMembers.boardId))
      .where(and(eq(boardMembers.userId, userId), eq(boardMembers.boardId, boardId)))
      .limit(1)
      .execute()

    if (board.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Board not found"
      })
    }

    return board[0]
  }),
  all: protectedProcedure.input(getAllBoards).query(async ({ ctx, input }) => {
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

    let userBoards = await db
      .select({
        board: {
          id: boards.id,
          title: boards.title,
          background: boards.background
        },
        user: {
          name: users.name
        },
        role: boardMembers.role
      })
      .from(boardMembers)
      .innerJoin(boards, eq(boards.id, boardMembers.boardId))
      .innerJoin(users, eq(users.id, boardMembers.userId))
      .where(
        onlyAdmin
          ? and(eq(boardMembers.userId, userId), eq(boardMembers.role, "admin"))
          : eq(boardMembers.userId, userId)
      )
      .execute()

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
  create: protectedProcedure.input(createBoard).mutation(async ({ ctx, input }) => {
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
  edit: protectedProcedure.input(updateBoard).mutation(async ({ ctx, input }) => {
    const foundBoard = await ctx.db
      .select({ id: boards.id })
      .from(boards)
      .where(eq(boards.id, input.boardId))
      .limit(1)
      .execute()

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
