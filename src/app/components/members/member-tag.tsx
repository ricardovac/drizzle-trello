import React, { FC } from "react"
import { Badge } from "components/ui/badge"
import { X } from "lucide-react"
import { Session } from "next-auth"

interface MemberTagProps extends React.HTMLAttributes<HTMLDivElement> {
  member: Session["user"]
}

const MemberTag: FC<MemberTagProps> = ({ member, onClick }) => {
  return (
    <div className="flex cursor-pointer gap-2">
      <Badge variant="secondary" onClick={onClick}>
        {member.name}
        <X className="size-4"/>
      </Badge>
    </div>
  )
}

export default MemberTag
