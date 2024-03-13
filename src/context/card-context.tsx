"use client"

import {
  createContext,
  useContext,
  type FC,

  type PropsWithChildren
} from "react"
import { RouterOutputs } from "@/trpc/shared"

interface CardContextType {
  card: RouterOutputs["card"]["get"]
  board: RouterOutputs["board"]["get"]["board"]
  permission: RouterOutputs["board"]["get"]["role"]
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


export const CardContextProvider: FC<CardContextProviderProps> = ({
  children,
  card,
  board,
  permission
}) => {
  return (
    <CardContext.Provider value={{ card, board, permission }}>
      {children}
    </CardContext.Provider>
  )
}
