import { Box, Paper, Skeleton, Text } from '@mantine/core';
import Link from 'next/link';
import { isHexColor } from '~/utils/isHexColor';
import { type InfiniteBoard } from '~/utils/types';

interface BoardCardProps {
  board?: InfiniteBoard;
  loading?: boolean;
}

export default function BoardCard({ board, loading = false }: BoardCardProps) {
  return (
    <Box>
      <Skeleton visible={loading}>
        <Paper
          w={200}
          h={100}
          p="sm"
          component={Link}
          href={`/b/${board?.id}`}
          style={{
            backgroundColor: board?.background,
            backgroundImage: isHexColor(board?.background)
              ? undefined
              : `url(${board?.background})`,
            pointerEvents: loading ? 'none' : 'all',
          }}
        >
          <Text c="white">{board?.title}</Text>
        </Paper>
      </Skeleton>
    </Box>
  );
}
