import "~/styles/globals.css";
import "@mantine/core/styles.css";

import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import { Navigation } from "./_components/navigation";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "drizzle-kanban",
  description: "A task management app built with tRPC and Next.js",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto"/>
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Navigation session={session}/>
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
