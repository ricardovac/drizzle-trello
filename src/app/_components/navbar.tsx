'use client';
import { Box, Collapse, Group, ThemeIcon, UnstyledButton, rem } from '@mantine/core';
import { Calendar, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import classes from '~/styles/navbar-linksgroup.module.css';

interface LinksGroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened ?? false);
  const [active, setActive] = useState<number | null>(null);
  const items = (hasLinks ? links : []).map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
      text={link.label}
    />
  ));

  return (
    <>
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
    </>
  );
}

const mockdata = {
  label: `Área de trabalho de Ricardo`,
  icon: Calendar,
  links: [
    { label: 'Quadros', link: '/' },
    { label: 'Templates', link: '/templates' },
    { label: 'Ínicio', link: '/inicio' },
  ],
  initiallyOpened: true,
};

export function NavbarLinksGroup() {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
    </Box>
  );
}

interface NavbarLinkProps {
  active?: boolean;
  onClick?(): void;
  text: string;
}

function NavbarLink({ text, active, onClick }: NavbarLinkProps) {
  return (
    <UnstyledButton
      onClick={() => {
        if (onClick) onClick();
      }}
      className={classes.link}
      data-active={active ?? undefined}
      bg={active ? 'blue' : 'transparent'}
    >
      {text}
    </UnstyledButton>
  );
}
