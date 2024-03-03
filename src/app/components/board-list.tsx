import { FC } from "react"
import { type RecentBoards, type InfiniteBoard } from "@/trpc/shared"
import { loadingArray } from "@/utils/loadingArray"
import { Skeleton } from "components/ui/skeleton"

import BoardCard from "./board-card"
import CreateBoardPopover from "./create-board-popover"

interface BoardListProps {
  userBoards?: InfiniteBoard[]
  recentBoards?: RecentBoards
  showButton?: boolean
  loading?: boolean
}

const BoardList: FC<BoardListProps> = ({ userBoards, recentBoards, showButton = false, loading }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {recentBoards?.map((item) => (
        <BoardCard key={item.id} board={item} />
      ))}

      {userBoards?.map((item) => (
        <BoardCard key={item.board.id} board={item.board} />
      ))}

      {loading && loadingArray(3).map((_, i) => <Skeleton className="h-24" key={i} />)}

      {showButton && (
        <CreateBoardPopover className="relative h-full min-h-24" variant="secondary">
          Criar novo quadro
        </CreateBoardPopover>
      )}
    </div>
  )
}

export default BoardList
