import { createId } from "@paralleldrive/cuid2"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  index,
  int,
  json,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { type AdapterAccount } from "next-auth/adapters"

const ID_LENGTH = 24

export const boards = mysqlTable(
  "boards",
  {
    id: varchar("id", { length: ID_LENGTH })
      .$defaultFn(() => createId())
      .primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    background: json("background"),
    public: boolean("public").default(false),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    openedAt: timestamp("opened_at").onUpdateNow(),
    ownerId: varchar("ownerId", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
  },
  (boards) => ({
    ownerIdIdx: index("ownerId_idx").on(boards.ownerId)
  })
)

export const boardsRelations = relations(boards, ({ many, one }) => ({
  lists: many(lists),
  users: one(users, { fields: [boards.ownerId], references: [users.id] })
}))

export const boardMembers = mysqlTable(
  "boardMembers",
  {
    id: varchar("id", { length: ID_LENGTH })
      .$defaultFn(() => createId())
      .primaryKey(),
    boardId: varchar("board_id", { length: ID_LENGTH })
      .notNull()
      .references(() => boards.id),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id),
    roleId: varchar("role_id", { length: 128 })
      .notNull()
      .references(() => boardRoles.id)
  },
  (bm) => ({
    compoundKey: primaryKey(bm.boardId, bm.userId)
  })
)

export const boardRoles = mysqlTable("boardRoles", {
  id: varchar("id", { length: ID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  boardId: varchar("board_id", { length: 128 })
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" })
})

export const lists = mysqlTable("lists", {
  id: varchar("id", { length: ID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  position: int("position").notNull(),
  boardId: varchar("board_id", { length: 128 })
    .notNull()
    .references(() => boards.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow()
})

export const listsRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, { fields: [lists.boardId], references: [boards.id] }),
  cards: many(cards)
}))

export const cards = mysqlTable("cards", {
  id: varchar("id", { length: ID_LENGTH })
    .$defaultFn(() => createId())
    .primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  listId: varchar("listId", { length: 128 }).notNull(),
  position: int("position").notNull()
})

export const cardsRelations = relations(cards, ({ one }) => ({
  list: one(lists, { fields: [cards.listId], references: [lists.id] })
}))

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 })
})

export const usersRelations = relations(users, ({ many }) => ({
  board: many(boards),
  accounts: many(accounts)
}))

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 })
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId)
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] })
}))

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId)
  })
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}))

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token)
  })
)
