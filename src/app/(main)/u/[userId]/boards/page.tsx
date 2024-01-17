'use client';
import BoardCard from '@/components/board-card';
import CreateBoardPopover from '@/components/create-board-popover';
import { Button, Flex, Text } from '@mantine/core';
import { useMemo } from 'react';
import { api } from '~/trpc/react';

interface BoardsPageProps {
  params: { userId: string };
}

export default function Boards({ params }: BoardsPageProps) {
  const userId = params.userId;

  const { data, isLoading, isFetchingNextPage } = api.board.all.useInfiniteQuery(
    { limit: 10, userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );
  const dataToShow = useMemo(() => data?.pages.flatMap((page) => page.items), [data]);

  const loadingArray = Array.from<undefined>({ length: 2 });

  return (
    <Flex gap="md">
      <Flex direction="column" gap={4}>
        <Text fw={500} mb={4}>
          SUAS ÁREAS DE TRABALHO
        </Text>

        <Flex maw={900} wrap="wrap" align="center" gap={8}>
          {(isLoading ? loadingArray : dataToShow)?.map((board, idx) => (
            <BoardCard key={isLoading ? idx : board?.id} board={board} loading={isLoading} />
          ))}
          {isFetchingNextPage && <BoardCard loading />}
          <CreateBoardPopover>
            <Button variant="default" miw={190} mih={100}>
              <Text c="white">Criar novo quadro</Text>
            </Button>
          </CreateBoardPopover>
        </Flex>
      </Flex>
    </Flex>
  );
}
