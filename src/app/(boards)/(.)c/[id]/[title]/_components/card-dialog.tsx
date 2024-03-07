"use client"

import { FC, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/auth-context"
import { useCardContext } from "@/context/card-context"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { UserAvatar } from "@/app/components/user-avatar"

import CardDescriptionForm from "./card-description-form"
import CardSidebar from "./card-sidebar"

const CardDialog: FC = () => {
  const router = useRouter()
  const { user } = useAuthContext()
  const { list, card } = useCardContext()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[725px]">
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
              <CardDescriptionForm />
              <div className="flex flex-col items-start gap-4">
                <Label htmlFor="username" className="text-right">
                  Atividade
                </Label>
                <div className="flex w-full gap-2">
                  <UserAvatar user={user} />
                  <Input id="Activity" placeholder="Escrever um comentário..." />
                </div>
              </div>
            </div>
            <CardSidebar />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CardDialog
