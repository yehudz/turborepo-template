import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor
  output: 'export',
  
  // Required for Capacitor
  reactStrictMode: true,
  
  // Optimize images for static export
  images: {
    unoptimized: true,
  },
  
  // Optional: Configure output directory for Capacitor
  distDir: 'out',
  
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
