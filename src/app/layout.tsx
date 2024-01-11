import '@mantine/core/styles.css';
import '~/styles/globals.css';

import { headers } from 'next/headers';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { theme } from '~/lib/theme';
import { getServerAuthSession } from '~/server/auth';
import { TRPCReactProvider } from '~/trpc/react';
import { Navigation } from './_components/navigation';
import { Inter } from 'next/font/google';

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
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <MantineProvider theme={theme}>
            <ColorSchemeScript />
            <Navigation session={session} />
            <div style={{ paddingTop: '3rem' }}>{children}</div>
            <ReactQueryDevtools initialIsOpen={false} />
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
