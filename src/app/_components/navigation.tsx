"use client";
import { Autocomplete, Group, Burger, rem, Flex, Box } from "@mantine/core";
import classes from "~/styles/header-search.module.css";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { UserMenu } from "./user-menu";
import { type Session } from "next-auth";
import { useState } from "react";

const links = [
  { link: "/desks", label: "Áreas de trabalho" },
  { link: "/likes", label: "Marcado com estrela" },
  { link: "/more", label: "Mais" },
];

export function Navigation({ session }: { session: Session | null }) {
  const [opened, { toggle }] = useDisclosure(false);
  const [searchBarSize, setSearchBarSize] = useState(16);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Flex h={"50px"} justify={"space-between"} align={"center"}>
        <Flex align="center">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
            />
            Kanban
          </Group>

          <Group ml="sm" gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
        </Flex>

        <Group>
          <Autocomplete
            className={classes.search}
            placeholder="Pesquisar"
            size="sm"
            leftSection={
              <Search style={{ width: rem(searchBarSize), height: rem(16) }} />
            }
            data={["Cartões"]}
            visibleFrom="xs"
            onFocus={() => setSearchBarSize(32)}
          />
          <UserMenu session={session} />
        </Group>
      </Flex>
    </header>
  );
}
