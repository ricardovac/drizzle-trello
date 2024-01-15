import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { boards, cards, lists } from '~/server/db/schema';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), boardId: z.string() }))
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

      try {
        await db
          .insert(lists)
          .values({ title: input.title, boardId: input.boardId, createdById: session.user.id })
          .execute();
      } catch (error) {
        throw new TRPCClientError('Error creating list');
      }
    }),
  all: protectedProcedure.input(z.object({ boardId: z.string() })).query(async ({ ctx, input }) => {
    const { db } = ctx;

    return await db.query.lists.findMany({
      orderBy: (lists, { asc }) => [asc(lists.createdAt)],
      where(fields) {
        return eq(fields.boardId, input.boardId);
      },
      with: {
        cards: {
          orderBy(_, operators) {
            return [operators.asc(cards.position)];
          },
        },
      },
    });
  }),
  editTitle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, title } = input;

      if (title === '') throw new TRPCClientError('Title cannot be empty');

      try {
        await db.update(lists).set({ title }).where(eq(lists.id, id)).execute();
      } catch (error) {
        throw new TRPCClientError('Error updating list');
      }
    }),
  updateCardPosition: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        position: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, position } = input;

      try {
        await db.update(cards).set({ position }).where(eq(cards.id, id)).execute();
      } catch (error) {
        throw new TRPCClientError('Error updating card position');
      }
    }),
});
