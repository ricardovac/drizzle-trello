import { FC } from "react"
import { CardContextProvider } from "@/context/card-context"
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

  const boardQuery = await api.board.get.query({
    boardId: card?.list.boardId!
  })

  const permission = boardQuery.role
  const board = boardQuery.board

  return (
    <CardContextProvider card={card} board={board} permission={permission}>
      <CardDialog />
    </CardContextProvider>
  )
}

export default CardPage
