import { recmaPlugins } from './mdx/recma.mjs'
import { rehypePlugins } from './mdx/rehype.mjs'
import { remarkPlugins } from './mdx/remark.mjs'

export const compile = {
  remarkPlugins,
  rehypePlugins,
  recmaPlugins,
}
