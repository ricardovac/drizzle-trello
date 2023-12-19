'use client';
import { Button, Card, CardSection, Flex, Input } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '~/trpc/react';

interface CreateListPopoverProps {
  boardId: string;
}

export default function CreateListForm({ boardId }: CreateListPopoverProps) {
  const [isListInputOpen, setIsListInputOpen] = useState(false);

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
      {isListInputOpen && <ListForm boardId={boardId} setIsListInputOpen={setIsListInputOpen} />}
    </Card>
  );
}

interface CreateListFormProps {
  boardId: string;
  setIsListInputOpen: (value: boolean) => void;
}

function ListForm({ boardId, setIsListInputOpen }: CreateListFormProps) {
  const utils = api.useUtils();
  const { mutate } = api.list.create.useMutation({
    onSuccess: async () => {
      await utils.list.all.invalidate({ boardId });
      setIsListInputOpen(false);
      form.reset();
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
  return (
    <form onSubmit={form.onSubmit((values) => mutate({ title: values.title, boardId }))}>
      <Input placeholder="Insira o título da lista..." size="md" {...form.getInputProps('title')} />
      <Flex mt={10} align="center" gap={8}>
        <Button type="submit">Adicionar lista</Button>
        <Button variant="subtle" onClick={() => setIsListInputOpen(false)}>
          <X />
        </Button>
      </Flex>
    </form>
  );
}
