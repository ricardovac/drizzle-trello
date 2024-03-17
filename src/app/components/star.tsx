"use client"

import { useState } from "react"
import { useBoardContext } from "@/context/board-context"
import { api } from "@/trpc/react"
import { Button } from "components/ui/button"
import { cn } from "lib/utils"
import { Star as LucideStar } from "lucide-react"

export default function Star({ boardId }: { boardId: string }) {
  const { board } = useBoardContext()
  const [isStarred, setIsStarred] = useState(board.stars.length > 0)

  const { mutate: star } = api.board.star.useMutation()
  const { mutate: unstar } = api.board.unstar.useMutation()

  return (
    <Button
      onClick={() => {
        if (isStarred) {
          setIsStarred(false)
          unstar({ boardId })
          return;
        }

        setIsStarred(true)
        star({ boardId })
      }}
      className={cn("p-2 duration-200", isStarred && "text-white")}
      variant="ghostforeground"
      size="icon"
    >
      <LucideStar fill={isStarred ? "white" : "none"} className="size-5" />
    </Button>
  )
}
