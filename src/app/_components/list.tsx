"use client"

import { useBoardContext } from "../context/board-context"
import ListItem from "./list-item"

export default function List() {
  const { lists } = useBoardContext()

  return Object.entries(lists).map(([columnId, list]) => (
    <ListItem list={list} columnId={columnId} key={list.id} />
  ))
}
