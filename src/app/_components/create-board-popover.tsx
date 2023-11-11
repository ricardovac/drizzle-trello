import {
  Flex,
  Text,
  Button,
  ColorPicker,
  TextInput,
  Paper,
} from "@mantine/core";
import { useState } from "react";
import Image from 'next/image'

export default function CreateBoardPopover() {
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [value, onChange] = useState("rgba(47, 119, 150, 0.7)");

  return (
    <Flex justify="center" align="center" direction="column" gap={5}>
      <Text fw={500}>Criar quadro</Text>
      <Paper p="md" style={{ backgroundColor: value }} shadow="xs">
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
        value={value}
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
        onClick={() => setIsCreateBoardOpen(!isCreateBoardOpen)}
      />
      <Button fullWidth>Criar</Button>
    </Flex>
  );
}
