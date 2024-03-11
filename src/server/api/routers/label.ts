import { cardsToLabels, labels } from "@/server/db/schema"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const labelRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        labelId: z.string(),
        cardId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(cardsToLabels)
        .set({
          status: "removed"
        })
        .where(
          and(eq(cardsToLabels.labelId, input.labelId), eq(cardsToLabels.cardId, input.cardId))
        )
        .execute()
    }),
  add: protectedProcedure
    .input(
      z.object({
        labelId: z.string(),
        cardId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(cardsToLabels)
        .set({
          status: "active"
        })
        .where(
          and(eq(cardsToLabels.labelId, input.labelId), eq(cardsToLabels.cardId, input.cardId))
        )
        .execute()
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        color: z.string(),
        boardId: z.string(),
        cardId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx

      return await db.transaction(async (tx) => {
        await tx
          .insert(labels)
          .values({
            title: input.title,
            color: input.color,
            boardId: input.boardId
          })
          .execute()

        const [label] = await tx
          .select({ id: labels.id })
          .from(labels)
          .where(eq(labels.title, input.title))
          .execute()

        await tx.insert(cardsToLabels).values({
          cardId: input.cardId,
          labelId: label.id,
          status: "active"
        })
      })
    })
})
