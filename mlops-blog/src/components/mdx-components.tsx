// src/components/mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

// Export the components directly, not as a hook
export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }) => (
    <Link 
      href={href || '#'} 
      className="text-blue-500 hover:text-blue-600 underline"
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
  ),
  code: ({ children }) => (
    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-600 pl-4 italic mb-4">
      {children}
    </blockquote>
  ),
}
