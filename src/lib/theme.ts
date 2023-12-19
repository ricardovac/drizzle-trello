'use client';
import { Input, createTheme } from '@mantine/core';

export const theme = createTheme({
  components: {
    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
    }),
  },
});
