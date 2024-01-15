import '@mantine/core/styles.css';
import '~/styles/globals.css';

import { headers } from 'next/headers';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Inter } from 'next/font/google';
import { ClientSessionProvider } from '~/lib/client-session-provider';
import { theme } from '~/lib/theme';
import { getServerAuthSession } from '~/server/auth';
import { TRPCReactProvider } from '~/trpc/react';
import { Navigation } from './_components/navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'drizzle-trello',
  description: 'A task management app built with tRPC / Next.js / Mantine and DrizzleORM',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={inter.className}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <ClientSessionProvider>
          <TRPCReactProvider headers={headers()}>
            <MantineProvider theme={theme}>
              <Navigation session={session} />
              <div style={{ paddingTop: '3rem' }}>{children}</div>
              <ReactQueryDevtools initialIsOpen={false} />
            </MantineProvider>
          </TRPCReactProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
