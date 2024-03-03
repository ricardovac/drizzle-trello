import { env } from "@/env.mjs"
import { drizzle } from "drizzle-orm/mysql2"
import * as mysql from "mysql2/promise"

import * as schema from "./schema"

const connection = await mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  database: env.DB_NAME,
  password: env.DB_PASSWORD
})

export const db = drizzle(connection, { schema, mode: "default" })
