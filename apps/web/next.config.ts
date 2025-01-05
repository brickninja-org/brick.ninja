import path from 'path';
import type { NextConfig } from 'next';

// @ts-expect-error no types available
import  { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  // publish as standalone docker images
  output: 'standalone',

  // enable experimental features
  experimental: {
    reactCompiler: true,
  },

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
