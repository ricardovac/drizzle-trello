"use client"

import * as React from "react"
import { FC, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useRecentContext } from "@/context/recent-boards-context"
import { BackgroundTypeSchema } from "@/server/schema/board.schema"
import { SearchFilterTypes } from "@/server/schema/search.schema"
import { api } from "@/trpc/react"
import { SingleBoard } from "@/trpc/shared"
import { Button } from "components/ui/button"
import { SearchInput } from "components/ui/input"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "components/ui/sheet"
import { cn } from "lib/utils"
import { Loader2, Search } from "lucide-react"
import { Session } from "next-auth"

import { useDebounce } from "@/hooks/useDebounce"

import { BoardImage } from "./board-background"

interface SearchNavProps extends React.HTMLAttributes<HTMLFormElement> {}

const SearchNav: FC<SearchNavProps> = ({ className }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 200)

  const { recentBoards } = useRecentContext()

  const { data, isLoading, isFetching } = api.search.byType.useQuery(
    {
      query: debouncedQuery,
      limit: 4
    },
    {
      enabled: !!debouncedQuery && open,
      placeholderData: { boards: recentBoards, type: "boards" }
    }
  )

  const boardType = data?.type as SearchFilterTypes

  const noDataToShow = !isLoading && !data?.boards?.length && !data?.users?.length
  const hasDataToShow = !isLoading && (data?.boards?.length || data?.users?.length)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "relative h-8 justify-start space-x-2 text-muted-foreground lg:w-64 lg:pr-12",
            className
          )}
        >
          <Search className="size-4" />
          <span className="hidden lg:block">Pesquisar</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 lg:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        animation={false}
        className="flex w-[70vw] flex-col gap-6 rounded-lg"
      >
        <SheetHeader>
          <SearchInput onChange={(e) => setQuery(e.target.value)} value={query} />
        </SheetHeader>
        <SheetFooter>
          <div className="grid w-full gap-2">
            {noDataToShow && (
              <div className="text-center text-muted-foreground">
                <p>Nenhum resultado encontrado</p>
              </div>
            )}

            {hasDataToShow && (
              <div className="grid gap-4">
                {boardType === "boards" && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Quadros</h3>
                    <DropdownItem board={data?.boards} type="boards" />
                  </div>
                )}
                {boardType === "users" && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Pessoas</h3>
                    <DropdownItem users={data?.users} type="users" />
                  </div>
                )}
              </div>
            )}

            {(isFetching || isLoading) && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-5 animate-spin" />
              </div>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

interface SearchNavItemProps {
  board?: Pick<SingleBoard, "title" | "background" | "id">[]
  users?: Session["user"][]
  type: SearchFilterTypes
}

export const DropdownItem: FC<SearchNavItemProps> = ({ board, users }) => {
  return (
    <ul className="w-full divide-muted">
      {board?.map((item) => (
        <Link href={`/b/${item.id}/${item.title}`} key={item.id}>
          <li className="cursor-pointer rounded p-2 hover:bg-muted">
            <div className="flex items-center space-x-4">
              <BoardImage image={item.background as BackgroundTypeSchema} width={32} height={32} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">Área de trabalho de</p>
              </div>
            </div>
          </li>
        </Link>
      ))}

      {users?.map((user) => (
        <Link href={`/u/${user.name}`} key={user.id}>
          <li className="cursor-pointer rounded p-2 hover:bg-muted">
            <div className="flex items-center space-x-4">
              <Image
                src={user.image ?? ""}
                width={32}
                height={32}
                alt="User Dropdown Image"
                className="size-8 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{user.name}</p>
              </div>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default SearchNav
