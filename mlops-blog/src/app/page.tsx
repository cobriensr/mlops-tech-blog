// src/app/page.tsx
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-4">Build MLOps</h1>
        <p className="text-xl text-gray-400 mb-8">
          Production Machine Learning Engineering
        </p>
        
        <div className="mb-12">
          <Link 
            href="/blog" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded inline-block transition"
          >
            View All Posts
          </Link>
        </div>

        {recentPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-semibold mb-6">Recent Posts</h2>
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <article key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-semibold hover:text-blue-500 transition">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-400 mt-2">{post.excerpt}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}