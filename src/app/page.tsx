'use client';
import { Container, Flex, Paper, Text } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { api } from '~/trpc/react';
import BoardCard from './_components/board-card';
import { NavbarLinksGroup } from './_components/navbar';

const CreateBoardPopover = dynamic(() => import('./_components/create-board-popover'), {
  ssr: false,
});

export default function Home() {
  const { data, isLoading, isFetchingNextPage } = api.board.all.useInfiniteQuery(
    { limit: 10 },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const dataToShow = useMemo(() => data?.pages.flatMap((page) => page.items), [data]);

  const loadingArray = Array.from<undefined>({ length: 4 });

  return (
    <Container size="lg" mt={20}>
      <Flex gap="md">
        <NavbarLinksGroup />
        <Flex direction="column" gap={4}>
          <Text>SUAS ÁREAS DE TRABALHO</Text>
          <Flex maw={900} wrap="wrap">
            <CreateBoardPopover>
              <Paper p="xl" bg="gray" style={{ cursor: 'pointer' }}>
                <Text>Criar novo quadro</Text>
              </Paper>
            </CreateBoardPopover>
            {(isLoading ? loadingArray : dataToShow)?.map((board, idx) => (
              <BoardCard key={isLoading ? idx : board?.id} board={board} loading={isLoading} />
            ))}
          </Flex>
          {isFetchingNextPage && <BoardCard loading />}
        </Flex>
      </Flex>
    </Container>
  );
}
