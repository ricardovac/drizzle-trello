'use client';
import CardForm from '@/components/card-form';
import ListArea from '@/components/list-area';
import ListHeader from '@/components/list-header';
import { ActionIcon, Card, CardSection, Flex } from '@mantine/core';
import { MoreHorizontal } from 'lucide-react';
import { type FC } from 'react';
import { type SingleList } from '~/trpc/shared';

interface ListItemProps {
  list: SingleList;
  columnId: string;
}

const ListItem: FC<ListItemProps> = ({ list, columnId }) => {
  return (
    <Card radius="md" w={272} bg="dark" id="listCard">
      <Flex justify="space-between" align="center" gap={8}>
        <ListHeader initialTitle={list.title} listId={list.id} />

        <ActionIcon variant="subtle" aria-label="HorizontalCardIcon">
          <MoreHorizontal />
        </ActionIcon>
      </Flex>

      <CardSection px={12} py={12}>
        <ListArea cards={list.cards} columnId={columnId} />
      </CardSection>

      <CardForm list={list} />
    </Card>
  );
};

export default ListItem;
