import { getServerAuthSession } from "@/server/auth"

import "@/styles/globals.css"
import { type Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { TRPCReactProvider } from "@/trpc/react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { siteConfig } from "config/site"

import { ThemeProvider } from "../../components/ui/theme-provider"
import { cn } from "../../lib/utils"
import { AuthContextProvider } from "./context/auth-context"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession()
  if (!session?.user) redirect("/api/auth/signin")

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <TRPCReactProvider headers={headers()}>
          <AuthContextProvider user={session?.user}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div style={{ paddingTop: "3rem" }}>{children}</div>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthContextProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
