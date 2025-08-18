import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimize for production builds
  experimental: {
    // Reduce bundle size
    optimizePackageImports: ['@repo/ui', '@repo/auth', '@repo/constants'],
  },
};

export default nextConfig;
