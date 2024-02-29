import { cards } from "@/server/db/schema"
import { createCard, updateCard, updateCardPosition } from "@/server/schema/card.schema"
import { asc, eq, sql } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const cardRouter = createTRPCRouter({
  create: protectedProcedure.input(createCard).mutation(async ({ ctx, input }) => {
    const { db } = ctx

    const cardsQuery = await db
      .select({ position: cards.position })
      .from(cards)
      .where(sql`${cards.listId} = ${input.listId}`)
      .orderBy(asc(cards.position))

    return await db
      .insert(cards)
      .values({
        title: input.title,
        description: input.description,
        listId: input.listId,
        position: (cardsQuery.at(-1)?.position ?? 0) + 1
      })
      .execute()
  }),
  updateCardPositions: protectedProcedure
    .input(updateCardPosition)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(cards)
        .set({ position: input.position })
        .where(eq(cards.id, input.cardId))
        .execute()
    }),
  updateCard: protectedProcedure.input(updateCard).mutation(async ({ ctx, input }) => {
    const { db } = ctx
    const { cardId, card } = input

    return await db
      .update(cards)
      .set({ id: cardId, listId: card.listId })
      .where(eq(cards.id, cardId))
      .execute()
  })
})
