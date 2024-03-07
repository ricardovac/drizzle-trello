import { boards, cards, lists } from "@/server/db/schema"
import { createCard, getCard, updateCard, updateCardPosition } from "@/server/schema/card.schema"
import { asc, eq } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const cardRouter = createTRPCRouter({
  get: protectedProcedure.input(getCard).query(async ({ ctx, input }) => {
    const result = await ctx.db
      .select()
      .from(cards)
      .where(eq(cards.id, input.cardId))
      .leftJoin(lists, eq(cards.listId, lists.id))
      .limit(1)
      .execute()

    return result[0];
  }),
  create: protectedProcedure.input(createCard).mutation(async ({ ctx, input }) => {
    const { db } = ctx

    const cardsQuery = await db.query.cards.findMany({
      where: (cards, { eq }) => eq(cards.listId, input.listId),
      orderBy: [asc(cards.position)],
      columns: {
        position: true
      }
    })

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
      .set({ id: cardId, listId: card.listId!, description: card.description! })
      .where(eq(cards.id, cardId))
      .execute()
  })
})
