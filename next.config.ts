// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'iwork.operator.kg',
      },
      {
        protocol: 'https',
        hostname: 'iwork.operator.kg',
      },
    ]
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.tsx',  // или '*.tsx', если хочешь типы React
      },
    },
  },
};

export default nextConfig;