import { AuthContextProvider } from "@/context/auth-context"
import { RecentContextProvider } from "@/context/recent-boards-context"
import { getServerAuthSession } from "@/server/auth"

import "@/styles/globals.css"
import { Viewport, type Metadata } from "next"
import { Public_Sans as FontSans } from "next/font/google"
import { TRPCReactProvider } from "@/trpc/react"
import { api } from "@/trpc/server"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "components/ui/toaster"
import { siteConfig } from "config/site"
import NextTopLoader from "nextjs-toploader"

import { ThemeProvider } from "../../components/ui/theme-provider"
import { cn } from "../../lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession()

  let recentBoards;

  if (session) {
    recentBoards = await api.recent.get.query({
      userId: session?.user.id as string
    })
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <TRPCReactProvider>
          <AuthContextProvider user={session?.user!}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              // disableTransitionOnChange
            >
              <NextTopLoader
                color="#ffffff"
                initialPosition={0.08}
                height={1}
                showSpinner={false}
              />
              <RecentContextProvider recentBoards={recentBoards}>
                {children}
                <Toaster />
              </RecentContextProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthContextProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
