import { type FC } from "react"
import { type Cards } from "@/trpc/shared"
import { Droppable } from "@hello-pangea/dnd"

import Card from "./card"

interface ListAreaProps {
  cards: Cards
  columnId: string
}

const ListArea: FC<ListAreaProps> = ({ cards, columnId }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, _) => (
        <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: "10px" }}>
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
