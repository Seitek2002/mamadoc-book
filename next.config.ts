// next.config.ts
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Content-Security-Policy: единственный внешний origin — iwork.operator.kg
// (API и фото). Шрифты self-hosted через next/font. 'unsafe-inline' в
// script-src нужен инлайн-скриптам гидратации Next.js, 'unsafe-eval' — только
// для react-refresh в dev-режиме.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://iwork.operator.kg",
  "font-src 'self' data:",
  "connect-src 'self' https://iwork.operator.kg",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  images: {
    unoptimized: true,
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