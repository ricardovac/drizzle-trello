"use client"

import { type FC } from "react"
import { type SingleList } from "@/trpc/shared"
import { Card, CardContent } from "components/ui/card"
import { MoreHorizontal } from "lucide-react"

import CardForm from "./card-form"
import ListArea from "./list-area"
import ListHeader from "./list-header"

interface ListItemProps {
  list: SingleList
  columnId: string
}

const ListItem: FC<ListItemProps> = ({ list, columnId }) => {
  return (
    <Card id="listCard" className="w-[272px] rounded-md bg-slate-900">
      <div className="flex items-center justify-between gap-10">
        <ListHeader initialTitle={list.title} listId={list.id} />

        <MoreHorizontal />
      </div>

      <CardContent className="p-12">
        <ListArea cards={list.cards} columnId={columnId} />
      </CardContent>

      <CardForm list={list} />
    </Card>
  )
}

export default ListItem
