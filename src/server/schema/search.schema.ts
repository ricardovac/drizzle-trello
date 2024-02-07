import z from "zod"

const type = z.enum(["boards", "workspaces", "starred", "users", "comments"])

export const search = z.object({
  query: z.string().optional(),
  limit: z.number().default(5),
  sort: z.enum(["desc", "asc"]).default("desc")
})

export type searchSchema = z.TypeOf<typeof search>

export type SearchFilterTypes = z.TypeOf<typeof type>
