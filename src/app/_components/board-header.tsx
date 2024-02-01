"use client"

import { FC } from "react"
import { api } from "@/trpc/react"

import { useBoardContext } from "../context/board-context"
import EditableTitle from "./editable-title"

const BoardHeader: FC = () => {
  const { board } = useBoardContext()
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
    </header>
  )
}

export default BoardHeader
