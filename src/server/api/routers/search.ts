import { boardMembers, boards, users } from "@/server/db/schema"
import { searchSchema } from "@/server/schema/search.schema"
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm"
import { withCursorPagination } from "drizzle-pagination"

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
      const boardsQuery = db.query.boards.findMany({
        ...withCursorPagination({
          where: and(like(boards.title, `%${query}%`), eq(boardMembers.userId, userId)),
          cursors: [[boards.id, "asc", cursor]],
          limit
        }),
        with: { owner: true },
        offset,
        orderBy: sort === "desc" ? desc(boards.createdAt) : asc(boards.createdAt)
      })

      const items = await boardsQuery.execute()

      const returnableItems = items.map((item) => ({
        id: item.id,
        title: item.title,
        background: item.background,
        ownerId: item.ownerId,
        owner: item.owner
      }))

      return {
        items: returnableItems,
        nextCursor: items.length ? items[items.length - 1].id : undefined
      }
    }

    const fetchUsers = async () => {
      const usersQuery = db.query.users.findMany({
        ...withCursorPagination({
          where: or(like(users.name, `%${query}%`), like(users.email, `%${query}%`)),
          cursors: [[users.id, "asc", cursor]],
          limit
        }),
        orderBy: sort === "desc" ? desc(users.name) : asc(users.name)
      })

      const items = await usersQuery.execute()

      const returnableItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        image: item.image
      }))

      return {
        items: returnableItems,
        nextCursor: items.length ? items[items.length - 1].id : undefined
      }
    }

    switch (type) {
      case "boards":
        const fetchedBoards = await fetchBoards()
        return {
          boards: fetchedBoards.items,
          nextCursor: fetchedBoards.nextCursor,
          type: "boards" as const
        }
      case "users":
        const fetchedUsers = await fetchUsers()
        return {
          users: fetchedUsers.items,
          nextCursor: fetchedUsers.nextCursor,
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
