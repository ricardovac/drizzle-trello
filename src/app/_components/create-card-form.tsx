'use client';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { ActionIcon, Button, Card, CardSection, Flex, Input, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside } from '@mantine/hooks';
import cx from 'clsx';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import classes from '~/styles/dbdlist.module.css';
import { api } from '~/trpc/react';
import { type List, type SingleList } from '~/utils/types';

interface ListCardProps {
  initialLists: List;
}

interface onDragEndProps {
  result: DropResult;
  columns: List;
  setColumns: (value: List) => void;
}

export default function CreateCardForm({ initialLists }: ListCardProps) {
  const [openedCardId, setOpenedCardId] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState<string | null>(null);
  const [columns, setColumns] = useState(initialLists);
  const cardRef = useClickOutside(() => setOpenedCardId(null));

  const editList = api.list.edit.useMutation();
  const updateCardList = api.list.editCardList.useMutation();

  const form = useForm({
    initialValues: {
      listTitle: '',
    },
    validate: {
      listTitle: (value) => (value ? '' : 'Insira um título para a lista'),
    },
  });

  const onDragEnd = ({ result, columns, setColumns }: onDragEndProps) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as unknown as number];
      const destColumn = columns[destination.droppableId as unknown as number];
      const sourceItems = [...(sourceColumn?.cards ?? [])];
      const destItems = [...(destColumn?.cards ?? [])];
      const [removed] = sourceItems.splice(source.index, 1);
      if (removed) {
        destItems.splice(destination.index, 0, removed);
      }
      updateCardList.mutate({
        cardId: removed?.id ?? "",
        newListId: destColumn?.id ?? '',
      });
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          cards: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          cards: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId as unknown as number];
      const copiedItems = [...(column?.cards ?? [])];
      const [removed] = copiedItems.splice(source.index, 1);
      if (removed) {
        copiedItems.splice(destination.index, 0, removed);
      }
      updateCardList.mutate({
        cardId: removed?.id ?? "",
        newOrder: destination.index,
      });
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          cards: copiedItems,
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd({ result, columns, setColumns })}>
      {Object.entries(columns).map(([columnId, column], _) => (
        <Card key={columnId} radius="md" w={272} bg="dark" id="listCard" ref={cardRef}>
          <CardSection px={12} pb={12}>
            <Flex justify="space-between" align="center" my={8} gap={8}>
              <Input
                radius="md"
                size="md"
                variant={isInputFocused === column.id ? 'filled' : 'unstyled'}
                onFocus={(e) => {
                  setIsInputFocused(column.id);
                  e.currentTarget.select();
                }}
                onBlur={() => setIsInputFocused(null)}
                defaultValue={column.title}
                onChange={(e) => form.setFieldValue('listTitle', e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    editList.mutate({ id: column.id!, title: form.values.listTitle });
                    setIsInputFocused(null);
                  }
                }}
              />
              <ActionIcon variant="subtle" aria-label="HorizontalCardIcon">
                <MoreHorizontal />
              </ActionIcon>
            </Flex>
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, _) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ minHeight: '10px' }}
                >
                  {column.cards.map((card, index) => (
                    <Draggable index={index} key={card.id} draggableId={card.id ?? ''}>
                      {(provided, snapshot) => {
                        const itemClasses = cx(classes.item, {
                          [classes.itemDragging ?? '']: snapshot.isDragging,
                        });
                        return (
                          <div
                            className={itemClasses}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <Text className={classes.symbol}>{card.title}</Text>
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {openedCardId !== column.id && (
              <Button
                leftSection={<Plus />}
                onClick={() => setOpenedCardId(column.id)}
                variant="subtle"
              >
                Adicionar um cartäo
              </Button>
            )}
          </CardSection>

          {openedCardId === column.id && (
            <CardForm list={column} setOpenedCardId={setOpenedCardId} openedCardId={openedCardId} />
          )}
        </Card>
      ))}
    </DragDropContext>
  );
}

interface CreateCardFormProps {
  list: SingleList;
  setOpenedCardId: (value: null | string) => void;
  openedCardId: string | null;
}

function CardForm({ list, setOpenedCardId, openedCardId = '' }: CreateCardFormProps) {
  const createCard = api.card.create.useMutation({
    onSuccess: () => {
      setOpenedCardId(null);
    },
  });
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
        <Button variant="subtle" onClick={() => setOpenedCardId(null)}>
          <X />
        </Button>
      </Flex>
    </form>
  );
}
