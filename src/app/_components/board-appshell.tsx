"use client";
import { AppShell, Skeleton } from "@mantine/core";
import { type RouterOutputs } from "~/trpc/shared";

interface BoardAppShellProps {
  board?: RouterOutputs["board"]["get"];
  children: React.ReactNode;
}

export default function BoardAppShell({ children, board }: BoardAppShellProps) {
  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 300, breakpoint: "sm" }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        Área de trabalho de {board?.user.name}
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main bg={board?.background ?? ""} pt={20}>{children}</AppShell.Main>
    </AppShell>
  );
}
