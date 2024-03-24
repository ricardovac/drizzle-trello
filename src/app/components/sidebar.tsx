"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthContext } from "@/context/auth-context"
import { SidebarNavItem } from "@/utils/types"
import { cn } from "lib/utils"

export function SidebarNav() {
  const pathname = usePathname()
  const { user } = useAuthContext()

  const items = [
    {
      title: "Quadros",
      href: `/u/${user.id}/boards`
    },
    {
      title: "Início",
      href: "/"
    }
  ]

  return items.length ? (
    <div className="w-full">
      <div className={cn("pb-8")}>
        {items ? <SidebarNavItems items={items} pathname={pathname} /> : null}
      </div>
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function SidebarNavItems({ items, pathname }: DocsSidebarNavItemsProps) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        !item.disabled && item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn("flex w-full items-center rounded-md p-2 hover:bg-muted", {
              "bg-muted/80": pathname === item.href
            })}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
          </Link>
        ) : (
          <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
            {item.title}
          </span>
        )
      )}
    </div>
  )
}
