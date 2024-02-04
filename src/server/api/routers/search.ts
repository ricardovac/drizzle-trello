import { boards } from "@/server/db/schema"
import { search } from "@/server/schema/search.schema"
import { and, desc, gte, like, or, sql } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const searchRouter = createTRPCRouter({
  searchBoard: protectedProcedure.input(search).query(async ({ ctx, input }) => {
    const { db } = ctx
    const { query } = input

    const limit = input.limit ?? 20
    const countRows = await db
      .select({
        board_count: sql<number>`count(${boards.id})`.as("board_count")
      })
      .from(boards)
      .where(or(like(boards.title, `%${query}%`)))
    const totalCount = countRows[0]?.board_count
    if (totalCount === undefined) throw new Error("totalCount is undefined")

    let boardsQuery = db
      .select()
      .from(boards)
      .where(or(like(boards.title, `%${query}%`)))
      .orderBy(desc(boards.createdAt))
      .limit(limit)

    const cursor = input.cursor
    if (cursor) {
      boardsQuery = boardsQuery.where(and(like(boards.title, `%${query}%`), gte(boards.id, cursor)))
    }
    const items = await boardsQuery.execute();

    let nextCursor: typeof input.cursor | undefined = undefined
    if (items.length > limit) {
      const nextItem = items.pop()!
      nextCursor = nextItem.id
    }

    const returnableItems = items.map((item) => {
      return {
        title: item.title,
        background: item.background,
      }
    })

    return {
      items: returnableItems,
      nextCursor
    }
  })
})
