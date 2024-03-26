import {FC, useMemo, useState} from "react"
import {useCardContext} from "@/context/card-context"
import {CreateLabelInput, createLabelSchema} from "@/server/schema/label.schema"
import {api} from "@/trpc/react"
import {SingleLabel} from "@/trpc/shared"
import {zodResolver} from "@hookform/resolvers/zod"
import {CheckedState} from "@radix-ui/react-checkbox"
import {Button} from "../../../../../../components/ui/button"
import {Checkbox} from "../../../../../../components/ui/checkbox"
import {Form, FormControl, FormField, FormItem, FormMessage} from "../../../../../../components/ui/form"
import {Input} from "../../../../../../components/ui/input"
import {Label} from "../../../../../../components/ui/label"
import {Popover, PopoverContent, PopoverTrigger} from "../../../../../../components/ui/popover"
import {ScrollArea} from "../../../../../../components/ui/scroll-area"
import {Separator} from "../../../../../../components/ui/separator"
import {generateRandomColors, generateRandomHex, getTextColor} from "../../../../../../lib/utils"
import {ChevronLeft, Edit, LoaderIcon} from "lucide-react"
import {useForm} from "react-hook-form"

interface TagPopoverProps {
  children: React.ReactNode
}

const LabelPopover: FC<TagPopoverProps> = ({children}) => {
  const {board, card} = useCardContext()
  const cardLabelIds = card?.labels?.map((label) => label.id) ?? []
  const [search, setSearch] = useState("")
  const [mode, setMode] = useState<"select" | "create">("select")

  const boardLabels = useMemo(() => {
    if (!search.trim()) return board?.labels

    return board?.labels.filter((label) => label.title.toLowerCase().includes(search.toLowerCase()))
  }, [board.labels, search])

  const utils = api.useUtils()

  const addLabel = api.label.add.useMutation()
  const removeLabel = api.label.remove.useMutation()

  const handleCheckboxChange = (label: SingleLabel, e: CheckedState) => {
    const cardId = card?.id!
    const labelId = label.id

    if (!e) {
      removeLabel.mutate({cardId, labelId})

      utils.card.get.setData({cardId}, (old) => {
        return {
          ...old,
          labels: old?.labels?.filter((l) => l.id !== label.id)!
        }
      })
    } else {
      addLabel.mutate({cardId, labelId})

      utils.card.get.setData({cardId}, (old) => {
        return {
          ...old,
          labels: [...(old?.labels ?? []), label]
        }
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        {mode === "select" && (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-4 text-center">
                <Label>Etiquetas</Label>
                <Input
                  className="text-sm text-muted-foreground"
                  placeholder="Buscar etiquetas..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs">Etiquetas</Label>

              {boardLabels.length === 0 && (
                <p className="text-center text-muted-foreground">
                  Não há etiquetas para mostrar. Crie uma nova etiqueta.
                </p>
              )}

              <ScrollArea className="h-44">
                <div className="p-2">
                  {boardLabels.map((label) => (
                    <div className="flex w-full items-center gap-2" key={label.id}>
                      <Checkbox
                        id={`color-${label.id}`}
                        onCheckedChange={(e) => handleCheckboxChange(label, e)}
                        checked={cardLabelIds.includes(label.id)}
                      />
                      <label
                        style={{backgroundColor: label.color, color: getTextColor(label.color)}}
                        className="h-8 w-full rounded px-2"
                        htmlFor={`color-${label.id}`}
                      >
                        {label.title}
                      </label>
                      <Button size="icon" variant="ghost">
                        <Edit className="size-4"/>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Button onClick={() => setMode("create")} className="w-full">
                Criar nova etiqueta
              </Button>
            </div>
          </div>
        )}

        {mode === "create" && <NewLabelPopover setMode={setMode} mode={mode}/>}
      </PopoverContent>
    </Popover>
  )
}

interface NewLabelPopoverProps {
  setMode: (mode: "select" | "create") => void
  mode: "select" | "create"
}

const NewLabelPopover: FC<NewLabelPopoverProps> = ({setMode}) => {
  const [colors] = useState(generateRandomColors(30))

  const {board, card} = useCardContext()
  const cardId = card?.id!

  const form = useForm<CreateLabelInput>({
    resolver: zodResolver(createLabelSchema),
    defaultValues: {
      title: "",
      color: generateRandomHex(),
      cardId,
      boardId: board.id
    }
  })

  const utils = api.useUtils()

  const {mutate, isLoading} = api.label.create.useMutation({
    onMutate: async (label) => {
      await utils.card.get.cancel({cardId})

      const previousCard = utils.card.get.getData({cardId})

      const newLabel = {
        ...label,
        id: Math.random().toString(36).substring(7)
      }

      utils.card.get.setData({cardId}, (old) => {
        return {
          ...old,
          labels: [...(old?.labels ?? []), newLabel]
        }
      })

      return previousCard
    },
    onError: (_, __, context) => {
      utils.card.get.setData({cardId}, context)
    },
    onSettled: () => {
      void utils.card.get.invalidate({cardId})
    }
  })

  const onSubmit = async (values: CreateLabelInput) => {
    mutate({...values, boardId: board.id, cardId: card?.id!})
  }

  const title = form.watch("title")
  const color = form.watch("color")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="icon" variant="ghost" onClick={() => setMode("select")}>
              <ChevronLeft className="size-4"/>
            </Button>
            <Label>Criar etiqueta</Label>
          </div>

          <div className="w-full px-8 py-3">
            <div
              className="h-[40px] flex-1 rounded-md px-4 py-2 text-background transition-all"
              style={{backgroundColor: color, color: getTextColor(color)}}
            >
              {title}
            </div>
          </div>

          <Separator/>

          <div className="space-y-2">
            <Label>Título</Label>
            <FormField
              name="title"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-sm text-muted-foreground"
                      placeholder="Título para a nova etiqueta"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Selecione uma cor</Label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color, i) => (
                <div
                  key={i}
                  style={{backgroundColor: color}}
                  className="h-8 w-full cursor-pointer rounded"
                  onClick={() => form.setValue("color", color)}
                />
              ))}
            </div>
          </div>

          <Separator/>

          <Button type="submit">
            {isLoading && <LoaderIcon className="mr-2 size-4 animate-spin"/>}
            Criar
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LabelPopover
