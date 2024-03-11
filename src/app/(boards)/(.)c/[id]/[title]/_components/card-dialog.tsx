"use client"

import { FC } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCardContext } from "@/context/card-context"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog"

import CardActivityForm from "./card-activity-form"
import CardDescriptionForm from "./card-description-form"
import CardLabels from "./card-labels"
import CardSidebar from "./card-sidebar"
import { api } from "@/trpc/react"

const CardDialog: FC = () => {
  const router = useRouter()
  const { card: initialCard } = useCardContext()

  const { data: card } = api.card.get.useQuery({ cardId: initialCard?.id! })

  const list = card?.list

  return (
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
            <DialogClose />
          </DialogHeader>
          <div className="flex justify-between gap-4">
            <div className="grid flex-1 grid-rows-2 gap-6 py-4">
              <CardLabels />
              <CardDescriptionForm />
              <CardActivityForm />
            </div>
            <CardSidebar />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CardDialog
