import { UserAvatar } from "@/app/components/user-avatar"
import { useAuthContext } from "@/context/auth-context"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { FC } from "react"

const CardActivityForm: FC = () => {
  const { user } = useAuthContext()

  return (
    <div className="flex flex-col items-start gap-4">
      <Label htmlFor="username" className="text-right">
        Atividade
      </Label>
      <div className="flex w-full gap-2">
        <UserAvatar user={user} />
        <Input id="Activity" placeholder="Escrever um comentário..." />
      </div>
    </div>
  )
}

export default CardActivityForm;
