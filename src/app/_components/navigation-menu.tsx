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
import { Loader2 } from "lucide-react"

import { useAuthContext } from "../context/auth-context"
import { BoardImage } from "./board-background"

export function MainNavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
  const { user } = useAuthContext()

  const { data: recent, isLoading, isFetching } = api.board.getRecent.useQuery(
    {
      userId: user.id
    },
    {
      enabled: !!user && isMenuOpen,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 10
    }
  )

  const noRecentBoards = !recent?.length && !isLoading && !isFetching

  const isLoadingOrFetching = isLoading || isFetching

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setIsMenuOpen((o) => !o)}>
            Recentes
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {isLoadingOrFetching && (
              <div className="flex items-center justify-center py-10 md:w-[300px] lg:w-[400px]">
                <Loader2 className="size-5 animate-spin" />
              </div>
            )}

            {noRecentBoards && (
              <div className="p-4 text-center text-muted-foreground md:w-[300px] lg:w-[400px]">
                Você não tem nenhum quadro recente.
              </div>
            )}

            {!!recent?.length && (
              <ul className="grid gap-3 p-2 md:w-[300px] lg:w-[400px] lg:grid-rows-[.75fr_1fr]">
                {recent?.map((item) => (
                  <li className="row-span-5" key={item.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex size-full select-none items-center gap-4 rounded-md p-2 no-underline outline-none hover:bg-muted focus:shadow-md"
                        href={`/b/${item.board.id}/${encodeURIComponent(item.board.title)}`}
                      >
                        <BoardImage
                          image={item.board.background as BackgroundTypeSchema}
                          width={50}
                          height={50}
                        />
                        <div className="text-md flex w-full flex-col font-medium">
                          {item.board.title}
                          <p className="text-xs leading-tight text-muted-foreground">
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
