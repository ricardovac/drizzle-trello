import { type AppRouter } from "@/server/api/root"
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import superjson from "superjson"

export const transformer = superjson

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc"
}

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>

export type List = RouterOutputs["list"]["all"]
export type SingleList = RouterOutputs["list"]["all"][number]
export type SingleBoard = RouterOutputs["board"]["get"]["board"]
export type InfiniteBoard = RouterOutputs["board"]["all"]["items"][number]
export type Cards = Pick<SingleList, "cards">["cards"]
export type SingleCard = Pick<SingleList, "cards">["cards"][0]
export type RecentBoards = RouterOutputs["recent"]["get"]
export type BoardMembers = RouterOutputs["member"]["get"]

export type FieldType = ControllerRenderProps<FieldValues, string>;
