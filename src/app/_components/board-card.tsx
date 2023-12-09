import {  Loader, Paper, Text, Box } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { type RouterOutputs } from "~/trpc/shared";

interface BoardCardProps {
  board?: RouterOutputs["board"]["all"]["items"][0];
  isBoardLoading: boolean;
}

export default function BoardCard({ board, isBoardLoading }: BoardCardProps) {
  const isHexColor = (hex: string): boolean =>
    hex.startsWith("#") && hex.length === 7;

  if (isBoardLoading) return <Loader color="blue" />;

  return (
    <Link href={`/b/${board?.title}`}>
      <Box m={4}>
        {isHexColor(board?.background ?? "") ? (
          <Paper
            py="xl"
            style={{ backgroundColor: board?.background ?? "" }}
            shadow="xs"
          />
        ) : (
          <Image
            src={board?.background ?? ""}
            alt="Board SVG"
            width={160}
            height={90}
          />
        )}

        <Text fw={500} size="lg" m={4} pos="absolute">
          {board?.title}
        </Text>
      </Box>
    </Link>
  );
}
