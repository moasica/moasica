import childProcess from 'node:child_process';

import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@colour-extractor/colour-extractor'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**'
      }
    ]
  },
  generateBuildId: async () => {
    return childProcess.execSync('git rev-parse HEAD').toString().trim();
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [ '@svgr/webpack' ]
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/moasica.json',
        destination: '/api/internal/moasica'
      }
    ];
  }
};

export default nextConfig;
