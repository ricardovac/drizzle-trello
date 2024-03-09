import { FC, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useCardContext } from "@/context/card-context"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "components/ui/button"
import { Checkbox } from "components/ui/checkbox"
import { Form, FormField } from "components/ui/form"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover"
import { Separator } from "components/ui/separator"
import { generateRandomColors, generateRandomHex, getTextColor } from "lib/utils"
import { ChevronLeft, Edit, LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface TagPopoverProps {
  children: React.ReactNode
}

const CreateLabel = z.object({
  title: z.string(),
  color: z.string()
})

const LabelPopover: FC<TagPopoverProps> = ({ children }) => {
  const { board, card, toggleLabel } = useCardContext()
  const cardLabelIds = card?.labels.map((label) => label.labelId) ?? []
  const [search, setSearch] = useState("")
  const [mode, setMode] = useState<"select" | "create">("select")

  const boardLabels = useMemo(() => {
    if (!search.trim()) return board?.labels

    return board?.labels.filter((label) => label.title.toLowerCase().includes(search.toLowerCase()))
  }, [board.labels, search])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full">{children}</Button>
      </PopoverTrigger>
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

              {boardLabels.map((label, index) => (
                <div className="flex w-full items-center gap-2" key={index}>
                  <Checkbox
                    id={`color-${label.id}`}
                    onCheckedChange={(e) => toggleLabel(label, !e)}
                    checked={cardLabelIds.includes(label.id)}
                  />
                  <label
                    style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
                    className="h-8 w-full rounded"
                    htmlFor={`color-${label.id}`}
                  >
                    {label.title}
                  </label>
                  <Button size="icon" variant="ghost">
                    <Edit className="size-4" />
                  </Button>
                </div>
              ))}

              <Button onClick={() => setMode("create")} className="w-full">
                Criar nova etiqueta
              </Button>
            </div>
          </div>
        )}

        {mode === "create" && <NewLabelPopover setMode={setMode} mode={mode} />}
      </PopoverContent>
    </Popover>
  )
}

interface NewLabelPopoverProps {
  setMode: (mode: "select" | "create") => void
  mode: "select" | "create"
}

const NewLabelPopover: FC<NewLabelPopoverProps> = ({ setMode }) => {
  const { board } = useCardContext()

  const form = useForm<z.infer<typeof CreateLabel>>({
    resolver: zodResolver(CreateLabel),
    defaultValues: {
      title: "",
      color: generateRandomHex()
    }
  })

  const title = form.watch("title")
  const color = form.watch("color")

  const { mutate, isLoading } = api.label.create.useMutation({
    onSuccess: () => {
      form.reset()
      setMode("select")
    }
  })

  const onSubmit = async (values: z.infer<typeof CreateLabel>) => {
    mutate({ ...values, boardId: board.id })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="icon" variant="ghost" onClick={() => setMode("select")}>
              <ChevronLeft className="size-4" />
            </Button>
            <Label>Criar etiqueta</Label>
          </div>

          <div className="w-full px-8 py-3">
            <div
              className="h-[40px] flex-1 rounded-md px-4 py-2 text-background transition-all"
              style={{ backgroundColor: color, color: getTextColor(color) }}
            >
              {title}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Título</Label>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="text-sm text-muted-foreground"
                  placeholder="Título para a nova etiqueta"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Selecione uma cor</Label>
            <div className="grid grid-cols-6 gap-2">
              {generateRandomColors(30).map((color, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: color }}
                  className="h-8 w-full cursor-pointer rounded"
                  onClick={() => form.setValue("color", color)}
                />
              ))}
            </div>
          </div>

          <Separator />

          <Button type="submit">
            {isLoading && <LoaderIcon className="mr-2 size-4 animate-spin" />}
            Criar
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LabelPopover
