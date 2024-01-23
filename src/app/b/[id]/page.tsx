import {Flex} from '@mantine/core';
import {type Metadata} from 'next';
import {getServerSession} from 'next-auth';
import BoardAppShell from '~/app/_components/board-appshell';
import ListForm from '@/components/list-form';
import BoardContext from '~/app/context/board-context';
import {api} from '~/trpc/server';
import {type SingleBoard} from '~/trpc/shared';
import List from "@/components/list";

interface BoardPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Board"
}

export default async function Page({params}: BoardPageProps) {
  const id = params.id;

  const board = await api.board.get.query({id});
  const initialLists = await api.list.all.query({
    boardId: id,
  });
  const permission = await getBoardUserPermission(board);

  return (
    <BoardContext lists={initialLists} board={board} permission={permission}>
      <BoardAppShell>
        <Flex gap={8} align="flex-start">
          <List/>
          <ListForm/>
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
