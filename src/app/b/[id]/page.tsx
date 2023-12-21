import { Flex } from '@mantine/core';
import dynamic from 'next/dynamic';
import BoardAppShell from '~/app/_components/board-appshell';
import { api } from '~/trpc/server';

interface BoardPageProps {
  params: { id: string };
}

const CreateCardForm = dynamic(() => import('~/app/_components/create-card-form'), {
  ssr: false,
});
const CreateListForm = dynamic(() => import('~/app/_components/create-list-form'), {
  ssr: false,
});

export default async function Page({ params }: BoardPageProps) {
  const id = params.id;
  const board = await api.board.get.query({ id });
  const initialLists = await api.list.all.query({
    boardId: id,
  });

  return (
    <BoardAppShell board={board}>
      <Flex gap={8} align="flex-start">
        <CreateCardForm initialLists={initialLists} />
        <CreateListForm boardId={id} />
      </Flex>
    </BoardAppShell>
  );
}
