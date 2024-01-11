'use client';
import { Button, Card, CardSection, Flex, Input } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside } from '@mantine/hooks';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';

interface CreateListPopoverProps {
  boardId: string;
}

export default function CreateListForm({ boardId }: CreateListPopoverProps) {
  const [isListInputOpen, setIsListInputOpen] = useState<boolean>(false);
  const cardRef = useClickOutside(() => setIsListInputOpen(false));

  return (
    <Card bg="dark" ref={cardRef}>
      <CardSection>
        {!isListInputOpen && (
          <Button
            leftSection={<Plus />}
            variant="default"
            bg="dark"
            opacity={0.8}
            onClick={() => setIsListInputOpen((o) => !o)}
          >
            Adicionar uma lista
          </Button>
        )}
      </CardSection>
      {isListInputOpen && (
        <ListForm boardId={boardId} setIsListInputOpen={setIsListInputOpen} isListInputOpen />
      )}
    </Card>
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
  const router = useRouter();

  const { mutate } = api.list.create.useMutation({
    onMutate: async (newList) => {
      await utils.list.all.cancel({ boardId });

      const previousList = utils.list.all.getData({ boardId });

      const newListWith = {
        ...newList,
        id: '',
        createdById: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      };

      utils.list.all.setData(
        { boardId },
        previousList ? [...previousList, newListWith] : [newListWith],
      );

      return { previousList };
    },
    onError: (_, __, context) => {
      utils.list.all.setData({ boardId }, context?.previousList);
    },
    onSettled: async () => {
      await utils.list.all.invalidate({ boardId });

      form.reset();
      router.refresh();
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
    <form onSubmit={form.onSubmit((values) => mutate({ title: values.title, boardId }))}>
      <Flex gap={8} direction="column" mt={18}>
        <Input
          placeholder="Insira o título da lista..."
          {...form.getInputProps('title')}
          name="title"
          ref={ref}
        />{' '}
        <Flex align="center" justify="space-between">
          <Button type="submit">Adicionar lista</Button>
          <Button variant="subtle" onClick={() => setIsListInputOpen(false)}>
            <X />
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
