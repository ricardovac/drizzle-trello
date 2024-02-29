import { env } from "@/env.mjs"
import { type Config } from "drizzle-kit"

export default {
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  breakpoints: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL
  },
} satisfies Config
