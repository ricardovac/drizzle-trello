import React, {useCallback, useEffect, useState} from "react"
import {useAuthContext} from "@/context/auth-context"
import {useBoardContext} from "@/context/board-context"
import {api} from "@/trpc/react"
import {zodResolver} from "@hookform/resolvers/zod"
import {Avatar, AvatarFallback, AvatarImage} from "../../../../../../../components/ui/avatar"
import {Button} from "../../../../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../../../../../../components/ui/dialog"
import {Form} from "../../../../../../../components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../../../../components/ui/select"
import {Separator} from "../../../../../../../components/ui/separator"
import {Textarea} from "../../../../../../../components/ui/textarea"
import {useToast} from "../../../../../../../components/ui/use-toast"
import {Session} from "next-auth"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {useDebounce} from "@/hooks/useDebounce"

import MemberCommand from "./member-command"
import MemberTag from "./member-tag"

type Member = Session["user"]

const formSchema = z.object({
  shareMessage: z.string().optional()
})

const MemberDialog = () => {
  const {user} = useAuthContext()
  const {permission, board} = useBoardContext()
  const [selectedMembers, setSelectedMembers] = React.useState<Member[]>([])
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const [query, setQuery] = useState("")

  const {toast} = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
    defaultValues: {
      shareMessage: ""
    }
  })

  const debouncedQuery = useDebounce(query, 200)

  const {data, isLoading} = api.search.byType.useQuery(
    {
      query: debouncedQuery,
      limit: 4,
      type: "users"
    },
    {
      enabled: !!debouncedQuery
    }
  )

  function handleDeleteTag(user: Session["user"]) {
    setSelectedMembers((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
  }

  const handleSelectUser = useCallback(
    (user: Session["user"], setIsCommandListOpen: (boolean: any) => void) => {
      const isUserAlreadyAdded = selectedMembers.some((u) => u.id === user.id)
      const isUserOwner = user.id === board.ownerId

      if (!isUserAlreadyAdded && !isUserOwner) {
        setSelectedMembers((prevUsers) => [...prevUsers, user])
      }

      setQuery("")
      setIsCommandListOpen(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMembers]
  )

  const hasSelectedMembers = selectedMembers.length > 0

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
    }
  }, [dialogOpen, form])

  const {mutate, error, isError} = api.member.add.useMutation()

  function onSubmit({shareMessage}: z.infer<typeof formSchema>) {
    if (isError) {
      toast({
        title: "Ocorreu um erro ao compartilhar o quadro!",
        description: error.message,
        variant: "destructive"
      })
      return
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "Nenhum membro selecionado!",
        description: "Selecione pelo menos um membro para compartilhar o quadro."
      })
      return
    }

    toast({
      title: "Compartilhado!",
      description: "O quadro foi compartilhado com sucesso!"
    })

    selectedMembers.forEach((member) => {
      mutate({
        boardId: board.id,
        userId: member.id,
        shareMessage,
      })
    })

    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Compartilhar</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[700px] space-y-3">
        <DialogHeader>
          <DialogTitle className="text-xl">Compartilhar quadro</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <MemberTag
                  member={member}
                  onClick={() => handleDeleteTag(member)}
                  key={member.id}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-full">
                <MemberCommand
                  isLoading={isLoading}
                  members={data?.users}
                  handleSelectUser={handleSelectUser}
                  setQuery={setQuery}
                  query={query}
                />
              </div>
              <div className="relative">
                <Select>
                  <SelectTrigger className="h-full space-x-2">
                    <SelectValue placeholder="Membro"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member">Membro</SelectItem>
                    <SelectItem value="Spectador" disabled>
                      Espectador
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Compartilhar</Button>
            </div>
          </form>
        </Form>
        {hasSelectedMembers && (
          <Textarea placeholder="Junte-se a mim para trabalharmos juntos neste quadro!"/>
        )}
        <Separator/>
        <DialogFooter>
          <div className="flex w-full items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.image ?? ""}/>
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div>{permission === "OWNER" && <Button variant="ghost">Administrador</Button>}</div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MemberDialog
