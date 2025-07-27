// next.config.ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Strict mode for better development experience
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: true,
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)