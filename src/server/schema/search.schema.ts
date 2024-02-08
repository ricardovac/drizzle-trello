import z from "zod"

const type = z.enum(["boards", "users"])

export const search = z.object({
  query: z.string().optional(),
  limit: z.number().default(5),
  sort: z.enum(["desc", "asc"]).default("desc"),
  offset: z.number().default(0),
  type: type.default("boards"),
  cursor: z.string().optional()
})

export type searchSchema = z.TypeOf<typeof search>

export type SearchFilterTypes = z.TypeOf<typeof type>
