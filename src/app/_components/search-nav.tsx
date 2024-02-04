"use client"

import * as React from "react"
import { useRecentContext } from "@/context/recent-boards-context"
import { api } from "@/trpc/react"
import { Button } from "components/ui/button"
import { SearchInput } from "components/ui/input"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "components/ui/sheet"
import { cn } from "lib/utils"
import { Search } from "lucide-react"

import { useDebounce } from "@/hooks/useDebounce"
import { BackgroundTypeSchema } from "@/server/schema/board.schema"
import { BoardImage } from "./board-background"

interface SearchNavProps extends React.HTMLAttributes<HTMLFormElement> {}

const SearchNav: React.FC<SearchNavProps> = ({ className }) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { recentBoards } = useRecentContext()

  const { data: _searchResult } = api.search.searchBoard.useInfiniteQuery(
    {
      query: debouncedSearch,
      limit: 5
    },
    {
      enabled: !!debouncedSearch && open,
      refetchOnWindowFocus: false,
      initialData: undefined
    }
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

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
        className="grid w-[70vw] grid-rows-2 gap-0 rounded-lg"
      >
        <SheetHeader>
          <SearchInput onChange={(e) => setSearch(e.target.value)} />
        </SheetHeader>
        <SheetFooter>
          <div className="grid w-full gap-2">
            <span className="text-muted-foreground">Quadros Recentes</span>
            <ul className="w-full divide-muted">
              {recentBoards.map((item) => (
                <li className="p-2 hover:bg-muted rounded cursor-pointer" key={item.board.id}>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="shrink-0">
                      <BoardImage
                        image={item.board.background as BackgroundTypeSchema}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.board.title}</p>
                      <p className="truncate text-sm text-gray-400">Área de trabalho de</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default SearchNav
