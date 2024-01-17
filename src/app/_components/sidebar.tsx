'use client';
import classes from '@/styles/navbar-linksgroup.module.css';
import {
  Box,
  Collapse,
  Divider,
  Group,
  NavLink,
  Stack,
  ThemeIcon,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { Calendar, ChevronRight, CircuitBoard, Home, type LucideIcon } from 'lucide-react';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import react from 'react';

interface LinksGroupProps {
  icon: LucideIcon;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  session: Session;
}

export function LinksGroup({
  icon: Icon,
  session,
  label,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = react.useState(initiallyOpened ?? false);
  const items = (hasLinks ? links : []).map((link) => (
    <Link className={classes.link} href={link.link} key={link.label} scroll={false}>
      {link.label}
    </Link>
  ));

  return (
    <Stack maw={260}>
      <Links session={session} />
      <Divider my={8} />
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }} mr={6}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronRight
              className={classes.chevron}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </Stack>
  );
}

export function WorkspaceLinksGroup({ session }: { session: Session }) {
  const mockdata = {
    session: session,
    label: `Àrea de trabalho de ${session?.user.name}`,
    icon: Calendar,
    links: [
      { label: 'Quadros', link: `/u/${session?.user.id}/boards` },
      { label: 'Destaques', link: '/w/areadetrabalho/highlights' },
      { label: 'Membros', link: '/w/areadetrabalho/views/table' },
    ],
  };

  return <LinksGroup {...mockdata} initiallyOpened />;
}

export function Links({ session }: { session: Session }) {
  const userId = session?.user.id;
  const pathname = usePathname();

  const topLinks = [
    {
      icon: <CircuitBoard />,
      label: 'Quadros',
      href: `/u/${userId}/boards`,
    },
    {
      icon: <Home />,
      label: 'Início',
      href: '/',
    },
  ];

  const items = topLinks.map((item, idx) => (
    <NavLink
      key={idx}
      component={Link}
      href={{ pathname: item.href }}
      className={classes.navLink}
      active={pathname.trim() === item.href.trim()}
      leftSection={item.icon}
      label={item.label}
    />
  ));

  return <Group gap={4}>{items}</Group>;
}
