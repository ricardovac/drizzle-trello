"use client"

import { createContext, useContext, type FC, type PropsWithChildren } from "react"
import { RouterOutputs } from "@/trpc/shared"

type List = RouterOutputs["card"]["get"]["lists"]
type Card = RouterOutputs["card"]["get"]["cards"]

interface CardContextType {
  list: List
  card: Card
}

const CardContext = createContext<CardContextType>({} as CardContextType)

export function useCardContext() {
  return useContext(CardContext)
}

interface CardContextProviderProps extends PropsWithChildren {
  list: List
  card: Card
}

export const CardContextProvider: FC<CardContextProviderProps> = ({
  children,
  list,
  card
}) => {
  return <CardContext.Provider value={{ list, card }}>{children}</CardContext.Provider>
}
