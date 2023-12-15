import { boardRouter } from "~/server/api/routers/board";
import { createTRPCRouter } from "~/server/api/trpc";
import { listRouter } from "./routers/list";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  board: boardRouter,
  list: listRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
