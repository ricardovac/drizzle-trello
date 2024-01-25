import { Button, Flex, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState, type FC } from 'react';
import { api } from '~/trpc/react';
import { type SingleList } from '~/trpc/shared';

interface CardFormProps {
  list: SingleList;
}

const CardForm: FC<CardFormProps> = ({ list }) => {
  const [mode, setMode] = useState<'button' | 'form'>('button');
  const utils = api.useUtils();
  const form = useForm({
    initialValues: {
      cardTitle: '',
    },
    validate: {
      cardTitle: (value) => (value ? undefined : 'Insira um título para o cartão'),
    },
  });

  const createCard = api.card.create.useMutation({
    onSuccess: async () => {
      const boardId = list.boardId;
      await utils.list.all.invalidate({ boardId });

      form.reset();
      setMode('button');
    },
  });
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [ref, mode]);

  if (mode === 'button') {
    return (
      <Button
        leftSection={<Plus />}
        justify="start"
        onClick={() => setMode('form')}
        variant="subtle"
      >
        Adicionar um cartäo
      </Button>
    );
  }

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        createCard.mutate({ listId: list.id!, title: values.cardTitle });
      })}
    >
      <Textarea
        placeholder="Insira um título para este cartão..."
        variant="filled"
        {...form.getInputProps('cardTitle')}
        ref={ref}
      />
      <Flex justify="space-between" mt={10} gap={8}>
        <Button type="submit" loading={createCard.isLoading}>
          Adicionar um cartã́o
        </Button>
        <Button variant="subtle" onClick={() => setMode('button')}>
          <X />
        </Button>
      </Flex>
    </form>
  );
};

export default CardForm;
