import Image from "next/image"
import Link from "next/link"
import { BackgroundTypeSchema } from "@/server/schema/board.shema"
import { type InfiniteBoard } from "@/trpc/shared"

interface BoardCardProps {
  board?: InfiniteBoard
}

export default function BoardCard({ board }: BoardCardProps) {
  const image = board?.background as unknown as BackgroundTypeSchema

  return (
    <Link
      href={`/b/${board?.id}/${board?.title}`}
      className="relative cursor-pointer overflow-hidden rounded-md border"
    >
      {image.type === "color" ? (
        <div
          className="aspect-[16/8] w-full"
          style={{
            backgroundColor: image.value
          }}
        />
      ) : (
        <Image
          src={image.value}
          alt="Board Image"
          width={500}
          height={100}
          className="aspect-[16/8] w-full object-cover transition-all hover:scale-105"
        />
      )}

      <h3 className="pointer-events-none absolute left-4 top-2 text-xl font-semibold text-white">
        {board?.title}
      </h3>
    </Link>
  )
}
