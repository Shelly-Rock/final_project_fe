import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {},
  sassOptions: {
    loadPaths: [path.resolve(__dirname, "src/styles")],
  },
};

export default nextConfig;
