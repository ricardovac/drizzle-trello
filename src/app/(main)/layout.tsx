import '@/styles/globals.css';
import '@mantine/core/styles.css';

import { WorkspaceLinksGroup } from '@/components/sidebar';
import { Box, Container, Flex } from '@mantine/core';
import { getServerAuthSession } from '~/server/auth';
import { AuthContextProvider } from '../context/auth-context';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) return null;

  const user = session.user;

  return (
    <AuthContextProvider user={user}>
      <Container size="lg" my={30}>
        <Flex gap="xl">
          <WorkspaceLinksGroup />
          <Box>{children}</Box>
        </Flex>
      </Container>
    </AuthContextProvider>
  );
}
