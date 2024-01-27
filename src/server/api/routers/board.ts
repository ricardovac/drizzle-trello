import { TRPCError } from '@trpc/server';
import { desc, eq, gte, sql } from 'drizzle-orm';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { boards, users } from '~/server/db/schema';
import { createBoard, getAllBoards, getBoardById } from '~/server/schema/board.shema';

export const boardRouter = createTRPCRouter({
  get: protectedProcedure.input(getBoardById).query(async ({ ctx, input }) => {
    const board = await ctx.db.query.boards.findFirst({
      where: eq(boards.id, input.id),
      with: {
        owner: true,
      },
      columns: {
        title: true,
        background: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        public: true,
      },
    });

    if (!board) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }

    return {
      id: input.id,
      title: board.title,
      background: board.background,
      user: board.owner,
      ownerId: board.ownerId,
      public: board.public,
    };
  }),
  all: protectedProcedure.input(getAllBoards).query(async ({ ctx, input }) => {
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
      .select()
      .from(boards)
      .leftJoin(users, eq(users.id, boards.ownerId))
      .where(eq(boards.ownerId, input.userId))
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
      nextCursor = nextItem.boards.id;
    }

    const returnableItems = items.map((item) => ({
      id: item.boards.id,
      title: item.boards.title,
      background: item.boards.background,
      createdAt: item.boards.createdAt,
      owner: item.user,
    }));

    return {
      items: returnableItems,
      nextCursor,
      totalCount,
    };
  }),
  create: protectedProcedure.input(createBoard).mutation(async ({ ctx, input }) => {
    const foundBoard = await ctx.db.query.boards.findFirst({
      where: (fields) => eq(fields.title, input.title),
    });

    if (!!foundBoard) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Board already exists',
      });
    }

    return await ctx.db.insert(boards).values({
      ...input,
    });
  }),
});
