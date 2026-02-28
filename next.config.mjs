import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import remarkGfm from 'remark-gfm';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkGfm],
    },
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mermaid.ink',
            },
        ],
    },
};

export default withNextIntl(withMDX(nextConfig));