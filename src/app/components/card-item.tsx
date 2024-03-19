import { useMemo, type FC } from "react"
import Link from "next/link"
import { useBoardContext } from "@/context/board-context"
import { type SingleCard } from "@/trpc/shared"
import { Draggable, DraggableStateSnapshot, DraggableStyle } from "@hello-pangea/dnd"
import { Badge } from "components/ui/badge"
import { Button } from "components/ui/button"
import { cn, getTextColor } from "lib/utils"
import { AlignLeft } from "lucide-react"

interface CardProps {
  card: SingleCard
  index: number
}

function getStyle(style: DraggableStyle | undefined, snapshot: DraggableStateSnapshot) {
  if (!snapshot.isDropAnimating) {
    return style
  }
  return {
    ...style,
    transitionDuration: `0.001s`
  }
}

const Card: FC<CardProps> = ({ card, index }) => {
  const { permission } = useBoardContext()

  const labels =
    useMemo(() => card.cardsToLabels?.flatMap((cardToLabel) => cardToLabel.label), [card]) ?? []

  return (
    <Draggable draggableId={card.id ?? ""} index={index} isDragDisabled={permission === "VISITOR"}>
      {(provided, snapshot) => (
        <Button
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="mb-2 flex h-fit w-full cursor-pointer select-none flex-col items-start gap-2 py-3"
          variant="secondary"
          style={getStyle(provided.draggableProps.style, snapshot)}
          asChild
        >
          <Link
            href={`/c/${card.id}/${card.title}`}
            scroll={false}
            prefetch={false}
            shallow
            className={cn(permission === "VISITOR" && "pointer-events-none")}
          >
            {labels.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {labels.map((label) => (
                  <Badge
                    key={label.id}
                    className="rounded"
                    style={{
                      backgroundColor: label.color,
                      color: getTextColor(label.color)
                    }}
                  >
                    {label.title}
                  </Badge>
                ))}
              </div>
            )}

            <span>{card.title}</span>

            {card.description && (
              <div className="flex w-4 items-center gap-2 text-muted-foreground">
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
