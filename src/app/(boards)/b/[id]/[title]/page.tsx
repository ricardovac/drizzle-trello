import BoardContext from "@/context/board-context"
import {api} from "@/trpc/server"

import BoardAppShell from "../../_components/board/board-appshell"
import BoardHeader from "../../_components/board/board-header"
import List from "../../_components/list/list"
import ListForm from "../../_components/list/list-form"

interface BoardPageProps {
  params: { id: string; title: string }
}

export function generateMetadata({params}: BoardPageProps) {
  return {
    title: decodeURIComponent(`${params.title} | drizzle-trello`)
  }
}

export default async function Page({params}: BoardPageProps) {
  const id = params.id

  const {board, role} = await api.board.get.query({boardId: id})
  const initialLists = await api.list.all.query({
    boardId: id
  })

  await api.recent.create.mutate({boardId: id, userId: board.ownerId!})

  const members = await api.member.get.query({boardId: id, ownerId: board.ownerId!})

  return (
    <BoardContext lists={initialLists} board={board} permission={role} members={members}>
      <BoardAppShell>
        <div className="absolute inset-x-0 top-0 flex size-full flex-col text-white">
          <BoardHeader/>
          <div className="flex h-full flex-1 items-start gap-6 p-6">
            <List/>
            {(role === "admin" || role === "member") && <ListForm/>}
          </div>
        </div>
      </BoardAppShell>
    </BoardContext>
  )
}
