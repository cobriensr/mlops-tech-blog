// src/app/blog/page.tsx
import { getAllPosts } from '@/lib/posts'
import BlogFilters from '@/components/blog-filters'
import { Suspense } from 'react'

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

      {/* Filters and Search - Client Component wrapped in Suspense */}
      <Suspense fallback={<BlogFiltersSkeleton />}>
        <BlogFilters posts={posts} allTags={allTags} />
      </Suspense>
    </div>
  )
}

// Loading skeleton for filters
function BlogFiltersSkeleton() {
  return (
    <>
      {/* Filters skeleton */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 bg-gray-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-20 bg-gray-800 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Posts skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </>
  )
}