'use client';
import { AppShell, AppShellMain, AppShellNavbar, Flex } from '@mantine/core';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useBoardContext } from '../context/board-context';

interface BoardAppShellProps {
  children: React.ReactNode;
}

export default function BoardAppShell({ children }: BoardAppShellProps) {
  const { board } = useBoardContext();
  return (
    <AppShell header={{ height: 50 }} navbar={{ width: 300, breakpoint: 'sm' }} padding="md">
      <AppShellNavbar opacity={0.9} p="md">
        Área de trabalho de {board?.user?.name}
      </AppShellNavbar>
      <ScrollContainer
        className="scroll-container"
        hideScrollbars={false}
        horizontal
        ignoreElements="#listCard"
        style={{
          backgroundColor: board?.background,
          backgroundImage: board?.background.startsWith('https://images.unsplash.com')
            ? `url(${board?.background})`
            : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <AppShellMain pt={20}>
          <Flex gap={8}>{children}</Flex>
        </AppShellMain>
      </ScrollContainer>
    </AppShell>
  );
}
