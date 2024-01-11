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

      if (list[0]?.createdById !== session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not the owner of this board',
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
          position: lastPosition,
        })
        .execute();
    }),
});
