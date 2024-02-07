import { type FC } from "react"
import { type Cards } from "@/trpc/shared"
import { Droppable } from "@hello-pangea/dnd"
import { cn } from "lib/utils"

import Card from "./card"

interface ListAreaProps {
  cards: Cards
  columnId: string
}

const ListArea: FC<ListAreaProps> = ({ cards, columnId }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={cn("min-h-4 rounded-md", snapshot.isDraggingOver && "bg-primary/[.055]")}
        >
          {cards.map((card, i) => (
            <Card card={card} key={card.id} index={i} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
export default ListArea
