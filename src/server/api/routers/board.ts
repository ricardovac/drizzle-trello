import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { boardMembers, boards, stars } from "@/server/db/schema"
import {
  createBoardSchema,
  getAllBoardsSchema,
  getBoardByIdSchema,
  starBoardSchema,
  updateBoardSchema
} from "@/server/schema/board.schema"
import { TRPCError } from "@trpc/server"
import { and, desc, eq, sql } from "drizzle-orm"

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(getBoardByIdSchema).query(async ({ ctx, input }) => {
    const { session } = ctx
    const { boardId } = input
    const userId = session.user.id

    const [[starsCount], item] = await Promise.all([
      ctx.db
        .select({
          value: sql<number>`count(${stars.id})`.as("value")
        })
        .from(stars)
        .where(eq(stars.boardId, boardId))
        .execute(),
      ctx.db.query.boardMembers.findFirst({
        with: {
          board: {
            with: {
              labels: true,
              stars: true,
              owner: true
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
    ])

    if (!item) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Board not found"
      })
    }

    return {
      role: item.role,
      board: {
        ...item.board,
        starsCount: starsCount.value
      }
    }
  }),

  all: protectedProcedure.input(getAllBoardsSchema).query(async ({ ctx, input }) => {
    const { db } = ctx
    const { userId } = input

    const limit = input.limit ?? 20
    const countRows = await db
      .select({
        board_count: sql<number>`count(${boards.id})`.as("board_count")
      })
      .from(boards)
    const totalCount = countRows[0]?.board_count
    if (totalCount === undefined) throw new Error("totalCount is undefined")

    const [usersQuery, membersQuery] = await Promise.all([
      db.query.boardMembers.findMany({
        where: and(eq(boardMembers.userId, userId), eq(boardMembers.role, "admin")),
        limit,
        columns: { role: true },
        with: {
          user: {
            columns: {
              name: true
            }
          },
          board: true
        }
      }),
      db.query.boardMembers.findMany({
        where: and(eq(boardMembers.userId, userId), eq(boardMembers.role, "member")),
        limit,
        columns: { role: true },
        with: {
          user: {
            columns: {
              name: true
            }
          },
          board: true
        }
      })
    ])

    let nextCursor: string | undefined = undefined

    if (usersQuery.length) {
      nextCursor = usersQuery[usersQuery.length - 1].board.id
    } else if (membersQuery.length) {
      nextCursor = membersQuery[membersQuery.length - 1].board.id
    }

    return {
      usersQuery,
      membersQuery,
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
  }),
  star: protectedProcedure.input(starBoardSchema).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx
    const userId = session.user.id

    return await db.insert(stars).values({
      boardId: input.boardId,
      userId
    })
  }),
  unstar: protectedProcedure.input(starBoardSchema).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx
    const userId = session.user.id

    return await db
      .delete(stars)
      .where(and(eq(stars.boardId, input.boardId), eq(stars.userId, userId)))
  }),
  starredBoards: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx
    const userId = session.user.id

    const starredBoards = await db.query.stars.findMany({
      where: eq(stars.userId, userId),
      with: {
        board: {
          with: { owner: true },
          columns: {
            id: true,
            title: true,
            background: true
          }
        }
      }
    })

    if (!starredBoards) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Starred boards not found"
      })
    }

    const boards = starredBoards.map((b) => b.board)

    return boards
  })
})
