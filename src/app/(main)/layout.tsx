import { getServerAuthSession } from "@/server/auth"

import "@/styles/globals.css"
import { WorkspaceLinksGroup } from "../_components/sidebar"
import { AuthContextProvider } from "../context/auth-context"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession()
  if (!session) return null

  const user = session.user

  return (
    <AuthContextProvider user={user}>
      <div className="container my-32">
        <div className="flex gap-20">
          <WorkspaceLinksGroup session={session} />
          <div>{children}</div>
        </div>
      </div>
    </AuthContextProvider>
  )
}
