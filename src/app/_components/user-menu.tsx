"use client";
import {
  Menu,
  Group,
  Text,
  Avatar,
  useMantineTheme,
  ActionIcon,
  rem,
} from "@mantine/core";
import {
  ChevronRight,
  ListTodo,
  LogIn,
  LogOut,
  MessageCircle,
  Settings,
  Star,
  SwitchCameraIcon,
} from "lucide-react";
import Image from "next/image";
import { type Session } from "next-auth";
import Link from "next/link";

export function UserMenu({ session }: { session: Session | null }) {
  const theme = useMantineTheme();
  return (
    <Group justify="center">
      <Menu
        withArrow
        width={300}
        position="bottom"
        transitionProps={{ transition: "pop" }}
        withinPortal
      >
        <Menu.Target>
          <ActionIcon variant="transparent">
            <Image
              src={session?.user.image ?? ""}
              width={30}
              height={30}
              style={{ borderRadius: "100%" }}
              alt="User Profile Picture"
            />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            rightSection={
              <ChevronRight style={{ width: rem(16), height: rem(16) }} />
            }
          >
            <Group>
              <Avatar
                radius="xl"
                src={session?.user.image ?? ""}
              />

              <div>
                <Text fw={500}>{session?.user.name}</Text>
                <Text size="xs" c="dimmed">
                  {session?.user.email ?? ""}
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

          <Menu.Label>Settings</Menu.Label>
          <Menu.Item
            leftSection={
              <Settings style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Configurações
          </Menu.Item>
          <Menu.Item
            leftSection={
              <SwitchCameraIcon style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Trocar de conta
          </Menu.Item>
          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
            <Menu.Item
              color="red"
              leftSection={
                session ? (
                  <LogOut style={{ width: rem(16), height: rem(16) }} />
                ) : (
                  <LogIn style={{ width: rem(16), height: rem(16) }} />
                )
              }
            >
              {session ? "Sair" : "Entrar"}
            </Menu.Item>
          </Link>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
