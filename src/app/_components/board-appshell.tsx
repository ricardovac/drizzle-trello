import { AppShell, AppShellMain, AppShellNavbar, Flex } from '@mantine/core';
import { type SingleBoard } from '~/utils/types';

interface BoardAppShellProps {
  board?: SingleBoard;
  children: React.ReactNode;
}

export default function BoardAppShell({ children, board }: BoardAppShellProps) {
  return (
    <AppShell header={{ height: 50 }} navbar={{ width: 300, breakpoint: 'sm' }} padding="md">
      <AppShellNavbar p="md">Área de trabalho de {board?.user.name}</AppShellNavbar>
      <AppShellMain bg={board?.background ?? ''} pt={20}>
        <Flex gap={8}>{children}</Flex>
      </AppShellMain>
    </AppShell>
  );
}
