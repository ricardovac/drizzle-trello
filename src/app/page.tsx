"use client";
import { Container, Flex, Text, Group } from "@mantine/core";
import { NavbarLinksGroup } from "./_components/navbar";
import { api } from "~/trpc/react";
import BoardCard from "./_components/board-card";
import { useMemo } from "react";

export default function Home() {
  const { data, isLoading, isFetchingNextPage } =
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

  const loadingArray = Array.from<undefined>({ length: 4 });

  return (
    <Container size="lg" mt={20}>
      <Flex gap="md">
        <NavbarLinksGroup />
        <Flex direction="column" gap={4}>
          <Text>SUAS ÁREAS DE TRABALHO</Text>
          <Group grow>
            {(isLoading ? loadingArray : dataToShow)?.map((board, idx) => (
              <BoardCard
                key={isLoading ? idx : board?.id}
                board={board}
                loading={isLoading}
              />
            ))}
          </Group>

          {isFetchingNextPage && <BoardCard loading />}
        </Flex>
      </Flex>
    </Container>
  );
}
