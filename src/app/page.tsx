import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function IndexPage() {
  const session = await getServerAuthSession()

  if (!session?.user) return redirect(`/home`)

  return redirect(`/u/${session.user.id}/boards`)
}
