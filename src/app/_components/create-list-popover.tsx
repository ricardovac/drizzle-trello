'use client';
import { Button, Input, Popover, PopoverDropdown, PopoverTarget, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { api } from '~/trpc/react';

interface CreateListPopoverProps {
  boardId: number;
}

export default function CreateListPopover({ boardId }: CreateListPopoverProps) {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const utils = api.useUtils();
  const { mutate, error } = api.list.create.useMutation({
    onSuccess: async () => {
      await utils.list.all.invalidate();
      setIsPopoverOpened(false);
      form.reset();
    },
  });

  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title) {
        errors.title = 'Insira um título';
      }

      if (error?.message.includes('Duplicate entry')) {
        errors.title = 'Já existe uma lista com este título';
      }

      return errors;
    },
  });

  return (
    <Popover
      width={300}
      withArrow
      trapFocus
      shadow="md"
      position="bottom"
      onChange={setIsPopoverOpened}
      opened={isPopoverOpened}
    >
      <PopoverTarget>
        <Button
          leftSection={<Plus />}
          variant="default"
          opacity={0.8}
          onClick={() => setIsPopoverOpened((o) => !o)}
        >
          Adicionar uma lista
        </Button>
      </PopoverTarget>
      <PopoverDropdown>
        <form onSubmit={form.onSubmit((values) => mutate({ title: values.title, boardId }))}>
          <Input
            placeholder="Insira o título da lista"
            size="md"
            {...form.getInputProps('title')}
          />
          <Text c="red" size="xs">
            {form.errors.title}
          </Text>
          {form.errors.title && (
            <Text c="red" size="xs">
              {form.errors.title}
            </Text>
          )}
          <Button mt={8} type="submit">
            Adicionar lista
          </Button>
        </form>
      </PopoverDropdown>
    </Popover>
  );
}
