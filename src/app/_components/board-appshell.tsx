"use client"

import { BackgroundTypeSchema } from "@/server/schema/board.shema"
import ScrollContainer from "react-indiana-drag-scroll"

import { useBoardContext } from "../context/board-context"

interface BoardAppShellProps {
  children: React.ReactNode
}

export default function BoardAppShell({ children }: BoardAppShellProps) {
  const { board } = useBoardContext()
  console.log(board)

  const background = board.background as unknown as BackgroundTypeSchema
  return (
    <>
      <ScrollContainer
        className="scroll-container"
        hideScrollbars={false}
        horizontal
        ignoreElements="#listCard"
        style={{
          backgroundColor: background.type === "color" ? background.value : undefined,
          backgroundImage: background.type === "image" ? `url(${background.value})` : undefined,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="flex gap-10">{children}</div>
      </ScrollContainer>
    </>
  )
}
