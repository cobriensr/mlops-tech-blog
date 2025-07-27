// src/components/blog-filters.tsx
'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Post } from '@/lib/posts'

interface BlogFiltersProps {
  posts: Post[]
  allTags: string[]
}

export default function BlogFilters({ posts, allTags }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || null
    setSearchQuery(search)
    setSelectedTag(tag)
  }, [searchParams])

  // Update URL when filters change
  const updateURL = (search: string, tag: string | null) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (tag) params.set('tag', tag)
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateURL(value, selectedTag)
  }

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag)
    updateURL(searchQuery, tag)
  }

  // Filter posts based on search and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTag = !selectedTag || post.tags.includes(selectedTag)
      
      return matchesSearch && matchesTag
    })
  }, [posts, searchQuery, selectedTag])

  return (
    <>
      {/* Filters and Search */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <span className="text-sm text-gray-400 whitespace-nowrap">Filter by:</span>
              <button
                onClick={() => handleTagChange(null)}
                className={`px-3 py-1 text-sm rounded-full transition-all whitespace-nowrap ${
                  !selectedTag
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All Posts
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-all whitespace-nowrap ${
                    tag === selectedTag
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-400 text-lg">
              {searchQuery || selectedTag
                ? 'No posts found matching your criteria.'
                : 'No posts yet. Check back soon!'}
            </p>
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag(null)
                  updateURL('', null)
                }}
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-400">
                Showing {filteredPosts.length} of {posts.length} posts
              </p>
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedTag(null)
                    updateURL('', null)
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.slug}
                  className="group animate-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 card-hover">
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <time className="text-sm text-gray-500">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                          <span className="text-sm text-gray-500">{post.readingTime}</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span key={tag} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-blue-400 group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-1">
                            Read more
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* Gradient accent */}
                      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination (placeholder for future implementation) */}
            {posts.length > 10 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors">
                    Previous
                  </button>
                  <span className="px-4 py-1 text-gray-400">Page 1 of 1</span>
                  <button className="px-3 py-1 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}