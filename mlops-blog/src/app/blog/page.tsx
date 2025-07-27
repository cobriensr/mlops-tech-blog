// src/app/blog/page.tsx
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-800 pb-8">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue-500 transition">
                  {post.title}
                </h2>
              </Link>
              
              <div className="text-sm text-gray-400 mt-2 flex items-center gap-4">
                <time>{new Date(post.date).toLocaleDateString()}</time>
                <span>•</span>
                <span>{post.readingTime}</span>
              </div>
              
              <p className="mt-4 text-gray-300">{post.excerpt}</p>
              
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
              
              <Link 
                href={`/blog/${post.slug}`}
                className="text-blue-500 hover:text-blue-600 mt-4 inline-block"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}