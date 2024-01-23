import {api} from "~/trpc/react";
import {type FC, useEffect, useRef} from "react";
import {Button, Flex, Textarea} from "@mantine/core";
import {X} from "lucide-react";
import {type SingleList} from "~/trpc/shared";
import {useForm} from "@mantine/form";

interface CardFormProps {
  list: SingleList;
  mode: "button" | "form";
  setMode: (value: "button" | "form") => void;
}

const CardForm: FC<CardFormProps> = ({list, mode, setMode}) => {
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
      await utils.list.all.invalidate({boardId});

      form.reset();
    },
  });
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [ref, mode]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        createCard.mutate({listId: list.id!, title: values.cardTitle});
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
        <Button variant="subtle" onClick={() => setMode("button")}>
          <X/>
        </Button>
      </Flex>
    </form>
  );
}

export default CardForm;