"use client";
import { Container, Flex, Text } from "@mantine/core";
import { NavbarLinksGroup } from "./_components/navbar";
import { api } from "~/trpc/react";
import BoardCard from "./_components/board-card";
import { useMemo } from "react";

export default function Home() {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.board.all.useInfiniteQuery(
      { limit: 10 },
      {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  const dataToShow = useMemo(
    () => data?.pages.flatMap((page) => page.items),
    [data],
  );

  return (
    <Container my="md" size="lg">
      <Flex gap="md">
        <NavbarLinksGroup />
        <Flex direction="column">
          <Text>SUAS ÁREAS DE TRABALHO</Text>
          {dataToShow?.map((board, idx) => (
            <BoardCard
              key={isLoading ? idx : board?.id}
              board={board}
              isBoardLoading={isLoading}
            />
          ))}

          {isLoading && <BoardCard isBoardLoading />}
        </Flex>
      </Flex>
    </Container>
  );
}
