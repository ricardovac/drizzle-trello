"use client"

import * as React from "react"
import { FC, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useRecentContext } from "@/context/recent-boards-context"
import { BackgroundTypeSchema } from "@/server/schema/board.schema"
import { api } from "@/trpc/react"
import { Button } from "components/ui/button"
import { SearchInput } from "components/ui/input"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "components/ui/sheet"
import { cn } from "lib/utils"
import { Search } from "lucide-react"

import { useDebounce } from "@/hooks/useDebounce"

import { BoardImage } from "./board-background"

interface SearchNavProps extends React.HTMLAttributes<HTMLFormElement> {}

const SearchNav: FC<SearchNavProps> = ({ className }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debouncedSearch = useDebounce(query, 300)

  const { recentBoards, noRecentBoards } = useRecentContext()

  const { data: _searchResult } = api.search.dropdown.useQuery(
    {
      query: debouncedSearch,
      limit: 5
    },
    {
      enabled: !!debouncedSearch && open
    }
  )

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

  const filteredBoards = useMemo(() => {
    if (noRecentBoards) return []

    if (query.trim() === "") return recentBoards

    return recentBoards.filter((r) =>
      r.board.title.toLowerCase().includes(query.toLowerCase().trim())
    )
  }, [noRecentBoards, query, recentBoards])

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
            {!noRecentBoards && <span className="text-muted-foreground">Quadros Recentes</span>}
            <ul className="w-full divide-muted">
              {filteredBoards.map((item) => (
                <Link href={`/b/${item.board.id}/${item.board.title}`} key={item.board.id}>
                  <li className="cursor-pointer rounded p-2 hover:bg-muted">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="shrink-0">
                        <BoardImage
                          image={item.board.background as BackgroundTypeSchema}
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.board.title}
                        </p>
                        <p className="truncate text-sm text-gray-400">Área de trabalho de</p>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default SearchNav
