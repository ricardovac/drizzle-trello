import { FC } from "react"
import { api } from "@/trpc/server"

import CardDialog from "./_components/card-dialog"

interface CardPageProps {
  params: {
    id: string
    title: string
  }
}

export function generateMetadata({ params }: CardPageProps) {
  return {
    title: decodeURIComponent(`${params.title} | drizzle-trello`)
  }
}

const CardPage: FC<CardPageProps> = async ({ params }) => {
  const card = await api.card.get.query({
    cardId: params.id
  })

  const board = await api.board.get.query({
    boardId: card?.list?.boardId!
  })

  return <CardDialog initialCard={card} initialBoard={board} />
}

export default CardPage
