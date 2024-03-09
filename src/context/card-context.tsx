"use client"

import { createContext, useContext, useState, type FC, type PropsWithChildren } from "react"
import { RouterOutputs } from "@/trpc/shared"
import { InferSelectModel } from "drizzle-orm"
import { labels } from "@/server/db/schema"

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
  permission,
}) => {
  const [card, setCard] = useState(initialCard)
  const [board, setBoard] = useState(initialBoard)

  const toggleLabel = (label: Label, remove: boolean) => {
    setCard((prev) => {
      const newCard = { ...prev }

      if (remove) {
        newCard.labels = prev?.labels.filter((l) => l.labelId !== label.id);
      } else {
        newCard.labels = prev?.labels.push(label);
      }

      return newCard;
    })
  }

  return <CardContext.Provider value={{ card, board, permission, toggleLabel }}>{children}</CardContext.Provider>
}
