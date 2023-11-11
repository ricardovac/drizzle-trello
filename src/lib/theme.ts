"use client";
import { Input, createTheme } from "@mantine/core";
import { Space_Grotesk } from "next/font/google";

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const theme = createTheme({
  fontFamily: space_grotesk.style.fontFamily,
  components: {
    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        inputWrapperOrder: ["label", "input", "description", "error"],
      },
    }),
  },
});
