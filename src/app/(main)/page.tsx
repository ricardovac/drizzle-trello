import { type FC } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "components/ui/card"
import { cn } from "lib/utils"

const HomePage: FC = () => {
  return (
    <div className="mt-20 max-w-[600px]">
      <StayUpdated />
    </div>
  )
}

type CardProps = React.ComponentProps<typeof Card>

function StayUpdated({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-[500px]", className)} {...props}>
      <CardHeader>
        <Image
          src="https://images.unsplash.com/photo-1584009577996-0227b2358356"
          height={200}
          width={200}
          alt="Norway"
        />
      </CardHeader>

      <CardContent>
        <div className="mb-2 mt-12 flex flex-col justify-center">
          <strong>Fique por dentro e atualizado</strong>
        </div>
      </CardContent>

      <CardFooter>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consectetur perferendis
          totam nobis blanditiis ipsam id odit reprehenderit eius nostrum, exercitationem rerum
          perspiciatis nemo voluptas sequi officia sit iusto.
        </p>
      </CardFooter>
    </Card>
  )
}

export default HomePage
