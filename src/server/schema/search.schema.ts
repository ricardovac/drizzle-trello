import z from "zod"

const type = z.enum(["boards", "workspaces", "starred", "users", "comments"])

export const search = z.object({
  query: z.string(),
  limit: z.number(),
  cursor: z.string().nullish(),
})

export type searchSchema = z.TypeOf<typeof search>

export type SearchFilterTypes = z.TypeOf<typeof type>
