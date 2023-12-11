"use client";
import {
  Flex,
  Text,
  Button,
  ColorPicker,
  TextInput,
  Paper,
} from "@mantine/core";
import { useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
// import { useRouter } from "next/navigation";

export default function CreateBoardPopover() {
  const [background, onChange] = useState("rgba(47, 119, 150, 0.7)");
  const [title, setTitle] = useState("");
  const utils = api.useUtils();
  // const router = useRouter();

  const createBoard = api.board.create.useMutation({
    onSuccess: () => {
      setTitle("");
    },
    onMutate: async () => {
      await Promise.all([utils.board.invalidate()]);
    },
  });
  return (
    <Flex justify="center" align="center" direction="column" gap={5}>
      <Text fw={500}>Criar quadro</Text>
      <Paper p="md" style={{ backgroundColor: background }} shadow="xs">
        <Image
          src="/assets/board.svg"
          alt="Board SVG"
          width={160}
          height={90}
        />
      </Paper>
      <Text fw={500} w={200} size="sm">
        Tela de fundo
      </Text>
      <ColorPicker
        format="hex"
        value={background}
        onChange={onChange}
        withPicker={false}
        swatches={[
          "#25262b",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#7950f2",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
        ]}
      />
      <TextInput
        label="Título do quadro"
        description="Dê um nome ao seu quadro"
        required
        variant="default"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <Button
        fullWidth
        loading={createBoard?.isLoading}
        loaderProps={{ type: "bars" }}
        onClick={() => {
          createBoard?.mutate({ title, background });
        }}
      >
        Criar
      </Button>
    </Flex>
  );
}
