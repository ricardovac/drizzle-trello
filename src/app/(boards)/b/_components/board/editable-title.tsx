"use client"

import {FC, MutableRefObject, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "../../../../../../components/ui/button"
import {Input} from "../../../../../../components/ui/input"
import {cn} from "../../../../../../lib/utils"

import {useClickOutside} from "@/hooks/useClickOutside"

interface EditableTitleProps {
  title: string
  onSave: (title: string) => void
  className?: string
}

const EditableTitle: FC<EditableTitleProps> = ({title: initialTitle, onSave, className}) => {
  const [mode, setMode] = useState<"edit" | "view">("view")
  const [title, setTitle] = useState(initialTitle)

  const router = useRouter()

  const clickOutsideRef = useClickOutside(() => {
    setMode("view")

    if (!title.trim()) return
    if (title === initialTitle) return

    onSave(title)
    router.refresh()

    clickOutsideRef.current?.blur()
  }) as MutableRefObject<HTMLInputElement>

  useEffect(() => {
    if (mode === "edit") {
      clickOutsideRef.current?.focus()
      clickOutsideRef.current?.select()
    }
  }, [clickOutsideRef, mode])

  if (mode === "view") {
    return (
      <Button
        tabIndex={-1}
        variant="ghostforeground"
        className={cn("w-full justify-start px-2", className)}
        onClick={() => setMode("edit")}
      >
        {title}
      </Button>
    )
  }

  return (
    <Input
      ref={clickOutsideRef}
      placeholder="Enter list title"
      className={cn("w-full px-2", className)}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setMode("view")
          if (!title.trim()) return
          if (title === initialTitle) return
          onSave(title)
          router.refresh()
        }
      }}
    />
  )
}

export default EditableTitle
