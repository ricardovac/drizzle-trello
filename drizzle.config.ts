import { env } from "@/env.mjs"
import { type Config } from "drizzle-kit"

export default {
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  breakpoints: true,
  dbCredentials: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  tablesFilter: ["trello-clone_*"],
  verbose: true,
  strict: true,
} satisfies Config
