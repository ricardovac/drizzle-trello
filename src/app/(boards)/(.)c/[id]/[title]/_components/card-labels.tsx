import { FC } from "react"
import { useCardContext } from "@/context/card-context"
import { Badge } from "components/ui/badge"
import { Button } from "components/ui/button"
import { getTextColor } from "lib/utils"
import { Plus } from "lucide-react"

import LabelPopover from "./popovers/label-popover"

const CardLabels: FC = () => {
  const { card } = useCardContext()

  return (
    <div>
      <span className="text-xs">Etiquetas</span>
      <div className="flex gap-2">
        {card.labels.map((label) => (
          <Badge
            style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
            className="rounded text-sm"
            key={label.id}
          >
            {label.title}
          </Badge>
        ))}
        <LabelPopover>
          <Button size="icon" className="h-8" variant="secondary">
            <Plus />
          </Button>
        </LabelPopover>
      </div>
    </div>
  )
}

export default CardLabels
