import { FC, useEffect, useState } from "react"
import { CommandGroup } from "cmdk"
import { Command, CommandInput, CommandItem, CommandList } from "components/ui/command"
import { Session } from "next-auth"

import { UserAvatar } from "../user-avatar"

interface AddMemberInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
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
            {members?.map((user) => (
              <CommandItem
                key={user.id}
                value={user.name!}
                onSelect={() => handleSelectUser(user, setIsCommandListOpen)}
                className="cursor-pointer gap-2"
              >
                <UserAvatar user={user} />
                <span>{user.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  )
}

export default AddMemberInput
