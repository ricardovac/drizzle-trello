import { Flex } from '@mantine/core';
import dynamic from 'next/dynamic';
import BoardAppShell from '~/app/_components/board-appshell';
import { api } from '~/trpc/server';

const CreateCardForm = dynamic(() => import('~/app/_components/create-card-form'), {
  ssr: false,
});
const CreateListForm = dynamic(() => import('~/app/_components/create-list-form'), {
  ssr: false,
  loading: () => <div>loading...</div>,
});

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const board = await api.board.get.query({ id });
  const lists = await api.list.all.query({
    boardId: id,
  });

  return (
    <BoardAppShell board={board}>
      <Flex gap={8}>
        <CreateCardForm lists={lists} />
        <CreateListForm boardId={id} />
      </Flex>
    </BoardAppShell>
  );
}
