"use client"

import { useMemo, type FC } from "react"
import { api } from "@/trpc/react"

import BoardList from "@/app/_components/board-list"

interface BoardsPageProps {
  params: { userId: string }
}

const LIMIT = 10

const Boards: FC<BoardsPageProps> = ({ params }) => {
  const userId = params.userId

  const { data, isLoading, isFetchingNextPage } = api.board.all.useInfiniteQuery(
    { limit: LIMIT, userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  )
  const dataToShow = useMemo(() => data?.pages.flatMap((page) => page.items), [data])

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-6">
        <strong className="text-md">SUAS ÁREAS DE TRABALHO</strong>

        {!!dataToShow && <BoardList boards={dataToShow} showCreateBoardButton />}
      </div>
    </div>
  )
}

export default Boards
