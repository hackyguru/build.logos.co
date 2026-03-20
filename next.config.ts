import type { NextConfig } from "next";
import path from "path";

const __dir = path.dirname(new URL(import.meta.url).pathname);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  turbopack: {
    resolveAlias: {
      "@components": path.resolve(__dir, "components"),
      "@utils": path.resolve(__dir, "utils"),
      "@context": path.resolve(__dir, "context"),
    },
  },
};

export default nextConfig;
