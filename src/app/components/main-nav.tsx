"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MainNavItem } from "@/utils/types"
import { Button } from "components/ui/button"
import { Icons } from "components/ui/icons"
import { siteConfig } from "config/site"

import AccountMenu from "./account-menu"
import CreateBoardPopover from "./create-board-popover"
import { MobileNav } from "./mobile-nav"
import { MainNavigationMenu } from "./navigation-menu"
import SearchNav from "./search-nav"
import { Plus } from "lucide-react"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const { back } = useRouter()

  return (
    <div className="flex gap-6 border-b p-2 md:gap-10">
      <Button
        onClick={() => back()}
        className="hidden items-center space-x-2 px-2 md:flex"
        variant="ghost"
      >
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Button>
      <div className="relative flex w-full items-center justify-between">
        <nav className="hidden gap-6 md:flex">
          <MainNavigationMenu />
          <CreateBoardPopover>
            <span className="hidden xl:block">Criar</span>
            <Plus className="block xl:hidden"/>
          </CreateBoardPopover>
        </nav>
        <nav className="relative gap-6 md:flex">
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
  )
}