import {getServerAuthSession} from "@/server/auth"

import "@/styles/globals.css"
import {redirect} from "next/navigation"
import {AuthContextProvider} from "@/context/auth-context"

import {SidebarNav} from "@/app/components/sidebar"

export default async function MainLayout({children}: { children: React.ReactNode }) {
  const session = await getServerAuthSession()

  if (!session) redirect("/api/auth/signin")

  const user = session.user

  return (
    <AuthContextProvider user={user}>
      <div className="container flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside
          className="fixed top-14 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto  md:sticky md:block lg:py-10">
          <SidebarNav/>
        </aside>
        <div className="flex flex-col gap-10 py-8">
          {children}
        </div>
      </div>
    </AuthContextProvider>
  )
}
