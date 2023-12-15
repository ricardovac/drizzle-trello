import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { boards, lists } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), boardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      // found the board by id
      const board = await db
        .select({ id: boards.id, createdById: boards.createdById })
        .from(boards)
        .where(eq(boards.id, input.boardId))
        .limit(1);

      if (!board[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found",
        });
      }

      if (board[0].createdById !== session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not the owner of this board",
        });
      }

      const newList = await db
        .insert(lists)
        .values({ title: input.title, boardId: input.boardId })
        .execute();

      return newList;
    }),
});
