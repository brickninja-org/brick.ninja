import type { NextConfig } from 'next';

import path from 'path';

// @ts-expect-error no types available
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  // publish as standalone docker images
  output: 'standalone',

  // enable experimental features
  experimental: {
    reactCompiler: true,

    // taint is not actually used, this is just to opt Next.js into using react@experimental,
    // so other APIs become available (e.g. useEffectEvent)
    taint: true,
  },

  // Allow cross-origin requests during development
  allowedDevOrigins: ['*.brickninja.localhost'],

  // disable eslint/typescript during some CI jobs, as there are separate jobs for it
  eslint: { ignoreDuringBuilds: !!process.env.SKIP_LINT },
  typescript: { ignoreBuildErrors: !!process.env.SKIP_TYPES },

  // transpile @gw2treasures/ui package
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@brickninja-org/ui'],
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

export default nextConfig;
