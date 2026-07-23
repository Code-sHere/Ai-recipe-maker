import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  serverExternalPackages: [
    "@arcjet/next",
    "@arcjet/protocol",
    "@arcjet/analyze",
    "@google/generative-ai",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
      // Catch-all: treat any node:-prefixed import as external on the client
      // build instead of letting webpack choke trying to parse it.
      config.externals.push(({ request }, callback) => {
        if (request && request.startsWith("node:")) {
          return callback(null, "commonjs " + request);
        }
        callback();
      });
    }
    return config;
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