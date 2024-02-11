import { z } from "zod"
import { workspaces } from "../db/schema"
import { createInsertSchema } from "drizzle-zod"

export const createWorkspace = createInsertSchema(workspaces)

export type CreateWorkspaceInput = z.TypeOf<typeof createWorkspace>

export const getWorkspacesByUserId= z.object({
  userId: z.string()
})
