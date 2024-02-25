import { FC, useEffect, useState } from "react"
import { useAuthContext } from "@/context/auth-context"
import { CommandGroup } from "cmdk"
import { Command, CommandInput, CommandItem, CommandList } from "components/ui/command"
import { Session } from "next-auth"

import { UserAvatar } from "../user-avatar"

interface AddMemberInputProps {
  setQuery: (query: string) => void
  query: string
  members: Session["user"][] | undefined
  isLoading?: boolean
  handleSelectUser: (user: Session["user"], setIsCommandListOpen: (boolean: any) => void) => void
}

const AddMemberInput: FC<AddMemberInputProps> = ({
  setQuery,
  query,
  members,
  isLoading,
  handleSelectUser
}) => {
  const { user } = useAuthContext()
  const [isCommandListOpen, setIsCommandListOpen] = useState(false)

  const hasDataToShow = !isLoading && !!members?.length

  useEffect(() => {
    setIsCommandListOpen(!isLoading && hasDataToShow)
  }, [isLoading, hasDataToShow])

  return (
    <Command className="border shadow-md" loop shouldFilter={false}>
      <CommandInput
        value={query}
        onValueChange={(e) => setQuery(e)}
        placeholder="Endereço de e-mail ou nome"
        autoFocus={true}
      />
      {isCommandListOpen && (
        <CommandList className="absolute top-12 z-10 w-full rounded border bg-background">
          <CommandGroup>
            {members?.map((member) => (
              <CommandItem
                key={member.id}
                value={member.name!}
                onSelect={() => handleSelectUser(member, setIsCommandListOpen)}
                className="cursor-pointer gap-2"
                disabled={member.id === user.id}
              >
                <UserAvatar user={member} />
                <span>{member.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  )
}

export default AddMemberInput