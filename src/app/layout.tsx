import '~/styles/globals.css';
import '@mantine/core/styles.css';

import { headers } from 'next/headers';

import { TRPCReactProvider } from '~/trpc/react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '~/lib/theme';
import { Navigation } from './_components/navigation';
import { getServerAuthSession } from '~/server/auth';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
