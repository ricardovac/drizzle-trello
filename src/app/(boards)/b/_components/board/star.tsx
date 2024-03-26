"use client"

import {api} from "@/trpc/react"
import {Button} from "../../../../../../components/ui/button"
import {cn} from "../../../../../../lib/utils"
import {Star as LucideStar} from "lucide-react"

export default function Star({boardId}: { boardId: string }) {
  const {refetch, data: item} = api.board.get.useQuery({boardId})

  const {mutate: star} = api.board.star.useMutation({
    onSettled() {
      refetch()
    }
  })
  const {mutate: unstar} = api.board.unstar.useMutation({
    onSettled() {
      refetch()
    }
  })

  const hasLiked = item?.board.stars.length! > 0

  return (
    <Button
      onClick={() => {
        if (hasLiked) {
          unstar({boardId})
          return
        }

        star({boardId})
      }}
      className={cn("p-2 duration-200", hasLiked && "text-white")}
      variant="ghostforeground"
      size="icon"
    >
      <LucideStar fill={hasLiked ? "white" : "none"} className="size-5"/>
    </Button>
  )
}
