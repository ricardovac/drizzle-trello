import { getServerAuthSession } from "@/server/auth"
import { api } from "@/trpc/server"

import CreateWorkspace from "./_components/create-workspace"

export default async function Home() {
  const session = await getServerAuthSession()

  const hasUser = !!session?.user?.id

  const workspace = await api.workspace.get.query({
    userId: session?.user.id!
  })

  return (
    <>
      <CreateWorkspace workspace={workspace} hasUser={hasUser} />
    </>
  )
}
