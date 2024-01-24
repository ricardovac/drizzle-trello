'use client';

import { Input } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside } from '@mantine/hooks';
import { useState, type FC } from 'react';
import { api } from '~/trpc/react';

interface ListHeaderProps {
  initialTitle: string;
  listId: string;
}

const ListHeader: FC<ListHeaderProps> = ({ initialTitle, listId }) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { mutate: edit } = api.list.edit.useMutation();

  const clickOutsideRef = useClickOutside(() => {
    setMode('view');

    if (!title) return;

    edit({ listId, title: title });

    clickOutsideRef.current?.blur();
  });

  const form = useForm({
    initialValues: {
      title: initialTitle,
    },
  });

  const title = form.values.title;

  if (mode === 'view') {
    return (
      <Input
        tabIndex={-1}
        size="md"
        variant="unstyled"
        defaultValue={title}
        onClick={() => setMode('edit')}
        ml={14}
      />
    );
  }

  return (
    <Input
      size="md"
      ref={clickOutsideRef}
      defaultValue={title}
      onChange={(e) => form.setFieldValue('title', e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          edit({ listId, title: title });
          setMode('view');
        }
      }}
    />
  );
};

export default ListHeader;
