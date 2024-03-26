"use client"

import {FC} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {CardContextProvider} from "@/context/card-context"
import {api} from "@/trpc/react"
import {RouterOutputs} from "@/trpc/shared"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../../../../components/ui/dialog"

import CardActivityForm from "./card-activity-form"
import CardDescriptionForm from "./card-description-form"
import CardLabels from "./card-labels"
import CardSidebar from "./card-sidebar"

interface CardDialogProps {
  initialCard: RouterOutputs["card"]["get"]
  initialBoard: RouterOutputs["board"]["get"]
}

const CardDialog: FC<CardDialogProps> = ({initialCard, initialBoard}) => {
  const router = useRouter()

  const {data: card} = api.card.get.useQuery(
    {cardId: initialCard?.id!},
    {
      initialData: initialCard,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  )

  const {data: boardQuery} = api.board.get.useQuery(
    {boardId: card?.list?.boardId!},
    {
      initialData: initialBoard,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  )

  const permission = boardQuery?.role
  const board = boardQuery.board

  const list = card?.list

  return (
    <CardContextProvider card={card} board={board} permission={permission}>
      <Dialog open onOpenChange={() => void router.back()}>
        <DialogContent className="overflow-hidden sm:max-w-[725px]">
          <div className="w-full">
            <DialogHeader className="w-full">
              <DialogTitle>{card?.title}</DialogTitle>
              <DialogDescription>
                na lista{" "}
                <Link href={`#`} className="underline">
                  {list?.title}
                </Link>
              </DialogDescription>
              <DialogClose/>
            </DialogHeader>
            <div className="flex justify-between gap-4">
              <div className="grid flex-1 grid-rows-2 gap-6 py-4">
                <CardLabels/>
                <CardDescriptionForm/>
                <CardActivityForm/>
              </div>
              <CardSidebar/>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CardContextProvider>
  )
}

export default CardDialog
