export const isHexColor = (hex: string | undefined): boolean =>
  !!hex?.match(/^#([0-9a-f]{3}){1,2}$/)
