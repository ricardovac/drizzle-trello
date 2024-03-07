"use client"

import {useBoardContext} from "@/context/board-context"
import {BackgroundTypeSchema} from "@/server/schema/board.schema"
import ScrollContainer from "react-indiana-drag-scroll"
import React from "react";

interface BoardAppShellProps {
  children: React.ReactNode
}

export default function BoardAppShell({children}: BoardAppShellProps) {
  const {board} = useBoardContext()
  const background = board.background as unknown as BackgroundTypeSchema

  return (
    <ScrollContainer
      className="relative h-[calc(100vh_-_2.00rem)] w-full overflow-x-auto overflow-y-hidden"
      horizontal
      ignoreElements="#list-card, #editable-title"
      style={{
        background:
          background.type === "image" ? `url(${background.value})` : background.value,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      {children}
    </ScrollContainer>
  )
}
