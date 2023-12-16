import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { boards, lists } from '~/server/db/schema';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), boardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const board = await db
        .select({ id: boards.id, createdById: boards.createdById })
        .from(boards)
        .where(eq(boards.id, input.boardId))
        .limit(1);

      if (board[0]?.createdById !== session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not the owner of this board',
        });
      }

      return await db
        .insert(lists)
        .values({ title: input.title, boardId: input.boardId })
        .execute();
    }),
  all: protectedProcedure.input(z.object({ boardId: z.number() })).query(async ({ ctx, input }) => {
    const { db } = ctx;

    const listsQuery = await db
      .select({ id: lists.id, title: lists.title, boardId: lists.boardId })
      .from(lists)
      .where(eq(lists.boardId, input.boardId))
      .execute();

    return listsQuery;
  }),
});
