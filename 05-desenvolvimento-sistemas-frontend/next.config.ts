import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
  }
};

export default nextConfig;