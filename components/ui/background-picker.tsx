import React from "react"
import Image from "next/image"
import { BackgroundTypeSchema } from "@/server/schema/board.schema"
import { Paintbrush } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const solids = [
  "#E2E2E2",
  "#ff75c3",
  "#ffa647",
  "#ffe83f",
  "#9fff5b",
  "#70e2ff",
  "#cd93ff",
  "#09203f"
]

const gradients = [
  "linear-gradient(to bottom right,#accbee,#e7f0fd)",
  "linear-gradient(to bottom right,#d5d4d0,#d5d4d0,#eeeeec)",
  "linear-gradient(to bottom right,#000000,#434343)",
  "linear-gradient(to bottom right,#09203f,#537895)",
  "linear-gradient(to bottom right,#AC32E4,#7918F2,#4801FF)",
  "linear-gradient(to bottom right,#f953c6,#b91d73)",
  "linear-gradient(to bottom right,#ee0979,#ff6a00)",
  "linear-gradient(to bottom right,#F00000,#DC281E)",
  "linear-gradient(to bottom right,#00c6ff,#0072ff)",
  "linear-gradient(to bottom right,#4facfe,#00f2fe)",
  "linear-gradient(to bottom right,#0ba360,#3cba92)",
  "linear-gradient(to bottom right,#FDFC47,#24FE41)",
  "linear-gradient(to bottom right,#8a2be2,#0000cd,#228b22,#ccff00)",
  "linear-gradient(to bottom right,#40E0D0,#FF8C00,#FF0080)",
  "linear-gradient(to bottom right,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)",
  "linear-gradient(to bottom right,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)"
]

const images = [
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=90&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90",
  "https://images.unsplash.com/photo-1530981711668-84c7d5aee08f?q=90&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1516821440248-f497afaf1b05?q=90&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

interface BackgroundPickerProps {
  value: BackgroundTypeSchema
  onChange: (value: BackgroundTypeSchema) => void
  className?: string
}

const BackgroundPicker = React.forwardRef<HTMLInputElement, BackgroundPickerProps>(
  ({ className, value, onChange }, ref) => {
    const [colorValue, setColorValue] = React.useState(value.value)
    const [imageValue, setImageValue] = React.useState("")
    const [gradientValue, setGradientValue] = React.useState("")

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div>
            <Button
              variant={"outline"}
              type="button"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
            >
              <div className="flex w-full items-center gap-2">
                {!!value ? (
                  <div
                    className="size-4 rounded !bg-cover !bg-center transition-all"
                    style={
                      value.type === "image"
                        ? { backgroundImage: `url(${value.value})` }
                        : { background: value.value }
                    }
                  ></div>
                ) : (
                  <Paintbrush className="size-4" />
                )}
                <div className="flex-1 truncate">
                  {!!value.value ? value.value : "Selecione uma cor"}
                </div>
              </div>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64" ref={ref}>
          <Tabs
            className="w-full"
            defaultValue="color"
            onValueChange={(v) => {
              onChange({
                value: v === "image" ? imageValue : v === "gradient" ? gradientValue : colorValue,
                type: v as "color" | "gradient" | "image"
              })
            }}
          >
            <TabsList className="mb-4 w-full">
              <TabsTrigger className="flex-1" value="solid">
                Solid
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="gradient">
                Gradient
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="image">
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="solid" className="mt-0 flex flex-wrap gap-1">
              {solids.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="size-6 cursor-pointer rounded-md active:scale-105"
                  onClick={() => {
                    setColorValue(s)
                    onChange({ value: s, type: "color" })
                  }}
                />
              ))}
            </TabsContent>

            <TabsContent value="gradient" className="mt-0">
              <div className="mb-2 flex flex-wrap gap-1">
                {gradients.map((s) => (
                  <div
                    key={s}
                    style={{ background: s }}
                    className="size-6 cursor-pointer rounded-md active:scale-105"
                    onClick={() => {
                      setGradientValue(s)
                      onChange({ value: s, type: "gradient" })
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <div className="flex flex-col gap-4">
                <div className="mb-2 grid grid-cols-2 gap-1">
                  {images.map((s) => (
                    <Image
                      onClick={() => {
                        setImageValue(s)
                        onChange({ value: s, type: "image" })
                      }}
                      key={s}
                      width={100}
                      height={100}
                      alt="Board Image"
                      src={s}
                      className="h-12 w-full cursor-pointer rounded-md bg-cover bg-center active:scale-105"
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    )
  }
)

BackgroundPicker.displayName = "BackgroundPicker"

export { BackgroundPicker }
