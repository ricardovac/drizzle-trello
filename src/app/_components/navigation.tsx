'use client';
import {
  Autocomplete,
  Group,
  Burger,
  rem,
  Flex,
  Center,
  Box,
  useMantineTheme,
  Text,
  Anchor,
  Divider,
  SimpleGrid,
  Button,
  UnstyledButton,
  ThemeIcon,
  Popover,
  PopoverTarget,
  PopoverDropdown,
} from '@mantine/core';
import classes from '~/styles/header-search.module.css';
import { Book, ChevronDown, Code, Coins, Search } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { UserMenu } from './user-menu';
import { type Session } from 'next-auth';
import Link from 'next/link';
import CreateBoardPopover from './create-board-popover';

const mockdata = [
  {
    icon: Code,
    title: 'Meu quadro 1',
    description: 'Tarefas para o teste automatizados',
  },
  {
    icon: Coins,
    title: 'Quadro teste',
    description: 'Lorem ipsum dolor sit amet, qu.',
  },
  {
    icon: Book,
    title: 'Meu quadro 2',
    description: 'Tarefas para o backend',
  },
];

interface NavigationProps {
  session: Session | null;
}

export function Navigation({ session }: NavigationProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <header className={classes.header}>
      <Flex h={'50px'} justify={'space-between'} align={'center'}>
        <Flex align="center">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
            <Link href="/">Trello Clone</Link>
          </Group>

          <Group h="100%" gap={10} visibleFrom="sm" ml={20}>
            <Popover width={600} position="bottom-start" radius="md" shadow="md" withinPortal>
              <PopoverTarget>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Quadros
                    </Box>
                    <ChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </PopoverTarget>

              <PopoverDropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Quadros recentes</Text>
                  <Anchor href="#" fz="xs">
                    Ver todos
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={20}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between" mt={20}>
                    <div>
                      <Text fw={500} fz="sm">
                        Ver quadros importantes
                      </Text>
                      <Text size="xs" c="dimmed">
                        Quadros importantes são marcados com estrela
                      </Text>
                    </div>
                    <Button variant="default">Importantes</Button>
                  </Group>
                </div>
              </PopoverDropdown>
            </Popover>
            <Link href="#" className={classes.link}>
              Templates
            </Link>
            <CreateBoardPopover>
              <Button h={30}>Criar</Button>
            </CreateBoardPopover>
          </Group>
        </Flex>

        <Group>
          <Autocomplete
            visibleFrom="sm"
            className={classes.search}
            placeholder="Pesquisar"
            rightSectionPointerEvents="all"
            leftSection={<Search style={{ width: rem(16), height: rem(16) }} />}
            data={[{ group: 'Quadros recentes', items: ['Meu quadro'] }]}
            maxDropdownHeight={200}
          />
          <UserMenu session={session} />
        </Group>
      </Flex>
    </header>
  );
}
