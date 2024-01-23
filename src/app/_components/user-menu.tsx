'use client';
import {
  ActionIcon,
  Avatar,
  Checkbox,
  Group,
  HoverCard,
  Menu,
  SimpleGrid,
  Text,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  ChevronRight,
  ListTodo,
  LogIn,
  LogOut,
  MessageCircle,
  Palette,
  Settings,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '../context/auth-context';

export function UserMenu() {
  const { user } = useAuthContext();
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  return (
    <Group justify="center">
      <Menu
        withArrow
        width={300}
        position="bottom"
        transitionProps={{ transition: 'pop' }}
        withinPortal
      >
        <Menu.Target>
          <ActionIcon variant="transparent">
            <Image
              src={user.image ?? '/static/default-profile.jpg'}
              width={30}
              height={30}
              style={{ borderRadius: '100%' }}
              alt="User Profile Picture"
              quality={50}
            />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {user && (
            <>
              <Menu.Item
                rightSection={<ChevronRight style={{ width: rem(16), height: rem(16) }} />}
              >
                <Group>
                  <Avatar radius="xl" src={user.image ?? '/static/default-profile.jpg'} />

                  <div>
                    <Text fw={500}>{user.name}</Text>
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  </div>
                </Group>
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={
                  <ListTodo
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.red[6]}
                  />
                }
              >
                Meus quadros
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <Star
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.yellow[6]}
                  />
                }
              >
                Cartões importantes
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <MessageCircle
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.blue[6]}
                  />
                }
              >
                Mensagens
              </Menu.Item>
            </>
          )}
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item leftSection={<Settings style={{ width: rem(16), height: rem(16) }} />}>
            Configurações
          </Menu.Item>

          <HoverCard position="left-start" withArrow shadow="md" trapFocus width="target">
            <HoverCard.Target>
              <Menu.Item
                leftSection={<Palette style={{ width: rem(16), height: rem(16) }} />}
                rightSection={<ChevronRight style={{ width: rem(16), height: rem(16) }} />}
              >
                Tema
              </Menu.Item>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <SimpleGrid cols={1} spacing={10}>
                <Checkbox
                  label="Luz"
                  color="gray"
                  checked={colorScheme === 'light'}
                  onChange={() => {
                    setColorScheme('light');
                  }}
                />
                <Checkbox
                  label="Escuro"
                  color="gray"
                  checked={colorScheme === 'dark'}
                  onChange={() => {
                    setColorScheme('dark');
                  }}
                />
                <Checkbox
                  label="Tema do navegador"
                  color="gray"
                  checked={colorScheme === 'auto'}
                  onChange={() => {
                    setColorScheme('auto');
                  }}
                />
              </SimpleGrid>
            </HoverCard.Dropdown>
          </HoverCard>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Link href={user ? '/api/auth/signout' : '/api/auth/signin'}>
            <Menu.Item
              color={user ? 'red' : 'blue'}
              leftSection={
                user ? (
                  <LogOut style={{ width: rem(16), height: rem(16) }} />
                ) : (
                  <LogIn style={{ width: rem(16), height: rem(16) }} />
                )
              }
            >
              {user ? 'Sair' : 'Entrar'}
            </Menu.Item>
          </Link>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
