import z from "zod"

const type = z.enum(["boards", "users"])

export const searchSchema = z.object({
  query: z.string().optional(),
  limit: z.number().default(5),
  sort: z.enum(["desc", "asc"]).default("desc"),
  offset: z.number().default(0),
  type: type.optional(),
  cursor: z.string().optional()
})

export type SearchSchemaInput = z.TypeOf<typeof searchSchema>

export type SearchFilterTypes = z.TypeOf<typeof type>
