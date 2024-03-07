import { FC } from "react"
import { Button } from "components/ui/button"
import { Tag } from "lucide-react"

const CardSidebar: FC = () => {
  return (
    <div className="space-y-2 sm:max-w-[170px]">
      <strong className="text-sm">Adicionar ao cartão</strong>
      <Button className="w-full">
        <Tag className="mr-2 size-4" /> Etiquetas
      </Button>
    </div>
  )
}

export default CardSidebar
