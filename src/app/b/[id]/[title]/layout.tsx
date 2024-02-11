import { MainNav } from "@/app/_components/main-nav"

export default async function BoardIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav />
      {children}
    </>
  )
}
