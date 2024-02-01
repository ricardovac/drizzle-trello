import { FC } from "react"
import Image from "next/image"
import { BackgroundTypeSchema } from "@/server/schema/board.shema"

interface BoardImageProps {
  image: BackgroundTypeSchema
  width?: number
  height?: number
}

export const BoardImage: FC<BoardImageProps> = ({ image, width, height }) => {
  return (
    <>
      {image.type === "color" ? (
        <div
          className="aspect-[16/8]"
          style={{
            width: width ?? 500,
            height: height ?? 100,
            backgroundColor: image.value
          }}
        />
      ) : (
        <Image
          src={image.value}
          alt="Board Image"
          width={width ?? 500}
          height={height ?? 100}
          className="aspect-[16/8] object-cover transition-all hover:scale-105"
        />
      )}
    </>
  )
}
