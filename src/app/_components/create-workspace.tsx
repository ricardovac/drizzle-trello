"use client"

import { FC, useEffect, useState } from "react"
import { Button } from "components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Textarea } from "components/ui/textarea"
import { RouterOutputs } from "@/trpc/shared"
 
const Roles = [
  "CRM de vendas",
  "Operações",
  "Pequena Empresa",
  "RH",
  "Marketing",
  "Engenharia/TI",
  "Outro"
]

interface CreateWorkspaceProps {
  workspace: RouterOutputs["workspace"]["get"] 
  hasUser: boolean
}

const CreateWorkspace: FC<CreateWorkspaceProps> = ({ workspace, hasUser }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!hasUser && !workspace) {
      setOpen(true)
    }
  }, [hasUser, workspace])

  return (
    <Dialog open
      ={open}>
      <DialogContent className="sm:min-h-[25vw] sm:min-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Criar uma área de trabalho</DialogTitle>
          <DialogDescription>
            Aumente sua produtividade facilitando o acesso de todos aos quadros em um só local.
          </DialogDescription>
        </DialogHeader>
        <div className="container grid grid-rows-3 gap-4 py-4">
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="name" className="text-right">
              Nome da Área de Trabalho
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo de área de Trabalho
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Escolher..." />
              </SelectTrigger>
              <SelectContent>
                {Roles.map((role) => (
                  <SelectItem value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição da Área de Trabalho{" "}
              <span className="text-muted-foreground">(Opcional)</span>
            </Label>
            <Textarea
              id="description"
              value="Nossa equipe organiza tudo aqui."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspace
