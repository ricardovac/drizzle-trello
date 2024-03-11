import { FC, useMemo } from "react"
import { useCardContext } from "@/context/card-context"
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
          <div
            style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
            className="h-8 rounded px-2.5"
            key={label.id}
          >
            {label.title}
          </div>
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
