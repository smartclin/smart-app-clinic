import initializeBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});
const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    images: {
        formats: ['image/avif', 'image/webp'],

        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000'
            },
            {
                hostname: 'images.unsplash.com'
            },
            { protocol: 'https', hostname: 'academy-public.coinmarketcap.com' },
            { protocol: 'http', hostname: '127.0.0.1', port: '3000', pathname: '/**' },
            { protocol: 'https', hostname: 'coin-images.coingecko.com' },
            { protocol: 'https', hostname: 'placehold.co' }
        ],
        unoptimized: process.env.NODE_ENV === 'development',
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },
    poweredByHeader: false,
    experimental: {
        turbopackFileSystemCacheForDev: true
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true
    },
    reactCompiler: true
};

export default withBundleAnalyzer(nextConfig);
