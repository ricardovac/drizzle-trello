import BoardAppShell from '~/app/_components/board-appshell';
import CreateListPopover from '~/app/_components/create-list-popover';
import ListCard from '~/app/_components/list-card';
import { api } from '~/trpc/server';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const board = await api.board.get.query({ id });
  const lists = await api.list.all.query({
    boardId: id,
  });

  return (
    <BoardAppShell board={board}>
      <ListCard lists={lists} />
      <CreateListPopover boardId={id} />
    </BoardAppShell>
  );
}
