"use client"

import {Button} from "../../components/ui/button";
import {useRouter} from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="mb-16 flex h-screen flex-col items-center justify-center text-center">
      <span
        className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        404
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">Algo está faltando</h2>
      <p>
        Desculpe, a página que você procura não existe ou foi movida.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Voltar
        </Button>
        <Button onClick={() => router.push("/")} variant="ghost" size="lg">
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  )
}
