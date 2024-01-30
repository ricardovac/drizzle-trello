import { getServerAuthSession } from "@/server/auth"

import "@/styles/globals.css"
import { SidebarNav } from "../_components/sidebar"
import { AuthContextProvider } from "../context/auth-context"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession()
  if (!session) return null

  const user = session.user

  return (
    <AuthContextProvider user={user}>
      <div className="container flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
          <SidebarNav />
        </aside>
        {children}
      </div>
    </AuthContextProvider>
  )
}
