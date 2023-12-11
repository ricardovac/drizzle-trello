import { Paper, Text, Card } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/trpc/shared";

interface BoardCardProps {
  board?: RouterOutputs["board"]["all"]["items"][0];
  loading?: boolean;
}

export default function BoardCard({ board, loading = false }: BoardCardProps) {
  const isHexColor = (hex: string): boolean =>
    hex.startsWith("#") && hex.length === 7;

  return (
    <Link href={`/b/${board?.id}`}>
      <Card
        m={4}
        style={loading ? { pointerEvents: "none" } : {}}
        pos="relative"
        withBorder
      >
        <Card.Section>
          {loading && <Paper py="xl" style={{ backgroundColor: "#ddd" }} />}
          {isHexColor(board?.background ?? "") ? (
            <Paper
              py="xl"
              style={{ backgroundColor: board?.background ?? "" }}
            />
          ) : (
            <Image
              src={board?.background ?? ""}
              alt="Board SVG"
              width={160}
              height={90}
            />
          )}
        </Card.Section>

        <Text fw={500} size="lg" m={4}>
          {board?.title}
        </Text>
      </Card>
    </Link>
  );
}
