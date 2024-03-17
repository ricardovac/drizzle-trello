import { boardMembers, boards, users } from "@/server/db/schema"
import { searchSchema } from "@/server/schema/search.schema"
import { and, asc, desc, eq, gte, like, or, sql } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const searchRouter = createTRPCRouter({
  byType: protectedProcedure.input(searchSchema).query(async ({ ctx, input }) => {
    const { limit, query, sort, cursor, offset, type } = input
    const { db, session } = ctx
    const userId = session.user.id

    const countRows = await db
      .select({
        board_count: sql<number>`count(${boards.id})`.as("board_count")
      })
      .from(boards)
    const totalCount = countRows[0]?.board_count
    if (totalCount === undefined) throw new Error("totalCount is undefined")

    const fetchBoards = async () => {
      let boardsQuery = db
        .select({
          id: boards.id,
          title: boards.title,
          background: boards.background,
          ownerId: boards.ownerId
        })
        .from(boards)
        .leftJoin(boardMembers, eq(boards.id, boardMembers.boardId))
        .where(and(like(boards.title, `%${query}%`), eq(boardMembers.userId, userId)))
        .orderBy(sort === "desc" ? desc(boards.createdAt) : asc(boards.createdAt))
        .limit(limit)
        .offset(offset)

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
        ownerId: item.ownerId
      }))

      return {
        items: returnableItems,
        nextCursor
      }
    }

    const fetchUsers = async () => {
      let usersQuery = db
        .select()
        .from(users)
        .where(or(like(users.name, `%${query}%`), like(users.email, `%${query}%`)))
        .orderBy(sort === "desc" ? desc(users.name) : asc(users.name))
        .limit(limit)
        .offset(offset)

      if (cursor) {
        usersQuery = usersQuery.where(gte(boards.id, cursor))
      }

      const items = await usersQuery.execute()
      let nextCursor: typeof input.cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()!
        nextCursor = nextItem.id
      }

      const returnableItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        image: item.image
      }))

      return {
        items: returnableItems,
        nextCursor
      }
    }

    switch (type) {
      case "boards":
        const fetchedBoards = await fetchBoards()
        return {
          boards: fetchedBoards.items,
          type: "boards" as const
        }
      case "users":
        const fetchedUsers = await fetchUsers()
        return {
          users: fetchedUsers.items,
          type: "users" as const
        }
      default:
        const boards = await fetchBoards()
        const users = await fetchUsers()

        if (!!boards.items.length) {
          return {
            boards: boards.items,
            type: "boards" as const
          }
        }

        if (!!users.items.length) {
          return {
            users: users.items,
            type: "users" as const
          }
        }
    }
  })
})
