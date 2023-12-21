'use client';
import { createTheme, Input, type MantineTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'void',
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'Roboto, monospace',
  headings: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
    }),
    HoverCard: {
      defaultProps: { withinPortal: true },
    },
    Card: {
      defaultProps: { withBorder: true },
    },
    Paper: {
      defaultProps: { withBorder: true },
    },
    Modal: {
      defaultProps: { overlayBlur: 4 },
      styles: (theme: MantineTheme) => ({
        title: {
          fontWeight: 700,
          fontSize: theme.fontSizes.lg,
        },
      }),
    },
    Tooltip: {
      defaultProps: {
        withinPortal: true,
      },
    },
    Popover: {
      defaultProps: {
        withinPortal: true,
        shadow: 'lg',
      },
    },
  },
  colors: {
    void: [
      '#DDD1EE',
      '#CAB9E6',
      '#B49CDC',
      '#A287D3',
      '#9473CC',
      '#8562C5',
      '#7B54C4',
      '#663EB8',
      '#5D35B4',
      '#4828A5',
    ],
  },
});
