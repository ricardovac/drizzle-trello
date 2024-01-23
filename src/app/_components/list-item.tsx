'use client';
import {type FC, useState} from 'react';
import {ActionIcon, Button, Card, CardSection, Flex} from "@mantine/core";
import ListHeader from "@/components/list-header";
import {MoreHorizontal, Plus} from "lucide-react";
import {type SingleList} from "~/trpc/shared";
import ListArea from "@/components/list-area";
import CardForm from "@/components/card-form";

interface ListItemProps {
  list: SingleList;
}

const ListItem: FC<ListItemProps> = ({list}) => {
  const [mode, setMode] = useState<"button" | "form">('button')

  return (
    <Card radius="md" w={272} bg="dark" id="listCard">
      <CardSection px={12} pb={12}>
        <Flex justify="space-between" align="center" my={8} gap={8}>
          <ListHeader initialTitle={list.title} listId={list.id}/>

          <ActionIcon variant="subtle" aria-label="HorizontalCardIcon">
            <MoreHorizontal/>
          </ActionIcon>
        </Flex>

        <ListArea listId={list.id} cards={list.cards}/>

        {mode === "button" && (
          <Button
            leftSection={<Plus/>}
            onClick={() => setMode("form")}
            variant="subtle"
          >
            Adicionar um cartäo
          </Button>
        )}
      </CardSection>

      {mode === "form" && (
        <CardForm list={list} mode={mode} setMode={setMode}/>
      )}
    </Card>
  )
};

export default ListItem;
