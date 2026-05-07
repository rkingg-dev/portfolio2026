import nextMDX from '@next/mdx'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const mdxPlugin = (file) => join(rootDir, 'mdx', file)

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [mdxPlugin('remark.mjs')],
    rehypePlugins: [mdxPlugin('rehype.mjs')],
    recmaPlugins: [mdxPlugin('recma.mjs')],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
}

export default withMDX(nextConfig)
