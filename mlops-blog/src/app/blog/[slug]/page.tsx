// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'

// Helper function to handle params
async function getSlug(params: { slug: string } | Promise<{ slug: string }>): Promise<string> {
  const resolvedParams = 'slug' in params ? params : await params
  return resolvedParams.slug
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params
}: {
  params: { slug: string } | Promise<{ slug: string }>
}) {
  const slug = await getSlug(params)
  const post = getPostBySlug(slug)

  if (!post) return {}

  return {
    title: `${post.title} - Build MLOps`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Build MLOps Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPost({
  params
}: {
  params: { slug: string } | Promise<{ slug: string }>
}) {
  const slug = await getSlug(params)
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Get related posts (same tags)
  const allPosts = getAllPosts()
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3)

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Post Header */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-in">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <div className="text-white font-medium">Admin</div>
                <time>{new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</time>
              </div>
            </div>
            <span className="text-gray-600">•</span>
            <span>{post.readingTime}</span>
            <span className="text-gray-600">•</span>
            <span>{post.content.split(' ').length} words</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  <a href="#introduction" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    Introduction
                  </a>
                  <a href="#main-content" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    Main Content
                  </a>
                  <a href="#conclusion" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    Conclusion
                  </a>
                </nav>
              </div>

              {/* Share */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">
                  Share Article
                </h3>
                <div className="flex gap-3">
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.5 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 5.5v5h-3v-5c0-1.5-1-2-1.5-2S11 11 11 12.5v4.5H8V10h2.5v1.5h.1c.4-.8 1.1-1.5 2.4-1.5 2 0 3.5 1.5 3.5 4z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="prose prose-lg max-w-none">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            {/* Author Box */}
            <div className="mt-12 p-6 bg-gray-900 rounded-xl border border-gray-800">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  A
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Written by Admin</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Technical writer passionate about MLOps, production ML systems, and helping teams build better ML infrastructure.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                      Twitter
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                      GitHub
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-8 p-8 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-2">Enjoyed this article?</h3>
              <p className="text-gray-400 mb-4">
                Get more insights on MLOps and production ML delivered to your inbox.
              </p>
              <form className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-900/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <article className="h-full bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all card-hover">
                    <time className="text-sm text-gray-500">
                      {new Date(relatedPost.date).toLocaleDateString()}
                    </time>
                    <h3 className="text-lg font-semibold mt-2 mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}