import List from '@/components/list';
import ListForm from '@/components/list-form';
import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import BoardAppShell from '~/app/_components/board-appshell';
import BoardContext from '~/app/context/board-context';
import { api } from '~/trpc/server';
import { type SingleBoard } from '~/trpc/shared';

interface BoardPageProps {
  params: { id: string; title: string };
}

export function generateMetadata({ params }: BoardPageProps) {
  return {
    title: `${params.title} | drizzle-trello`,
  };
}

export default async function Page({ params }: BoardPageProps) {
  const id = params.id;

  const board = await api.board.get.query({ id });
  const initialLists = await api.list.all.query({
    boardId: id,
  });
  const permission = await getBoardUserPermission(board);

  return (
    <BoardContext lists={initialLists} board={board} permission={permission}>
      <BoardAppShell>
        <Flex gap={8} align="flex-start">
          <List />
          <ListForm />
        </Flex>
      </BoardAppShell>
    </BoardContext>
  );
}

export async function getBoardUserPermission(board: SingleBoard) {
  const session = await getServerSession();

  if (board.ownerId === session?.user.id) {
    return 'OWNER';
  }

  if (!board.public) {
    throw new Error('This board is private!');
  }

  return 'VISITOR';
}
