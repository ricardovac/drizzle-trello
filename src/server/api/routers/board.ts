import { z } from 'zod';

import { TRPCError } from '@trpc/server';
import { desc, eq, gte, sql } from 'drizzle-orm';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { boards } from '~/server/db/schema';

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const boardsQuery = await ctx.db
      .select({ title: boards.title, background: boards.background })
      .from(boards)
      .where(eq(boards.id, input.id))
      .limit(1);

    const board = boardsQuery[0];

    if (!board) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }

    return {
      id: input.id,
      title: board.title,
      background: board.background,
      user: ctx.session.user,
    };
  }),
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const limit = input.limit ?? 20;
      const countRows = await db
        .select({
          board_count: sql<number>`count(${boards.id})`.as('board_count'),
        })
        .from(boards);
      const totalCount = countRows[0]?.board_count;
      if (totalCount === undefined) throw new Error('totalCount is undefined');

      let boardsQuery = db
        .select({
          id: boards.id,
          title: boards.title,
          background: boards.background,
          createdAt: boards.createdAt,
        })
        .from(boards)
        .where(eq(boards.createdById, input.userId))
        .orderBy(desc(boards.createdAt))
        .limit(input.limit);

      const cursor = input.cursor;
      if (cursor) {
        boardsQuery = boardsQuery.where(gte(boards.id, cursor));
      }
      const items = await boardsQuery.execute();

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      const returnableItems = items.map((item) => ({
        id: item.id,
        title: item.title,
        background: item.background,
        createdAt: item.createdAt,
      }));

      return {
        items: returnableItems,
        nextCursor,
        totalCount,
      };
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(2), background: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(boards).values({
        title: input.title,
        background: input.background,
        createdById: ctx.session.user.id,
      });
    }),
});
