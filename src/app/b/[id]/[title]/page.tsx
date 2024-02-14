import BoardContext from "@/context/board-context"
import { getServerAuthSession } from "@/server/auth"
import { api } from "@/trpc/server"
import { type SingleBoard } from "@/trpc/shared"

import BoardAppShell from "@/app/_components/board-appshell"
import BoardHeader from "@/app/_components/board-header"
import List from "@/app/_components/list"
import ListForm from "@/app/_components/list-form"

interface BoardPageProps {
  params: { id: string; title: string }
}

export function generateMetadata({ params }: BoardPageProps) {
  return {
    title: decodeURIComponent(`${params.title} | drizzle-trello`)
  }
}

export default async function Page({ params }: BoardPageProps) {
  const id = params.id

  const board = await api.board.get.query({ id })
  const initialLists = await api.list.all.query({
    boardId: id
  })
  const permission = await getBoardUserPermission(board)

  await api.board.createRecent.mutate({ boardId: board.id, userId: board.ownerId })

  return (
    <BoardContext lists={initialLists} board={board} permission={permission}>
      <BoardAppShell>
        <div className="absolute inset-x-0 top-0 flex size-full flex-col text-white">
          <BoardHeader />
          <div className="flex h-full flex-1 items-start gap-6 p-6">
            <List />
            {permission !== "VISITOR" && <ListForm />}
          </div>
        </div>
      </BoardAppShell>
    </BoardContext>
  )
}

export async function getBoardUserPermission(board: SingleBoard) {
  const session = await getServerAuthSession()

  if (board.ownerId === session?.user.id) {
    return "OWNER"
  }

  if (board.memberId === session?.user.id) {
    return "MEMBER"
  }

  if (!board.public) {
    throw new Error("This board is private!")
  }

  return "VISITOR"
}
