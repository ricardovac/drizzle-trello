'use client';
import { Button, Card, CardSection, Flex, Input, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '~/trpc/react';
import { type List } from '~/utils/types';

interface ListCardProps {
  lists: List;
}

export default function ListCard({ lists }: ListCardProps) {
  const [isCardInputOpen, setIsCardInputOpen] = useState<boolean>(false);
  const { mutate: createCard } = api.card.create.useMutation();
  const { mutate: editList } = api.list.edit.useMutation();

  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title) {
        errors.title = 'Insira um título';
      }

      return errors;
    },
  });

  return (
    <>
      {lists.map((item, idx) => (
        <Card key={idx}>
          <CardSection px={20}>
            <Input
              variant="unstyled"
              size="md"
              defaultValue={item.title}
              onChange={(e) => form.setFieldValue('title', e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  editList({ id: item.id!, title: form.values.title });
                }
              }}
            />
          </CardSection>
          <form
            key={idx}
            onSubmit={form.onSubmit((values) => {
              createCard({ listId: item.id!, title: values.title, description: '' });
            })}
          >
            {isCardInputOpen && (
              <Textarea
                placeholder="Insira um título para este cartão..."
                {...form.getInputProps('title')}
              />
            )}
            <Flex justify="space-between" mt={10}>
              {!isCardInputOpen ? (
                <Button leftSection={<Plus />} onClick={() => setIsCardInputOpen(true)}>
                  Adicionar um cartäo
                </Button>
              ) : (
                <Button variant="subtle" type="submit">
                  Adicionar um cartã́o
                </Button>
              )}
              {isCardInputOpen && (
                <Button variant="subtle" onClick={() => setIsCardInputOpen(false)}>
                  <X />
                </Button>
              )}
            </Flex>
          </form>
        </Card>
      ))}
    </>
  );
}
