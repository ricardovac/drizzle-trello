"use client"

import * as React from "react"
import Link from "next/link"
import { BackgroundTypeSchema } from "@/server/schema/board.shema"
import { api } from "@/trpc/react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "components/ui/navigation-menu"
import { cn } from "lib/utils"

import { useAuthContext } from "../context/auth-context"
import { BoardImage } from "./board-background"

export function MainNavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
  const { user } = useAuthContext()

  const { data: recentBoards } = api.board.getRecent.useQuery(
    {
      userId: user.id
    },
    {
      enabled: !!user && isMenuOpen,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 10
    }
  )

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setIsMenuOpen((o) => !o)}>
            Recentes
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {!recentBoards?.length && (
              <div className="p-4 text-center text-muted-foreground md:w-[300px] lg:w-[400px]">
                Você não tem nenhum quadro recente.
              </div>
            )}

            {!!recentBoards?.length && (
              <ul className="grid gap-3 p-4 md:w-[300px] lg:w-[400px] lg:grid-rows-[.75fr_1fr]">
                {recentBoards?.map((board) => (
                  <li className="row-span-5" key={board.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex size-full select-none items-center gap-4 rounded-md px-4 no-underline outline-none hover:bg-muted focus:shadow-md"
                        href={`/b/${board.board.id}/${encodeURIComponent(board.board.title)}`}
                      >
                        <BoardImage
                          image={board.board.background as BackgroundTypeSchema}
                          width={55}
                          height={44}
                        />
                        <div className="mb-2 mt-4 flex w-full flex-col text-lg font-medium">
                          {board.board.title}
                          <p className="text-sm leading-tight text-muted-foreground">
                            Área de trabalho de
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"
