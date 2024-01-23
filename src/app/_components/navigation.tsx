'use client';
import {
  Anchor,
  Autocomplete,
  Box,
  Burger,
  Button,
  Center,
  Divider,
  em,
  Flex,
  Group,
  Menu,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  rem,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  Book,
  BookTemplate,
  ChevronDown,
  Code,
  Coins,
  Frame,
  PersonStanding,
  Plus,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CreateBoardPopover from '~/app/_components/create-board-popover';
import classes from '~/styles/header-search.module.css';
import { useAuthContext } from '../context/auth-context';
import { UserMenu } from './user-menu';

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

export function Navigation() {
  const [opened, { toggle }] = useDisclosure(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const { user } = useAuthContext();

  if (!user) void router.push('/api/auth/signin');

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
                      Áreas de trabalho
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
            <CreateMenuPopover menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
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
          <UserMenu />
        </Group>
      </Flex>
    </header>
  );
}

function CreateMenuPopover({
  menuOpened,
  setMenuOpened,
}: {
  menuOpened: boolean;
  setMenuOpened: (opened: boolean) => void;
}) {
  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`);

  return (
    <Menu shadow="md" width={400} opened={menuOpened} onChange={setMenuOpened}>
      <Menu.Target>
        {isMobile ? (
          <Button>
            <Plus />
          </Button>
        ) : (
          <Button>Criar</Button>
        )}
      </Menu.Target>

      <Menu.Dropdown>
        <CreateBoardPopover>
          <Menu.Item leftSection={<Frame style={{ width: rem(24), height: rem(24) }} />}>
            Criar Quadro
            <Text size="sm">
              Um quadro é feito de cartões ordenados em listas. Use-o para gerenciar projetos,
              controlar informações e organizar qualquer coisa.
            </Text>
          </Menu.Item>
        </CreateBoardPopover>
        <Menu.Item leftSection={<BookTemplate style={{ width: rem(24), height: rem(24) }} />}>
          Começar com um template
          <Text size="sm">Comece mais rápido com um template de quadro.</Text>
        </Menu.Item>
        <Menu.Item leftSection={<PersonStanding style={{ width: rem(24), height: rem(24) }} />}>
          Criar Área de trabalho
          <Text size="sm">
            Uma Área de trabalho é um grupo de quadros e pessoas. Use-a para organizar sua empresa,
            atividades paralelas, família ou amigos.
          </Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
