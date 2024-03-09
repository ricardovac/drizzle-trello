import { boardRouter } from "@/server/api/routers/board"
import { createTRPCRouter } from "@/server/api/trpc"

import { cardRouter } from "./routers/card"
import { listRouter } from "./routers/list"
import { searchRouter } from "./routers/search"
import { memberRouter } from "./routers/member"
import { recentRouter } from "./routers/recent"
import { labelRouter } from "./routers/label"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  board: boardRouter,
  list: listRouter,
  card: cardRouter,
  search: searchRouter,
  member: memberRouter,
  recent: recentRouter,
  label: labelRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
