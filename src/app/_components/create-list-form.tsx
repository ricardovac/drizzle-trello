'use client';
import { Button, Card, CardSection, Flex, Input } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';

interface CreateListPopoverProps {
  boardId: string;
}

export default function CreateListForm({ boardId }: CreateListPopoverProps) {
  const [isListInputOpen, setIsListInputOpen] = useState<boolean>(false);

  return (
    <Card>
      <CardSection p={10}>
        {!isListInputOpen && (
          <Button
            leftSection={<Plus />}
            variant="default"
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

  const apiUtils = api.useUtils();
  const router = useRouter();
  const { mutate } = api.list.create.useMutation({
    onSuccess: async () => {
      form.reset();
      router.refresh();
      await apiUtils.list.all.invalidate({ boardId });
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
      <Input
        placeholder="Insira o título da lista..."
        size="md"
        {...form.getInputProps('title')}
        ref={ref}
      />
      <Flex mt={10} align="center" gap={8}>
        <Button type="submit">Adicionar lista</Button>
        <Button variant="subtle" onClick={() => setIsListInputOpen(false)}>
          <X />
        </Button>
      </Flex>
    </form>
  );
}
