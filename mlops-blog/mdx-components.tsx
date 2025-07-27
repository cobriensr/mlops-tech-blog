// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import { mdxComponents as components } from '@/components/mdx-components'

export function useMDXComponents(overrides: MDXComponents): MDXComponents {
  return {
    ...components,
    ...overrides,
  }
}