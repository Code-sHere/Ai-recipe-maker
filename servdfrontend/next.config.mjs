import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
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