// next.js does not support next.config.js as module, so we can't use import
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    reactCompiler: true,
  },
  eslint: {
    ignoreDuringBuilds: !!process.env.SKIP_LINT,
  },
  typescript: {
    ignoreBuildErrors: !!process.env.SKIP_TYPES,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  transpilePackages: ['@brickninja-org/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
