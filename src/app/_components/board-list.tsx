import { FC } from "react"
import { type InfiniteBoard } from "@/trpc/shared"

import BoardCard from "./board-card"
import CreateBoardPopover from "./create-board-popover"

interface BoardListProps {
  boards: InfiniteBoard[]
  showCreateBoardButton?: boolean
}

const BoardList: FC<BoardListProps> = ({ boards = [], showCreateBoardButton = false }) => {
  console.log(boards)
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}

      {showCreateBoardButton && (
        <CreateBoardPopover>
          <div className="min-h-[100px] min-w-[200px] bg-muted">Criar novo quadro</div>
        </CreateBoardPopover>
      )}
    </div>
  )
}

export default BoardList
