"use client"

import React from "react"
import Image from "next/image"
import {
  BackgroundTypeSchema,
  CreateBoardInput,
  createBoardSchema
} from "@/server/schema/board.schema"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { VariantProps } from "class-variance-authority"
import { BackgroundPicker } from "components/ui/background-picker"
import { Button, buttonVariants } from "components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover"
import { cn, generateRandomHex } from "lib/utils"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"

interface CreateBoardPopoverProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

export default function CreateBoardPopover({
  children,
  variant,
  className
}: CreateBoardPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const form = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      background: { type: "color", value: generateRandomHex() }
    }
  })
  const utils = api.useUtils()
  const { mutate, isLoading, error, isError } = api.board.create.useMutation({
    onSuccess: async () => {
      form.reset()
      setOpen(false)
      await utils.board.all.invalidate({ limit: 10 })
    }
  })

  const watchedBackground = form.watch("background")

  const isSubmitButtonDisabled = !form.getValues("title")

  const onSubmit = (values: CreateBoardInput) => {
    mutate({
      ...values
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className={cn(className)} variant={variant}>
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="relative flex flex-col justify-center gap-6">
          <h1>Criar quadro</h1>

          <BoardPreview background={watchedBackground} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tela de fundo</FormLabel>
                    <FormControl>
                      <BackgroundPicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o título do quadro" {...field} />
                    </FormControl>
                    {isError && <FormMessage>{error?.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <Button className="mt-10 w-full" disabled={isSubmitButtonDisabled} type="submit">
                {isLoading && <LoaderIcon className="mr-2 size-4 animate-spin" />}
                Criar
              </Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface BoardPreviewProps {
  background: BackgroundTypeSchema
}

function BoardPreview({ background }: BoardPreviewProps) {
  function Wrap({ children }: { children: React.ReactNode }) {
    return (
      <div
        className="flex justify-center rounded p-6"
        style={
          background.type === "image"
            ? { backgroundImage: `url(${background.value})` }
            : { background: background.value }
        }
      >
        {children}
      </div>
    )
  }

  return (
    <Wrap>
      <Image src="/assets/board.svg" alt="Board SVG" width={160} height={90} />
    </Wrap>
  )
}
