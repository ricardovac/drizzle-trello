import { FC } from "react"
import Image from "next/image"
import { BackgroundTypeSchema } from "@/server/schema/board.schema"

interface BoardBackgroundProps {
  image: BackgroundTypeSchema
  width?: number
  height?: number
}

export const BoardBackground: FC<BoardBackgroundProps> = ({ image, width, height }) => {
  return (
    <>
      {image.type === "image" ? (
        <Image
          src={image.value}
          alt="Board Image"
          width={width ?? 500}
          height={height ?? 100}
          className="aspect-[16/8] object-cover transition-all hover:scale-105"
          priority
        />
      ) : (
        <div
          className="aspect-[16/8] w-full"
          style={
            image.type === "color" || "gradient"
              ? { background: image.value, width, height }
              : { backgroundImage: `url(${image.value})`, width, height }
          }
        />
      )}
    </>
  )
}
