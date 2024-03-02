"use client"

import { FC } from "react"
import { useBoardContext } from "@/context/board-context"
import { api } from "@/trpc/react"

import EditableTitle from "./editable-title"
import AddMember from "./members/add-member"
import { UserAvatar } from "./user-avatar"

const BoardHeader: FC = () => {
  const { board, permission, members } = useBoardContext()
  const { mutate } = api.board.edit.useMutation()

  return (
    <header
      className="flex w-screen items-center gap-2 bg-background/10 px-8 py-4 backdrop-blur-sm dark:bg-background/50"
      id="editable-title"
    >
      <h1 className="mr-auto text-xl font-semibold">
        <EditableTitle
          title={board.title}
          onSave={(title) => mutate({ title, boardId: board.id })}
          className="text-lg"
        />
      </h1>

      <div className="flex space-x-2">
        {members?.map((member, idx) => (
          <div className="flex gap-4" key={idx}>
            <UserAvatar user={member.user!} />
          </div>
        ))}

        <div className="flex items-center gap-4">{permission === "admin" && <AddMember />}</div>
      </div>
    </header>
  )
}

export default BoardHeader
