import {
  Button,
  Input,
  Popover,
  PopoverDropdown,
  PopoverTarget,
} from "@mantine/core";
import { Plus } from "lucide-react";
import BoardAppShell from "~/app/_components/board-appshell";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  const board = await api.board.get.query({ id });
  return (
    <BoardAppShell board={board}>
      <Popover width={300} withArrow trapFocus shadow="md" position="bottom">
        <PopoverTarget>
          <Button leftSection={<Plus />} variant="default" opacity={0.8}>
            Adicionar uma lista
          </Button>
        </PopoverTarget>
        <PopoverDropdown>
          <Input placeholder="Insira o título da lista" size="md" />
          <Button mt={8}>Adicionar lista</Button>
        </PopoverDropdown>
      </Popover>
    </BoardAppShell>
  );
}
