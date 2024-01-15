/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';
import { Button, Card, Flex, Input } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside } from '@mantine/hooks';
import { Plus, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';

interface CreateListPopoverProps {
  boardId: string;
}

export default function CreateListForm({ boardId }: CreateListPopoverProps) {
  const [isListInputOpen, setIsListInputOpen] = useState<boolean>(false);
  const cardRef = useClickOutside(() => setIsListInputOpen(false));

  return (
    <>
      {!isListInputOpen && (
        <Button
          leftSection={<Plus />}
          ref={cardRef}
          variant="filled"
          onClick={() => setIsListInputOpen((o) => !o)}
        >
          Adicionar uma lista
        </Button>
      )}
      {isListInputOpen && (
        <ListForm boardId={boardId} setIsListInputOpen={setIsListInputOpen} isListInputOpen />
      )}
    </>
  );
}

interface CreateListFormProps {
  boardId: string;
  setIsListInputOpen: (value: boolean) => void;
  isListInputOpen: boolean;
}

function ListForm({ boardId, setIsListInputOpen, isListInputOpen = false }: CreateListFormProps) {
  const ref = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();
  const { data: session } = useSession();
  const userId = session?.user.id ?? '';
  const cardRef = useClickOutside(() => setIsListInputOpen(false));

  const { mutate } = api.list.create.useMutation({
    onMutate: async (newData) => {
      await utils.list.all.cancel({ boardId });

      const previousList = utils.list.all.getData({ boardId });

      const newList = {
        ...newData,
        id: '',
        createdById: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      };

      utils.list.all.setData({ boardId }, previousList ? [...previousList, newList] : [newList]);

      return { previousList };
    },
    onError: (_, __, context) => {
      utils.list.all.setData({ boardId }, context?.previousList);
    },
    onSettled: () => {
      form.reset();
      setIsListInputOpen(false);
    },
  });

  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: {
      title: (value) => (value ? undefined : 'Insira um título para a lista'),
    },
  });

  useEffect(() => {
    if (isListInputOpen && ref.current) ref.current.focus();
  }, [ref, isListInputOpen]);

  return (
    <Card bg="dark" ref={cardRef}>
      <form onSubmit={form.onSubmit((values) => mutate({ title: values.title, boardId }))}>
        <Flex gap={8} direction="column">
          <Input
            placeholder="Insira o título da lista..."
            {...form.getInputProps('title')}
            name="title"
            ref={ref}
          />
          <Flex align="center" justify="space-between">
            <Button type="submit">Adicionar lista</Button>
            <Button variant="subtle" onClick={() => setIsListInputOpen(false)}>
              <X />
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
}
