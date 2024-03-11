"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren
} from "react"
import { api } from "@/trpc/react"
import { BoardMembers, type List, type SingleBoard } from "@/trpc/shared"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"

interface BoardContextProps {
  board: SingleBoard
  lists: List
  permission: string
  members: BoardMembers
}

const BoardContext = createContext<BoardContextProps>({} as BoardContextProps)

export function useBoardContext() {
  return useContext(BoardContext)
}

interface BoardContextProviderProps extends PropsWithChildren {
  board: SingleBoard
  lists: List
  permission: string
  members: BoardMembers
}

const BoardContextProvider: FC<BoardContextProviderProps> = ({
  children,
  board,
  lists: initialLists,
  permission,
  members
}) => {
  const { mutate: updateCardPositions } = api.card.updateCardPositions.useMutation()
  const { mutate: updateCard } = api.card.updateCard.useMutation()

  const { data: listData } = api.list.all.useQuery(
    { boardId: board.id },
    {
      initialData: initialLists,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  )

  const [lists, setColumns] = useState(listData)

  useEffect(() => {
    setColumns(listData)
  }, [listData])

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const column = lists[Number(source.droppableId)]
      if (!column) return
      const copiedItems = [...column?.cards]
      const [removed] = copiedItems.splice(source.index, 1)
      if (removed) {
        copiedItems.splice(destination.index, 0, removed)
      }

      if (!removed?.id || !column?.id) return

      setColumns({
        ...lists,
        [source.droppableId]: {
          ...column,
          cards: copiedItems
        }
      })

      copiedItems.forEach((card, idx) => {
        updateCardPositions({
          cardId: card.id,
          position: idx + 1
        })
      })
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = lists[Number(source.droppableId)]
      const destColumn = lists[Number(destination.droppableId)]
      if (!sourceColumn || !destColumn) return

      const sourceItems = [...sourceColumn?.cards]
      const destItems = [...destColumn?.cards]

      const [removed] = sourceItems.splice(source.index, 1)
      if (removed?.id) {
        destItems.splice(destination.index, 0, removed)
      }

      setColumns({
        ...lists,
        [source.droppableId]: {
          ...sourceColumn,
          cards: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          cards: destItems
        }
      })

      if (!removed?.id || !destColumn?.id) return

      destItems.forEach((card, _) => {
        updateCard({
          cardId: card.id,
          card: {
            description: card.description!,
            listId: destColumn.id
          }
        })
      })

      destItems.forEach((card, idx) => {
        updateCardPositions({
          cardId: card.id,
          position: idx + 1
        })
      })
    }
  }

  return (
    <BoardContext.Provider value={{ board, lists, permission, members }}>
      <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
    </BoardContext.Provider>
  )
}

export default BoardContextProvider
