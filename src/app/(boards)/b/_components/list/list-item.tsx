"use client"

import {type FC} from "react"
import {useBoardContext} from "@/context/board-context"
import {api} from "@/trpc/react"
import {type SingleList} from "@/trpc/shared"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../../../../../../components/ui/card"
import {MoreHorizontal} from "lucide-react"

import CardArea from "@/app/(boards)/b/_components/card/card-area"

import CardForm from "../card/card-form"
import EditableTitle from "../board/editable-title"

interface ListItemProps {
  list: SingleList
  columnId: string
}

const ListItem: FC<ListItemProps> = ({list, columnId}) => {
  const {mutate} = api.list.edit.useMutation()
  const {permission} = useBoardContext()
  return (
    <Card id="list-card" className="flex h-fit min-w-[300px] max-w-[300px] flex-col">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-10">
            <EditableTitle
              title={list.title}
              onSave={(title) => mutate({title, listId: list.id})}
            />

            <MoreHorizontal/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardArea cards={list.cards} columnId={columnId}/>
      </CardContent>

      {permission !== "VISITOR" && (
        <CardFooter>
          <CardForm list={list}/>
        </CardFooter>
      )}
    </Card>
  )
}

export default ListItem
