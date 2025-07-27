// src/components/mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'

// Custom components for MDX
const Note = ({ children, type = 'info' }: { children: React.ReactNode, type?: 'info' | 'warning' | 'tip' }) => {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    tip: 'bg-green-500/10 border-green-500/20 text-green-400',
  }

  const icons = {
    info: '💡',
    warning: '⚠️',
    tip: '✅',
  }

  return (
    <div className={`my-6 p-4 rounded-lg border ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  )
}

// Export the components directly, not as a hook
export const mdxComponents: MDXComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} className="text-4xl font-bold mt-12 mb-6 scroll-mt-20">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} className="text-3xl font-bold mt-10 mb-4 scroll-mt-20">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} className="text-2xl font-semibold mt-8 mb-3 scroll-mt-20">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} className="text-xl font-semibold mt-6 mb-2 scroll-mt-20">
      {children}
    </h4>
  ),

  // Paragraphs and text
  p: ({ children }) => (
    <p className="mb-6 leading-relaxed text-gray-300">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic">
      {children}
    </em>
  ),

  // Links
  a: ({ href, children }) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#')
    
    if (isInternal) {
      return (
        <Link
          href={href || '#'}
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
        >
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
      >
        {children}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    )
  },

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-300">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="ml-4">
      {children}
    </li>
  ),

  // Code
  code: ({ children }) => {
    // Check if it's inline code by looking at the parent
    const isInline = typeof children === 'string' && !children.includes('\n')
    
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 bg-gray-800 text-blue-300 rounded text-sm font-mono">
          {children}
        </code>
      )
    }

    return (
      <code className="font-mono text-sm">
        {children}
      </code>
    )
  },
  pre: ({ children }) => {
    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
      const pre = e.currentTarget.parentElement?.querySelector('pre');
      if (pre?.textContent) {
        navigator.clipboard.writeText(pre.textContent);
      }
    };

    return (
      <div className="relative group mb-6">
        <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-gray-300">
          {children}
        </pre>
        <button
          className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          Copy
        </button>
      </div>
    );
  },

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-gray-400">
      {children}
    </blockquote>
  ),

  // Tables
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-800">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-800">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-gray-900/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
      {children}
    </td>
  ),

  // Horizontal rule
  hr: () => (
    <hr className="my-8 border-gray-800" />
  ),

  img: ({ src = '', alt = '', width, height }) => (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 450}
        className="rounded-lg border border-gray-800 w-full"
        style={{ objectFit: 'contain' }}
      />
      {alt && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  // Custom components
  Note,
}