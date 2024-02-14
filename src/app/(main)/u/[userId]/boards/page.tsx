"use client"

import { useMemo, type FC } from "react"
import { useRecentContext } from "@/context/recent-boards-context"
import { api } from "@/trpc/react"
import { Clock } from "lucide-react"

import BoardList from "@/app/_components/board-list"

interface BoardsPageProps {
  params: { userId: string }
}

const Boards: FC<BoardsPageProps> = ({ params }) => {
  const userId = params.userId
  const { recentBoards } = useRecentContext()

  const { data, isLoading } = api.board.all.useInfiniteQuery(
    { limit: 10, userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10
    }
  )
  const dataToShow = useMemo(() => data?.pages.flatMap((page) => page.items), [data])
  console.log(dataToShow)

  return (
    <>
      {!!recentBoards.length && (
        <div className="w-full">
          <div className="flex items-center space-x-2 p-2">
            <Clock />
            <h2 className="text-xl font-bold">Vizualizados recentemente</h2>
          </div>

          <BoardList boards={recentBoards} />
        </div>
      )}

      <div className="w-full">
        <h2 className="mb-6 text-xl font-bold">Seus quadros</h2>

        <BoardList boards={dataToShow} showButton loading={isLoading} />
      </div>
    </>
  )
}

export default Boards
