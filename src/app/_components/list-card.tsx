import { Button, Card, CardSection, Input } from '@mantine/core';
import { Plus } from 'lucide-react';
import { type List } from '~/utils/types';

interface ListCardProps {
  lists: List;
}

export default function ListCard({ lists }: ListCardProps) {
  return (
    <>
      {lists.map((item, idx) => (
        <Card key={idx}>
          <CardSection px={20}>
            <Input value={item.title} variant="unstyled" size="md" />
          </CardSection>
          <Button leftSection={<Plus />} variant="subtle">
            Adicionar um cartã́o
          </Button>
        </Card>
      ))}
    </>
  );
}
