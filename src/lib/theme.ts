'use client';
import { Input, createTheme } from '@mantine/core';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  components: {
    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
    }),
  },
});
