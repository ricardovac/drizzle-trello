import { env } from "@/env.mjs"
import { db } from "@/server/db"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { mysqlTable } from "drizzle-orm/mysql-core"
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"]
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id
      }
    }),
  },
  adapter: DrizzleAdapter(db, mysqlTable) as Adapter,
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        }
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  debug: process.env.NODE_ENV === "development" ? true : false,
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
