import { users, workspaceMembers, workspaceRoles, workspaces } from "@/server/db/schema"
import { createWorkspace, getWorkspacesByUserId } from "@/server/schema/workspace.schema"
import { TRPCError } from "@trpc/server"
import { and, desc, eq } from "drizzle-orm"

import { createTRPCRouter, protectedProcedure } from "../trpc"

export const workspaceRouter = createTRPCRouter({
  create: protectedProcedure.input(createWorkspace).mutation(async ({ ctx, input }) => {
    const { db } = ctx
    const { name, ownerId, description, type } = input

    const workspaceTransation = await db.transaction(async (trx) => {
      const [user] = await trx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, input.ownerId))
        .limit(1)

      if (!user.id) {
        trx.rollback()
        return
      }

      try {
        await trx
          .insert(workspaces)
          .values({
            name,
            ownerId,
            description,
            type
          })
          .execute()
      } catch (e) {
        return
      }

      const [workspace] = await trx
        .select({
          id: workspaces.id,
          name: workspaces.name
        })
        .from(workspaces)
        .where(and(eq(workspaces.name, name)))
        .orderBy(desc(workspaces.createdAt))
        .limit(1)

      if (!workspace.id) {
        trx.rollback()
        return
      }

      const OWNER_PERMISSION = "OWNER"

      await trx.insert(workspaceRoles).values({
        name: OWNER_PERMISSION,
        workspaceId: workspace.id
      })

      const [adminRole] = await trx
        .select({
          id: workspaceRoles.id
        })
        .from(workspaceRoles)
        .where(
          and(
            eq(workspaceRoles.workspaceId, workspace.id),
            eq(workspaceRoles.name, OWNER_PERMISSION)
          )
        )
        .orderBy(desc(workspaceRoles.createdAt))
        .limit(1)

      if (!adminRole.id) {
        trx.rollback()
        return
      }

      await trx.insert(workspaceRoles).values({
        name: "MEMBER",
        workspaceId: workspace.id
      })

      await trx.insert(workspaceMembers).values({
        memberId: ownerId,
        memberRoleId: adminRole.id,
        workspaceId: workspace.id
      })

      return workspace
    })

    if (!workspaceTransation) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao criar a área de trabalho"
      })
    }

    return workspaceTransation
  }),
  get: protectedProcedure.input(getWorkspacesByUserId).query(async ({ ctx, input }) => {
    const { db } = ctx
    const workspacesQuery = db
      .select()
      .from(workspaces)
      .leftJoin(users, eq(workspaceRoles.workspaceId, workspaces.id))
      .leftJoin(
        workspaceMembers,
        and(
          eq(workspaceMembers.workspaceId, workspaces.id),
          eq(workspaceMembers.memberRoleId, workspaceRoles.id)
        )
      )
      .where(eq(workspaceMembers.memberId, input.userId))
      .groupBy(workspaces.id)
      .orderBy(desc(workspaces.createdAt))
      .limit(5)

    return workspacesQuery;
  })
})
