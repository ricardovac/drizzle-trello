"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/auth-context"
import { RecentContextProvider } from "@/context/recent-boards-context"
import { api } from "@/trpc/react"
import { MainNavItem } from "@/utils/types"
import { Button } from "components/ui/button"
import { Icons } from "components/ui/icons"
import { siteConfig } from "config/site"

import AccountMenu from "./account-menu"
import CreateBoardPopover from "./create-board-popover"
import { MobileNav } from "./mobile-nav"
import { MainNavigationMenu } from "./navigation-menu"
import SearchNav from "./search-nav"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const router = useRouter()
  const { user } = useAuthContext()

  const {
    data: recent,
    isLoading,
    isFetching
  } = api.board.getRecent.useQuery(
    {
      userId: user.id
    },
    {
      enabled: !!user,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 10
    }
  )

  const noRecentBoards = !recent?.length && !isLoading && !isFetching

  const loading = isLoading || isFetching

  return (
    <RecentContextProvider
      recentBoards={recent ?? []}
      isLoading={loading}
      noRecentBoards={noRecentBoards}
    >
      <div className="flex gap-6 border-b p-2 md:gap-10">
        <Button
          onClick={() => router.back()}
          className="hidden items-center space-x-2 px-2 md:flex"
          variant="ghost"
        >
          <Icons.logo />
          <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        </Button>
        <div className="relative flex w-full items-center justify-between">
          <nav className="hidden gap-6 md:flex">
            <MainNavigationMenu />
            <CreateBoardPopover>Criar</CreateBoardPopover>
          </nav>
          <nav className="gap-6 md:flex">
            <SearchNav />
            <AccountMenu />
          </nav>
        </div>
        <button
          className="flex items-center space-x-2 md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.logo />}
          <span className="font-bold">Menu</span>
        </button>
        {showMobileMenu && items && <MobileNav items={items}>{children}</MobileNav>}
      </div>
    </RecentContextProvider>
  )
}
