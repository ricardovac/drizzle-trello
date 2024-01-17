import '@mantine/core/styles.css';
import '@/styles/globals.css';

import { Box, Container, Flex } from '@mantine/core';
import { WorkspaceLinksGroup } from '@/components/sidebar';
import { getServerAuthSession } from '~/server/auth';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  if (!session) return null;

  return (
    <Container size="lg" my={30}>
      <Flex gap="xl">
        <WorkspaceLinksGroup session={session} />
        <Box>{children}</Box>
      </Flex>
    </Container>
  );
}
