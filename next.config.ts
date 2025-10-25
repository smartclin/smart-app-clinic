import path from 'node:path';

import initializeBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

// Initialize Bundle Analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

const nextConfig: NextConfig = {
    output: 'standalone',
    cacheComponents: true,

    // Image optimization settings
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost', port: '9000' },
            { hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'academy-public.coinmarketcap.com' },
            { protocol: 'http', hostname: '127.0.0.1', port: '3000', pathname: '/**' },
            { protocol: 'https', hostname: 'coin-images.coingecko.com' },
            { protocol: 'https', hostname: 'placehold.co' }
        ],
        unoptimized: process.env.NODE_ENV === 'development',
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },

    poweredByHeader: false, // Hide Next.js header for production

    reactStrictMode: true, // Enable strict mode for React

    typescript: {
        ignoreBuildErrors: true // Ignore TypeScript build errors
    },

    reactCompiler: true, // Enable React Compiler

    // Turbopack configuration
    turbopack: {
        root: path.join(__dirname, '..'),
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js'
            }
        },
        resolveAlias: {
            underscore: 'lodash' // Aliasing underscore to lodash
        },
        resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        debugIds: true // Enable debug IDs for easier debugging
    }
};

export default withBundleAnalyzer(nextConfig);
