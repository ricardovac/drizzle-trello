import { FC } from "react"
import { api } from "@/trpc/server"

import CardDialog from "./_components/card-dialog"
import { CardContextProvider } from "@/context/card-context"
import { getServerAuthSession } from "@/server/auth"

interface CardPageProps {
  params: {
    id: string
    title: string
  }
}

const CardPage: FC<CardPageProps> = async ({ params }) => {
  const session = await getServerAuthSession();

  const data = await api.card.get.query({
    cardId: params.id
  })

  return (
    <CardContextProvider list={data.lists} card={data.cards}>
      <CardDialog />
    </CardContextProvider>
  )
}

export default CardPage
