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

  const { data, isLoading } = api.board.all.useInfiniteQuery(
    { limit: LIMIT, userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false
    }
  )
  const dataToShow = useMemo(() => data?.pages.flatMap((page) => page.items), [data])

  return (
    <main className="relative py-6 lg:gap-10 lg:py-10">
      <div className="flex flex-col gap-6">
        <strong className="text-md uppercase">Suas áreas de trabalho</strong>

        {!!dataToShow && <BoardList boards={dataToShow} showCreateBoardButton />}

        {isLoading && <BoardList loading={isLoading} showCreateBoardButton />}
      </div>
    </main>
  )
}

export default Boards
