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

      return await db
        .insert(lists)
        .values({ title: input.title, boardId: input.boardId, createdById: session.user.id })
        .execute();
    }),
  all: protectedProcedure.input(z.object({ boardId: z.string() })).query(async ({ ctx, input }) => {
    const { db } = ctx;

    const listsQuery = await db.query.lists.findMany({
      where(fields) {
        return eq(fields.boardId, input.boardId);
      },
      with: { cards: true },
    });

    return listsQuery;
  }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      if (input.title === '') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No title provided',
        });
      }

      return await db
        .update(lists)
        .set({ title: input.title })
        .where(eq(lists.id, input.id))
        .execute();
    }),
  editCardList: protectedProcedure
    .input(
      z.object({
        cardId: z.string(),
        newListId: z.string().optional(),
        newOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      if (!!input.newOrder) {
        return await db
          .update(cards)
          .set({ order: input.newOrder })
          .where(eq(cards.id, input.cardId))
          .execute();
      }

      if (!!input.newListId) {
        return await db
          .update(cards)
          .set({ listId: input.newListId })
          .where(eq(cards.id, input.cardId))
          .execute();
      }
    }),
});
