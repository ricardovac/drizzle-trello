/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.mjs');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: [
      'images.pexels.com',
      'cdn.discordapp.com',
      'cdn.discord.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
};

export default config;
