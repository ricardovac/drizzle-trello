import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { boards } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, gte, sql, desc } from "drizzle-orm";

export const boardRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const boardsQuery = await ctx.db
        .select({ title: boards.title, background: boards.background })
        .from(boards)
        .where(eq(boards.id, input.id))
        .limit(1);

      const board = boardsQuery[0];

      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return {
        title: board.title,
        background: board.background,
        user: ctx.session.user,
      };
    }),
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.date().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const limit = input.limit ?? 20;
      const countRows = await db
        .select({
          board_count: sql<number>`count(${boards.id})`.as("board_count"),
        })
        .from(boards);
      const totalCount = countRows[0]?.board_count;
      if (totalCount === undefined) throw new Error("totalCount is undefined");

      let boardsQuery = db
        .select({
          id: boards.id,
          title: boards.title,
          background: boards.background,
          createdAt: boards.createdAt,
        })
        .from(boards)
        .where(eq(boards.createdById, session.user.id))
        .orderBy(desc(boards.createdAt))
        .limit(input.limit);

      const cursor = input.cursor;
      if (cursor) {
        boardsQuery = boardsQuery.where(gte(boards.createdAt, cursor));
      }
      const items = await boardsQuery.execute();

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.createdAt;
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
      const newBoard = await ctx.db.insert(boards).values({
        title: input.title,
        background: input.background,
        createdById: ctx.session.user.id,
      });

      return newBoard;
    }),
  latest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.boards.findFirst({
      orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });
  }),
});
