/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@arcjet/next"],
  logging: {
    serverFunctions: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.themealdb.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;