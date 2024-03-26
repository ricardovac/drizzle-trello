import {getServerAuthSession} from "@/server/auth"

import "@/styles/globals.css"
import {redirect} from "next/navigation"
import {AuthContextProvider} from "@/context/auth-context"
import {MainHeader} from "@/app/components/header/main-header";

export default async function BoardsLayout({children}: { children: React.ReactNode }) {
  const session = await getServerAuthSession()

  if (!session) redirect("/api/auth/signin")

  const user = session.user

  return (
    <AuthContextProvider user={user}>
      <>
        <MainHeader/>
        {children}
      </>
    </AuthContextProvider>
  )
}
