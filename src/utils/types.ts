import { type RouterOutputs } from "~/trpc/shared";

export type List = RouterOutputs['list']['all']
export type SingleList = RouterOutputs['list']['all'][number]
export type SingleBoard = RouterOutputs['board']['get']
export type InfiniteBoard = RouterOutputs['board']['all']['items'][number]