"use client";
import { createTheme } from "@mantine/core";
import {Space_Grotesk} from 'next/font/google'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
})

export const theme = createTheme({
  fontFamily: space_grotesk.style.fontFamily,
})

