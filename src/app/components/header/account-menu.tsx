import {FC} from "react"
import {Button} from "../../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "../../../../components/ui/dropdown-menu"
import {Icons} from "../../../../components/ui/icons"
import {signIn, signOut} from "next-auth/react"
import {useTheme} from "next-themes"

import {useAuthContext} from "@/context/auth-context"
import {UserAvatar} from "../user-avatar"

interface AccountMenuProps {
}

const AccountMenu: FC<AccountMenuProps> = ({}) => {
  const {user} = useAuthContext()
  const {setTheme} = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{name: user.name || null, image: user.image || null}}
          className="size-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault()
            void signOut({
              redirect: false,
            })
            void signIn("google")
          }}
        >
          Alternar contas
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled className="text-xs font-bold">
            Drizzle Trello
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Button variant="ghost" size="sm" className="size-8 px-0">
                Tema
                <span className="sr-only">Mudar tema</span>
              </Button>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Icons.sun className="mr-2 size-4"/>
                  <span>Claro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Icons.moon className="mr-2 size-4"/>
                  <span>Escuro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Icons.laptop className="mr-2 size-4"/>
                  <span>Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/`
            })
          }}
        >
          Fazer logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountMenu
