
const createNextIntlPlugin = require('next-intl/plugin');


const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/:path*`,
            },
        ];
    },
    async headers() {
        return [
            {
                // Only apply COOP/COEP on pages that need SharedArrayBuffer (ffmpeg.wasm)
                source: '/(audio-converter|video-to-audio)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp',
                    },
                ],
            },
        ];
    },
};

module.exports = withNextIntl(nextConfig);
