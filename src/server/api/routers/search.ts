import { boards, users } from "@/server/db/schema"
import { search } from "@/server/schema/search.schema"
import { like, or } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const searchRouter = createTRPCRouter({
  dropdown: protectedProcedure.input(search).query(async ({ ctx, input }) => {
    const { db } = ctx
    const { query, limit } = input

    const searchUsers = []
    const searchBoards = []

    if (query && query.length > 0) {
      searchBoards.push(like(boards.title, `%${query}%`))
      searchUsers.push(like(users.name, `%${query}%`))
    }

    const resultsBoard = db.query.boards.findMany({
      where: or(...searchBoards),
      limit,
    })

    const resultsUsers = db.query.users.findMany({
      where: or(...searchUsers),
      limit,
    })

    const results = await Promise.all([resultsBoard, resultsUsers])

    return {
      boards: results[0],
      users: results[1],
    };
  })
})
