import { type FC } from "react"
import Link from "next/link"
import { type SingleCard } from "@/trpc/shared"
import { Draggable } from "@hello-pangea/dnd"
import { Button } from "components/ui/button"
import { cn } from "lib/utils"
import { AlignLeft } from "lucide-react"

interface CardProps {
  card: SingleCard
  index: number
}

const Card: FC<CardProps> = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id ?? ""} index={index}>
      {(provided) => (
        <Button
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            "mb-2 flex h-fit w-full cursor-pointer select-none flex-col items-start gap-2 py-3"
          )}
          variant="secondary"
          asChild
        >
          <Link href={`#`}>
            <span>{card.title}</span>

            {card.description && (
              <div className="flex items-center gap-2 text-muted-foreground [&>*:is(svg)]:w-4">
                {card.description && <AlignLeft />}
              </div>
            )}
          </Link>
        </Button>
      )}
    </Draggable>
  )
}

export default Card
