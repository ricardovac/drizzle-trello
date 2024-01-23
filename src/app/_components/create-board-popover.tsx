'use client';
import {
  Button,
  Center,
  ColorPicker,
  Flex,
  Paper,
  Popover,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Image from 'next/image';
import React from 'react';
import { api } from '~/trpc/react';
import { useAuthContext } from '../context/auth-context';

interface CreateBoardPopoverProps {
  children: React.ReactNode;
}

const defaultImages = [
  'https://images.unsplash.com/photo-1584009577996-0227b2358356?q=40&w=244&auto=format',
  'https://images.unsplash.com/photo-1495805442109-bf1cf975750b?q=40&w=244&auto=format',
  'https://images.unsplash.com/photo-1628521495179-ca4448a584d8?q=40&w=244&auto=format',
  'https://images.unsplash.com/photo-1528141603775-81fd11f61682?q=40&w=244&auto=format',
];

const defaultColors = [
  '#25262b',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
];

export default function CreateBoardPopover({ children }: CreateBoardPopoverProps) {
  const { user } = useAuthContext();

  const form = useForm({
    initialValues: {
      title: '',
      background: '',
      public: true,
    },
    validate: {
      title: (value) => value.length < 2 && 'O titulo deve ter pelo menos 2 caracteres',
      background: (value) => !value && 'Selecione um fundo',
    },
  });
  const utils = api.useUtils();
  const { mutate, isLoading } = api.board.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.board.all.invalidate({ limit: 10 });
    },
  });

  const isSubmitButtonDisabled = !form.values.title;

  return (
    <Popover>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <Flex justify="center" direction="column" gap={5}>
          <Center>Criar quadro</Center>
          <BoardPreview background={form.values.background} />

          <Text fw={500} size="sm">
            Tela de fundo
          </Text>
          <form
            onSubmit={form.onSubmit((values) =>
              mutate({
                title: values.title,
                background: values.background,
                ownerId: user.id,
                public: true,
              }),
            )}
          >
            <Stack>
              <Flex gap={12}>
                {defaultImages.map((image) => (
                  <Image
                    key={image}
                    onClick={() => form.setFieldValue('background', image)}
                    src={image}
                    width={50}
                    height={30}
                    alt="Board Image"
                    quality={10}
                    priority
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Flex>
              <ColorPicker
                format="hex"
                withPicker={false}
                swatches={defaultColors}
                {...form.getInputProps('background')}
              />
            </Stack>
            {form.errors.background && (
              <Text c="red" size="sm">
                {form.errors.background}
              </Text>
            )}
            <TextInput
              label="Título do quadro"
              description="Dê um nome ao seu quadro"
              variant="default"
              placeholder="Insira o título do quadro"
              {...form.getInputProps('title')}
            />
            <Button
              fullWidth
              mt={8}
              loading={isLoading}
              disabled={isSubmitButtonDisabled}
              loaderProps={{ type: 'bars' }}
              type="submit"
            >
              Criar
            </Button>
          </form>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
}

interface BoardPreviewProps {
  background: string;
}

function BoardPreview({ background }: BoardPreviewProps) {
  if (background.match(/^#([0-9a-f]{3}){1,2}$/)) {
    return (
      <Paper p="md" style={{ backgroundColor: background }}>
        <Image src="/assets/board.svg" alt="Board SVG" width={160} height={90} />
      </Paper>
    );
  }

  if (background.startsWith('https://images.unsplash.com')) {
    return (
      <Paper p="md" style={{ backgroundImage: `url(${background})` }}>
        <Image src="/assets/board.svg" alt="Board SVG" width={160} height={90} />
      </Paper>
    );
  }

  return (
    <Paper p="md" style={{ backgroundColor: '--mantine-color-gray-0' }}>
      <Image src="/assets/board.svg" alt="Board SVG" width={160} height={90} />
    </Paper>
  );
}
