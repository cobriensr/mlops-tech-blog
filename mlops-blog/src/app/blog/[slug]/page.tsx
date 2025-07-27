// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: `${post.title} - Build MLOps`,
    description: post.excerpt,
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-sm text-gray-400 flex items-center gap-4">
          <time>{new Date(post.date).toLocaleDateString()}</time>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
        
        {post.tags.length > 0 && (
          <div className="mt-4 flex gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs bg-gray-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-invert max-w-none">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  )
}