"use client"

import { createContext, useContext, type FC, type PropsWithChildren } from "react"
import { RouterOutputs } from "@/trpc/shared"

type RecentBoards = RouterOutputs["board"]["getRecent"]

interface RecentContextType {
  recentBoards: RecentBoards
  isLoading: boolean
  noRecentBoards?: boolean
}

const RecentContext = createContext<RecentContextType>({} as RecentContextType)

export function useRecentContext() {
  return useContext(RecentContext)
}

interface RecentContextProviderProps extends PropsWithChildren {
  recentBoards: RecentBoards
  isLoading: boolean
  noRecentBoards?: boolean
}

export const RecentContextProvider: FC<RecentContextProviderProps> = ({
  children,
  recentBoards,
  isLoading,
  noRecentBoards
}) => {
  return (
    <RecentContext.Provider value={{ recentBoards, isLoading, noRecentBoards }}>
      {children}
    </RecentContext.Provider>
  )
}
