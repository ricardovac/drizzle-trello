"use client"

import { createContext, useContext, type FC, type PropsWithChildren } from "react"
import { RouterOutputs } from "@/trpc/shared"

type RecentBoards = RouterOutputs["recent"]["get"]

interface RecentContextType {
  recentBoards: RecentBoards
}

const RecentContext = createContext<RecentContextType>({} as RecentContextType)

export function useRecentContext() {
  return useContext(RecentContext)
}

interface RecentContextProviderProps extends PropsWithChildren {
  recentBoards: RecentBoards
}

export const RecentContextProvider: FC<RecentContextProviderProps> = ({
  children,
  recentBoards
}) => {
  return <RecentContext.Provider value={{ recentBoards }}>{children}</RecentContext.Provider>
}
