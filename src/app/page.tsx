'use client';
import { Button, Container, Flex, Text } from '@mantine/core';
import { useMemo } from 'react';
import { api } from '~/trpc/react';
import BoardCard from './_components/board-card';
import CreateBoardPopover from './_components/create-board-popover';
import { NavbarLinksGroup } from './_components/navbar';

export default function Home() {
  const { data, isLoading, isFetchingNextPage } = api.board.all.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );
  const dataToShow = useMemo(() => data?.pages.flatMap((page) => page.items), [data]);

  const loadingArray = Array.from<undefined>({ length: 2 });

  return (
    <Container size="lg" mt={20}>
      <Flex gap="md">
        <NavbarLinksGroup />
        <Flex direction="column" gap={4}>
          <strong>SUAS ÁREAS DE TRABALHO</strong>

          <Flex maw={900} wrap="wrap" align="center" gap={8}>
            {(isLoading ? loadingArray : dataToShow)?.map((board, idx) => (
              <BoardCard key={isLoading ? idx : board?.id} board={board} loading={isLoading} />
            ))}
            {isFetchingNextPage && <BoardCard loading />}
            <CreateBoardPopover>
              <Button variant="default" miw={200} mih={100}>
                <Text c="white">Criar novo quadro</Text>
              </Button>
            </CreateBoardPopover>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
}
