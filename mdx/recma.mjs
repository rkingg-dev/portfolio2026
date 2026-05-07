import { mdxAnnotations } from 'mdx-annotations'
import { recmaImportImages } from 'recma-import-images'

export default function recmaPortfolio() {
  return (tree) => {
    recmaImportImages()(tree)
    mdxAnnotations.recma()(tree)
  }
}

export const recmaPlugins = [recmaImportImages, mdxAnnotations.recma]
