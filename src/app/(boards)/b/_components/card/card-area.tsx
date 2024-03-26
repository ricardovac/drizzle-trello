import {type FC} from "react"
import {type Cards} from "@/trpc/shared"
import {Droppable} from "@hello-pangea/dnd"
import {ScrollArea} from "../../../../../../components/ui/scroll-area"
import {cn} from "../../../../../../lib/utils"

import CardItem from "./card-item"

interface CardAreaProps {
  cards: Cards
  columnId: string
}

const CardArea: FC<CardAreaProps> = ({cards, columnId}) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <ScrollArea
          {...provided.droppableProps}
          ref={provided.innerRef}
          scrollHideDelay={0}
          className={cn("min-h-4 rounded-md", snapshot.isDraggingOver && "bg-primary/[.055]")}
        >
          {cards.map((card, i) => (
            <CardItem card={card} index={i} key={card.id}/>
          ))}
          {provided.placeholder}
        </ScrollArea>
      )}
    </Droppable>
  )
}
export default CardArea
