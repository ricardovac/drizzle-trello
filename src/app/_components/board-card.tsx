import { Card, Paper, Skeleton, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { type InfiniteBoard } from '~/utils/types';

interface BoardCardProps {
  board?: InfiniteBoard;
  loading?: boolean;
}

export default function BoardCard({ board, loading = false }: BoardCardProps) {
  const isHexColor = (hex: string): boolean => hex.startsWith('#') && hex.length === 7;

  return (
    <Link href={`/b/${board?.id}`} style={loading ? { pointerEvents: 'none' } : {}}>
      <Skeleton visible={loading}>
        <Card pos="relative" miw={200} mih={120}>
          <Card.Section>
            {isHexColor(board?.background ?? '') ? (
              <Paper py="xl" style={{ backgroundColor: board?.background ?? '' }} />
            ) : (
              board?.background && (
                <Image src={board?.background} alt="Board SVG" width={160} height={90} />
              )
            )}
          </Card.Section>

          <Text fw={500} size="lg" m={4}>
            {board?.title}
          </Text>
        </Card>
      </Skeleton>
    </Link>
  );
}
