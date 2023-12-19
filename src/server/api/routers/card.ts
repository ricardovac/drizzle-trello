import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { cards, lists } from '~/server/db/schema';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string(), listId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const list = await db
        .select({ id: lists.id, createdById: lists.boardId })
        .from(lists)
        .where(eq(lists.id, input.listId))
        .limit(1);

      if (list[0]?.createdById !== session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not the owner of this board',
        });
      }

      return await db
        .insert(cards)
        .values({ title: input.title, description: input.description, listId: input.listId })
        .execute();
    }),
});
