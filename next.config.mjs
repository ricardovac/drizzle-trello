await import("./src/env.mjs")

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        scrollRestoration: true
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com"
            },
            {
                protocol: "https",
                hostname: "cdn.discord.com"
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com"
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com"
            },
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com"
            }
        ]
    }
}

export default config
