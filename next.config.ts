// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

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