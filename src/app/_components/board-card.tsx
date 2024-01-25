import { Box, Overlay, Paper, Skeleton, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import Link from 'next/link';
import { type InfiniteBoard } from '~/trpc/shared';
import { isHexColor } from '~/utils/isHexColor';

interface BoardCardProps {
  board?: InfiniteBoard;
  loading?: boolean;
}

export default function BoardCard({ board, loading = false }: BoardCardProps) {
  const { hovered, ref } = useHover<HTMLAnchorElement>();

  return (
    <Box>
      <Skeleton visible={loading}>
        <Paper
          ref={ref}
          w={190}
          h={100}
          p="sm"
          component={Link}
          href={`/b/${board?.id}/${board?.title}`}
          style={{
            backgroundColor: board?.background,
            backgroundImage: isHexColor(board?.background)
              ? undefined
              : `url(${board?.background})`,
            pointerEvents: loading ? 'none' : 'all',
          }}
        >
          <Text c="white">{board?.title}</Text>
          {hovered && <Overlay color="#000" backgroundOpacity={0.4} />}
        </Paper>
      </Skeleton>
    </Box>
  );
}
