import { FC } from "react"
import { Tag } from "lucide-react"
import LabelPopover from "./popovers/label-popover"

const CardSidebar: FC = () => {
  return (
    <div className="space-y-2 sm:max-w-[170px]">
      <strong className="text-sm">Adicionar ao cartão</strong>
      <LabelPopover>
        <Tag className="mr-2 size-4" /> Etiquetas
      </LabelPopover>
    </div>
  )
}

export default CardSidebar
