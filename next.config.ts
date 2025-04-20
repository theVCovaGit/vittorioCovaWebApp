import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['aieidcly9hc7teof.public.blob.vercel-storage.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', 
    },
  },
};

export default nextConfig;
