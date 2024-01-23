'use client';
import {useBoardContext} from '../context/board-context';
import ListItem from "@/components/list-item";

export default function List() {
  const {lists} = useBoardContext();

  return lists.map((list) => <ListItem list={list} key={list.id}/>);
}


