"use client"

import * as React from "react"
import {useState} from "react"
import Link from "next/link"
import {useRecentContext} from "@/context/recent-boards-context"
import {BackgroundTypeSchema} from "@/server/schema/board.schema"
import {api} from "@/trpc/react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "components/ui/navigation-menu"
import {cn} from "lib/utils"

import {BoardBackground} from "./board-background"

export function MainNavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {recentBoards} = useRecentContext()
  const {data: starredBoards} = api.board.starredBoards.useQuery(undefined, {
    enabled: isMenuOpen
  })

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Recente
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {!recentBoards?.length && (
              <div className="p-4 text-center text-muted-foreground md:w-[300px] lg:w-[400px]">
                Você não tem nenhum quadro recente.
              </div>
            )}

            {!!recentBoards?.length && (
              <ul className="grid gap-3 p-2 md:w-[300px] lg:w-[400px] lg:grid-rows-[.75fr_1fr]">
                {recentBoards.map((board) => (
                  <li className="row-span-5" key={board.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex size-full select-none items-center gap-4 rounded-md p-2 no-underline outline-none hover:bg-muted focus:shadow-md"
                        href={`/b/${board.id}/${encodeURIComponent(board.title)}`}
                      >
                        <BoardBackground
                          image={board.background as BackgroundTypeSchema}
                          width={50}
                          height={50}
                        />
                        <div className="text-md flex w-full flex-col font-medium">
                          {board.title}
                          <p className="text-xs leading-tight text-muted-foreground">
                            Quadro de {board.owner?.name}
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
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseOut={() => setIsMenuOpen(false)}
          >
            Marcado com estrela
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {!starredBoards?.length && (
              <div className="p-4 text-center text-muted-foreground md:w-[300px] lg:w-[400px]">
                Você não tem nenhum quadro marcado com estrela.
              </div>
            )}

            {!!starredBoards?.length && (
              <ul className="grid gap-3 p-2 md:w-[300px] lg:w-[400px] lg:grid-rows-[.75fr_1fr]">
                {starredBoards.map((board) => (
                  <li className="row-span-5" key={board.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex size-full select-none items-center gap-4 rounded-md p-2 no-underline outline-none hover:bg-muted focus:shadow-md"
                        href={`/b/${board.id}/${encodeURIComponent(board.title)}`}
                      >
                        <BoardBackground
                          image={board.background as BackgroundTypeSchema}
                          width={50}
                          height={50}
                        />
                        <div className="text-md flex w-full flex-col font-medium">
                          {board.title}
                          <p className="text-xs leading-tight text-muted-foreground">
                            Quadro de {board.owner?.name}
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
  ({className, title, children, ...props}, ref) => {
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
