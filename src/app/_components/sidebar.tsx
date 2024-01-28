"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { Separator } from "components/ui/separator"
import { cn } from "lib/utils"
import { Calendar, ChevronRight, CircuitBoard, Home } from "lucide-react"
import { Session } from "next-auth"

import { useAuthContext } from "../context/auth-context"

interface LinksGroupProps {
  label: string
  initiallyOpened?: boolean
  links?: { label: string; link: string }[]
}

export function LinksGroup({ label, initiallyOpened, links }: LinksGroupProps) {
  const { user } = useAuthContext()
  const [opened, setOpened] = useState(initiallyOpened ?? false)
  const hasLinks = Array.isArray(links)
  const items = (hasLinks ? links : []).map((link) => (
    <Link href={link.link} key={link.label} scroll={false}>
      {link.label}
    </Link>
  ))

  return (
    <div>
      <Links />
      <Separator className="my-4" />
      <h1>Áreas de trabalho</h1>
      <Collapsible onOpenChange={() => setOpened((o) => !o)} open={opened}>
        <CollapsibleTrigger className="text-start">
          <div className="flex justify-between">
            <div className="mr-6 flex items-center">
              <Image
                src={user.image!}
                width={38}
                height={38}
                className="rounded-full"
                alt="Sidebar User Image"
              />
              <div className="ml-4">{label}</div>
            </div>
            {hasLinks && <ChevronRight className={cn("size-8", opened && "rotate-90")} />}
          </div>
        </CollapsibleTrigger>
        {hasLinks ? <CollapsibleContent>{items}</CollapsibleContent> : null}
      </Collapsible>
    </div>
  )
}

export function WorkspaceLinksGroup({ session }: { session: Session }) {
  const mockdata = {
    session: session,
    label: `Área de trabalho de ${session?.user.name}`,
    icon: Calendar,
    links: [
      { label: "Quadros", link: `/u/${session?.user.id}/boards` },
      { label: "Destaques", link: "/w/areadetrabalho/highlights" },
      { label: "Membros", link: "/w/areadetrabalho/views/table" },
    ],
  }

  return <LinksGroup {...mockdata} initiallyOpened />
}

export function Links() {
  const { user } = useAuthContext()
  const userId = user.id
  const pathname = usePathname()

  const topLinks = [
    {
      icon: <CircuitBoard />,
      label: "Quadros",
      href: `/u/${userId}/boards`,
    },
    {
      icon: <Home />,
      label: "Início",
      href: "/",
    },
  ]

  const items = topLinks.map((item, idx) => (
    <Link
      key={idx}
      href={{ pathname: item.href }}
      className={cn(
        "rounded-md",
        pathname.trim() !== item.href.trim() && "hover:bg-muted",
        pathname.trim() === item.href.trim() && "bg-muted-foreground"
      )}
    >
      <div className="flex items-center gap-4 p-2">
        {item.icon}
        <span className="text-lg">{item.label}</span>
      </div>
    </Link>
  ))

  return <div className="flex flex-col gap-4">{items}</div>
}
