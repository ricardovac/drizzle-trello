import { type FC } from "react"
import { type Cards } from "@/trpc/shared"
import { Droppable } from "@hello-pangea/dnd"
import { ScrollArea } from "components/ui/scroll-area"
import { cn } from "lib/utils"

import CardItem from "./card-item"

interface CardAreaProps {
  cards: Cards
  columnId: string
}

const CardArea: FC<CardAreaProps> = ({ cards, columnId }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <ScrollArea
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={cn("max-h-[70vh] rounded-md")}
          scrollHideDelay={0}
        >
          {cards.map((card, i) => (
            <CardItem card={card} key={card.id} index={i} />
          ))}
          {provided.placeholder}
        </ScrollArea>
      )}
    </Droppable>
  )
}
export default CardArea
