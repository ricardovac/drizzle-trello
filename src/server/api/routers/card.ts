import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { cards, lists } from '~/server/db/schema';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string().nullish(), listId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const list = await db
        .select({ id: lists.id, createdById: lists.createdById })
        .from(lists)
        .where(eq(lists.id, input.listId))
        .limit(1);

      // This will be changed once i implement the sharing feature
      if (list[0]?.createdById !== session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `${session.user.id} is not the owner of this list ${list[0]?.createdById}}}`,
        });
      }

      const lastCard = await db
        .select({ position: cards.position })
        .from(cards)
        .where(eq(cards.listId, input.listId))
        .orderBy(desc(cards.position))
        .limit(1);

      const lastPosition = lastCard[0]?.position ?? 0;

      return await db
        .insert(cards)
        .values({
          title: input.title,
          description: input.description,
          listId: input.listId,
          position: lastPosition + 1,
        })
        .execute();
    }),
  move: protectedProcedure
    .input(z.object({ cardId: z.string(), listId: z.string(), position: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { cardId, listId, position } = input;
      const { db, session } = ctx;

      const list = await db
        .select({ id: lists.id, createdById: lists.createdById })
        .from(lists)
        .where(eq(lists.id, input.listId))
        .limit(1);

      if (list[0]?.createdById !== session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `${session.user.id} is not the owner of this list ${list[0]?.createdById}}}`,
        });
      }

      if (list.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `List ${listId} not found`,
        });
      }

      return await db.update(cards).set({ listId, position }).where(eq(cards.id, cardId)).execute();
    }),
});
