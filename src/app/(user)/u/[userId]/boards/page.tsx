"use client"

import { useMemo, type FC } from "react"
import { useRecentContext } from "@/context/recent-boards-context"
import { api } from "@/trpc/react"

import BoardList from "@/app/components/board-list"

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

  console.log(data)

  const userBoards = useMemo(() => data?.pages.flatMap((page) => page.usersQuery), [data])
  const memberBoards = useMemo(() => data?.pages.flatMap((page) => page.membersQuery), [data])

  const showMemberBoards = memberBoards?.length !== 0 && !isLoading
  const showRecentBoards = recentBoards.length !== 0

  return (
    <>
      {showRecentBoards && (
        <div className="w-full">
          <h2 className="mb-6 text-xl font-bold">Vizualizados recentemente</h2>
          <BoardList recentBoards={recentBoards} />
        </div>
      )}

      <div className="w-full">
        <h2 className="mb-6 text-xl font-bold">Seus quadros</h2>
        <BoardList userBoards={userBoards} showButton loading={isLoading} />
      </div>

      {showMemberBoards && (
        <div className="w-full">
          <h2 className="mb-6 text-xl font-bold">Compartilhados com você</h2>
          <BoardList userBoards={memberBoards} loading={isLoading} />
        </div>
      )}
    </>
  )
}

export default Boards
