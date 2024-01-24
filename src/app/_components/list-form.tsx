/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';
import { Button, Card, Flex, Input } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside } from '@mantine/hooks';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';
import { useAuthContext } from '../context/auth-context';
import { useBoardContext } from '../context/board-context';

export default function ListForm() {
  const [mode, setMode] = useState<'button' | 'form'>('button');
  const cardRef = useClickOutside(() => setMode('button'));
  const { board } = useBoardContext();

  if (mode === 'button') {
    return (
      <Button
        leftSection={<Plus />}
        ref={cardRef}
        variant="white"
        onClick={() => setMode('form')}
        opacity={0.6}
      >
        Adicionar uma lista
      </Button>
    );
  }

  return <ListFormField boardId={board.id} setMode={setMode} mode={mode} />;
}

interface CreateListFormProps {
  boardId: string;
  setMode: (value: 'button' | 'form') => void;
  mode: 'button' | 'form';
}

function ListFormField({ boardId, setMode, mode }: CreateListFormProps) {
  const { lists } = useBoardContext();
  const { user } = useAuthContext();
  const ref = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();
  const userId = user.id ?? '';
  const cardRef = useClickOutside(() => setMode('button'));

  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: {
      title: (value) => (value ? undefined : 'Insira um título para a lista'),
    },
  });

  const { mutate } = api.list.create.useMutation({
    onMutate: async (newData) => {
      await utils.list.all.cancel();

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
      setMode('button');
      void utils.list.all.invalidate({ boardId });
    },
  });

  useEffect(() => {
    if (mode && ref.current) ref.current.focus();
  }, [ref, mode]);

  const onSubmit = form.onSubmit((values) => {
    mutate({ title: values.title, boardId, position: (lists.at(-1)?.position ?? 0) + 1 });
    form.reset();
  });

  return (
    <Card bg="dark" ref={cardRef}>
      <form onSubmit={onSubmit}>
        <Flex gap={8} direction="column">
          <Input
            placeholder="Insira o título da lista..."
            {...form.getInputProps('title')}
            name="title"
            ref={ref}
          />
          <Flex align="center" justify="space-between">
            <Button type="submit">Adicionar lista</Button>
            <Button variant="subtle" onClick={() => setMode('button')}>
              <X />
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
}
