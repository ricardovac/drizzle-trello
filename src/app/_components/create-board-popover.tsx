'use client';
import { Button, ColorPicker, Flex, Paper, Popover, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import Image from 'next/image';
import { useState } from 'react';
import { api } from '~/trpc/react';

interface CreateBoardPopoverProps {
  children: React.ReactNode;
}

export default function CreateBoardPopover({ children }: CreateBoardPopoverProps) {
  const [background, onChange] = useState('');
  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: {
      title: (value) => (value ? undefined : 'Insira um título'),
    },
  });
  const utils = api.useUtils();
  const { mutate, isLoading } = api.board.create.useMutation({
    onMutate: async () => {
      await utils.board.all.cancel({ limit: 10 });

      const prevData = utils.board.all.getData({ limit: 10 });

      utils.board.all.setData({ limit: 10 }, (prev) => ({
        ...prev!,
      }));

      return { prevData };
    },
    onError: (_, __, context) => {
      utils.board.all.setData({ limit: 10 }, context?.prevData);
    },
    onSettled: () => {
      void utils.board.all.invalidate({ limit: 10 });
    },
  });

  return (
    <Popover>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <Flex justify="center" align="center" direction="column" gap={5}>
          <Text fw={500}>Criar quadro</Text>
          <Paper p="md" style={{ backgroundColor: background }} shadow="xs">
            <Image src="/assets/board.svg" alt="Board SVG" width={160} height={90} />
          </Paper>

          <Text fw={500} w={200} size="sm">
            Tela de fundo
          </Text>
          <Flex w={200} wrap="wrap" justify="center" gap={8}>
            <ColorPicker
              format="hex"
              value={background}
              onChange={onChange}
              withPicker={false}
              swatches={[
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
              ]}
            />
          </Flex>
          <form onSubmit={form.onSubmit((values) => mutate({ title: values.title, background }))}>
            <TextInput
              label="Título do quadro"
              description="Dê um nome ao seu quadro"
              required
              variant="default"
              placeholder="Insira o título do quadro"
              {...form.getInputProps('title')}
            />
            {form.errors.title && (
              <Text c="red" size="xs">
                {form.errors.title}
              </Text>
            )}
            <Button fullWidth loading={isLoading} loaderProps={{ type: 'bars' }} type="submit">
              Criar
            </Button>
          </form>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
}
