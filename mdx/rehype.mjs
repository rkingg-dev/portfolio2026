import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import { remarkRehypeWrap } from 'remark-rehype-wrap'
import shiki from 'shiki'
import { visit } from 'unist-util-visit'

let highlighter

function rehypeShiki() {
  return async (tree) => {
    highlighter =
      highlighter ?? (await shiki.getHighlighter({ theme: 'css-variables' }))

    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      if (node.tagName === 'code' && parentNode.tagName === 'pre') {
        let language = node.properties.className?.[0]?.replace(/^language-/, '')

        if (!language) {
          return
        }

        let tokens = highlighter.codeToThemedTokens(
          node.children[0].value,
          language,
        )

        node.children = []
        node.properties.highlightedCode = shiki.renderToHtml(tokens, {
          elements: {
            pre: ({ children }) => children,
            code: ({ children }) => children,
            line: ({ children }) => `<span>${children}</span>`,
          },
        })
      }
    })
  }
}

function transformArticle(article) {
  article.children.splice(0, 1)
  let heading = article.children.find((n) => n.tagName === 'h2')
  article.properties = { ...heading.properties, title: toString(heading) }
  heading.properties = {}
  return article
}

async function runPlugin(tree, plugin, ...args) {
  let transform = plugin(...args)

  if (transform) {
    await transform(tree)
  }
}

export default function rehypePortfolio() {
  return async (tree) => {
    await runPlugin(tree, mdxAnnotations.rehype)
    await runPlugin(tree, rehypeSlug)
    await runPlugin(tree, rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: 'group',
      },
    })
    await runPlugin(tree, rehypeUnwrapImages)
    await runPlugin(tree, rehypeShiki)
    await runPlugin(tree, remarkRehypeWrap, {
      start: 'element[tagName=hr]',
      node: {
        type: 'element',
        tagName: 'article',
        properties: {},
        children: [],
      },
      transform: transformArticle,
    })
  }
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'wrap',
      properties: {
        className: 'group',
      },
    },
  ],
  rehypeUnwrapImages,
  rehypeShiki,
  [
    remarkRehypeWrap,
    {
      start: 'element[tagName=hr]',
      node: {
        type: 'element',
        tagName: 'article',
        properties: {},
        children: [],
      },
      transform: transformArticle,
    },
  ],
]
