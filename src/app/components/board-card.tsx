import Link from "next/link"
import { BackgroundTypeSchema } from "@/server/schema/board.schema"
import { type InfiniteBoard } from "@/trpc/shared"

import { BoardBackground } from "./board-background"

interface BoardCardProps {
  board?: InfiniteBoard["board"]
}

export default function BoardCard({ board }: BoardCardProps) {
  const image = board?.background as unknown as BackgroundTypeSchema

  return (
    <Link
      href={`/b/${board?.id}/${board?.title}`}
      className="relative cursor-pointer overflow-hidden rounded-md border"
      shallow
      scroll={false}
      prefetch={false}
    >
      <BoardBackground image={image}/>

      <h3 className="pointer-events-none absolute left-4 top-2 text-xl font-semibold text-white">
        {board?.title}
      </h3>
    </Link>
  )
}
