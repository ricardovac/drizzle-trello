"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren
} from "react"
import { labels } from "@/server/db/schema"
import { api } from "@/trpc/react"
import { RouterOutputs } from "@/trpc/shared"
import { InferSelectModel } from "drizzle-orm"

interface CardContextType {
  card: RouterOutputs["card"]["get"]
  board: RouterOutputs["board"]["get"]["board"]
  permission: RouterOutputs["board"]["get"]["role"]
  toggleLabel: (label: InferSelectModel<typeof labels>, remove: boolean) => void
}

const CardContext = createContext<CardContextType>({} as CardContextType)

export function useCardContext() {
  return useContext(CardContext)
}

interface CardContextProviderProps extends PropsWithChildren {
  card: RouterOutputs["card"]["get"]
  board: RouterOutputs["board"]["get"]["board"]
  permission: RouterOutputs["board"]["get"]["role"]
}

type Label = InferSelectModel<typeof labels>

export const CardContextProvider: FC<CardContextProviderProps> = ({
  children,
  card: initialCard,
  board: initialBoard,
  permission
}) => {
  const [board, setBoard] = useState(initialBoard)
  const [card, setCard] = useState(initialCard)

  const { mutate: addlabel } = api.label.add.useMutation()
  const { mutate: removeLabel } = api.label.remove.useMutation()

  const toggleLabel = async (label: Label, remove: boolean) => {
    setCard((prev) => {
      const newCard = structuredClone(prev)

      if (remove) {
        newCard.labels = prev.labels.filter((x) => x.id !== label.id)
        removeLabel({ cardId: newCard.id!, labelId: label.id })
      } else {
        newCard.labels.push(label)
        addlabel({ cardId: newCard.id!, labelId: label.id })
      }

      newCard.labels?.sort((a, z) => (a.color > z.color ? 1 : z.color > a.color ? -1 : 0))
      return newCard
    })
  }

  return (
    <CardContext.Provider value={{ card, board, permission, toggleLabel }}>
      {children}
    </CardContext.Provider>
  )
}
