import '@mantine/core/styles.css';
import '~/styles/globals.css';

import { headers } from 'next/headers';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Inter } from 'next/font/google';
import { theme } from '~/lib/theme';
import { getServerAuthSession } from '~/server/auth';
import { TRPCReactProvider } from '~/trpc/react';
import { Navigation } from './_components/navigation';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'drizzle-trello',
  description: 'A task management app built with tRPC / Next.js / Mantine and DrizzleORM',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <TRPCReactProvider headers={headers()}>
            <Navigation session={session} />
            <div style={{ paddingTop: '3rem' }}>{children}</div>
            <ReactQueryDevtools />
          </TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
