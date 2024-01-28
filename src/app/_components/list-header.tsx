"use client"

import { useState, type FC, type MutableRefObject } from "react"
import { api } from "@/trpc/react"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { useForm } from "react-hook-form"

import { useClickOutside } from "@/hooks/useClickOutside"

interface ListHeaderProps {
  initialTitle: string
  listId: string
}

const ListHeader: FC<ListHeaderProps> = ({ initialTitle, listId }) => {
  const [mode, setMode] = useState<"view" | "edit">("view")
  const { mutate: edit } = api.list.edit.useMutation()

  const clickOutsideRef = useClickOutside(() => {
    setMode("view")

    if (!title) return

    edit({ listId, title: title })

    clickOutsideRef.current?.blur()
  }) as MutableRefObject<HTMLInputElement>

  const form = useForm({
    defaultValues: {
      title: initialTitle,
    },
  })

  const title = form.getValues("title")

  if (mode === "view") {
    return (
      <Button
        variant="link"
        tabIndex={-1}
        className="ml-14"
        defaultValue={title}
        onClick={() => setMode("edit")}
      />
    )
  }

  return (
    <Input
      {...form.register("title")}
      ref={clickOutsideRef}
      defaultValue={title}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          edit({ listId, title: title })
          setMode("view")
        }
      }}
    />
  )
}

export default ListHeader
