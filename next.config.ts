import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support both Tailwind CSS and SCSS
  experimental: {
    // Allow CSS imports in server components if needed
  },
};

export default nextConfig;
