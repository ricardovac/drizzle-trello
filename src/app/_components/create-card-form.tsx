'use client';
import { Button, Card, CardSection, Flex, Input, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';
import { type List, type SingleList } from '~/utils/types';

interface ListCardProps {
  lists: List;
}

export default function CreateCardForm({ lists }: ListCardProps) {
  const [openedCardId, setOpenedCardId] = useState<string | null>(null);
  const { mutate: editList } = api.list.edit.useMutation();

  const form = useForm({
    initialValues: {
      listTitle: '',
    },
  });

  return (
    <>
      {lists.map((list, idx) => (
        <Card key={idx}>
          <CardSection px={20} pb={12}>
            <Input
              variant="unstyled"
              size="md"
              defaultValue={list.title}
              onChange={(e) => form.setFieldValue('title', e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  editList({ id: list.id!, title: form.values.listTitle });
                }
              }}
            />
            {openedCardId !== list.id && (
              <Button
                leftSection={<Plus />}
                onClick={() => setOpenedCardId(list.id)}
                variant="subtle"
              >
                Adicionar um cartäo
              </Button>
            )}
          </CardSection>

          {openedCardId === list.id && (
            <CardForm list={list} setOpenedCardId={setOpenedCardId} openedCardId={openedCardId} />
          )}
        </Card>
      ))}
    </>
  );
}

interface CreateCardFormProps {
  list: SingleList;
  setOpenedCardId: (value: null | string) => void;
  openedCardId: string | null;
}

function CardForm({ list, setOpenedCardId, openedCardId = '' }: CreateCardFormProps) {
  const { mutate: createCard } = api.card.create.useMutation();
  const ref = useRef<HTMLTextAreaElement>(null);
  const form = useForm({
    initialValues: {
      cardTitle: '',
    },
    validate: {
      cardTitle: (value) => (value ? undefined : 'Insira um título para o cartão'),
    },
  });

  useEffect(() => {
    if (openedCardId && ref.current) ref.current.focus();
  }, [ref, openedCardId]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        createCard({ listId: list.id!, title: values.cardTitle });
      })}
    >
      <Textarea
        placeholder="Insira um título para este cartão..."
        variant="filled"
        {...form.getInputProps('title')}
        ref={ref}
      />
      <Flex justify="space-between" mt={10} gap={8}>
        <Button type="submit">Adicionar um cartã́o</Button>
        <Button variant="subtle" onClick={() => setOpenedCardId(null)}>
          <X />
        </Button>
      </Flex>
    </form>
  );
}
