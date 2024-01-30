"use client"

import { type FC } from "react"
import { api } from "@/trpc/react"
import { type SingleList } from "@/trpc/shared"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { MoreHorizontal } from "lucide-react"

import CardForm from "./card-form"
import EditableTitle from "./editable-title"
import ListArea from "./list-area"

interface ListItemProps {
  list: SingleList
  columnId: string
}

const ListItem: FC<ListItemProps> = ({ list, columnId }) => {
  const { mutate } = api.list.edit.useMutation()
  return (
    <Card id="list-card" className="flex h-fit min-w-[300px] max-w-[300px] flex-col">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-10">
            <EditableTitle
              title={list.title}
              onSave={(title) => mutate({ title, listId: list.id })}
            />

            <MoreHorizontal />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ListArea cards={list.cards} columnId={columnId} />
      </CardContent>

      <CardFooter>
        <CardForm list={list} />
      </CardFooter>
    </Card>
  )
}

export default ListItem
