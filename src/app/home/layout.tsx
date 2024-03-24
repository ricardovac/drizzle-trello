import {homeConfig} from "config/home";
import Link from "next/link";
import {cn} from "lib/utils";
import {buttonVariants} from "components/ui/button";
import {HomeNav} from "@/app/components/home-nav";

export default async function HomeLayout({children}: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <HomeNav items={homeConfig.mainNav}/>
          <nav>
            <Link
              href="/api/auth/signin"
              className={cn(buttonVariants({variant: "secondary", size: "sm"}), "px-4")}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
