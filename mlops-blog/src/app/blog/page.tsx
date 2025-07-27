// src/app/blog/page.tsx
import { getAllPosts } from '@/lib/posts'
import BlogFilters from '@/components/blog-filters'

export default function BlogPage() {
  const posts = getAllPosts()
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Deep dives into MLOps, production ML systems, and engineering best practices.
          </p>
        </div>
      </div>

      {/* Filters and Search - Client Component */}
      <BlogFilters posts={posts} allTags={allTags} />
    </div>
  )
}