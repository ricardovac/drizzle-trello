"use client"

import { BackgroundTypeSchema } from "@/server/schema/board.schema"
import ScrollContainer from "react-indiana-drag-scroll"

import { useBoardContext } from "@/context/board-context"

interface BoardAppShellProps {
  children: React.ReactNode
}

export default function BoardAppShell({ children }: BoardAppShellProps) {
  const { board } = useBoardContext()

  const background = board.background as unknown as BackgroundTypeSchema
  return (
    <ScrollContainer
      className="relative h-[calc(100vh_-_2.00rem)] w-full overflow-x-auto overflow-y-hidden"
      horizontal
      ignoreElements="#list-card, #editable-title"
      style={{
        backgroundColor: background.type === "color" ? background.value : undefined,
        backgroundImage: background.type === "image" ? `url(${background.value})` : undefined,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      {children}
    </ScrollContainer>
  )
}
