import { labels } from "@/server/db/schema"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const labelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        color: z.string(),
        boardId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx
      return await db
        .insert(labels)
        .values({
          title: input.title,
          color: input.color,
          boardId: input.boardId
        })
        .execute()
    })
})
