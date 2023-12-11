import { Container } from "@mantine/core";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: number } }) {
  const id = Number(params.id)
  const board = await api.board.get.query({ id });
  return (
    <Container>
      {JSON.stringify(board)}
    </Container>
  );
}
