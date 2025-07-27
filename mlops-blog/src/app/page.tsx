// src/app/page.tsx
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3)
  const featuredPost = recentPosts[0] // Assuming first post is featured

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8 animate-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm text-blue-400">New posts every week</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Master <span className="gradient-text inline-block">Production MLOps</span>
              <br />
              Engineering
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-300 leading-relaxed">
              Learn to build, deploy, and scale machine learning systems in production. 
              From MLOps fundamentals to advanced LLMOps practices.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-all hover:scale-105"
              >
                Start Learning
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/newsletter"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
              >
                Join Newsletter
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="pt-8 grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10k+</div>
                <div className="text-sm text-gray-400">Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-gray-400">Examples</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="py-16 bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Post</h2>
              <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors">
                View all →
              </Link>
            </div>
            
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 hover:shadow-2xl transition-all duration-300 card-hover gradient-border">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                      Featured
                    </span>
                    <time className="text-sm text-gray-400">
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </time>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-400 line-clamp-2 mb-4">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {featuredPost.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{featuredPost.readingTime}</span>
                  </div>
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-transparent" />
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      {recentPosts.length > 1 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Recent Posts</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(1).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <article className="h-full bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 card-hover">
                    <div className="flex flex-col h-full">
                      <time className="text-sm text-gray-500 mb-3">
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </time>
                      
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-400 line-clamp-3 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-gray-500">{post.readingTime}</span>
                        <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Topics Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Topics</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'MLOps Fundamentals', icon: '🚀', count: 15 },
              { name: 'Model Deployment', icon: '📦', count: 12 },
              { name: 'Monitoring & Observability', icon: '📊', count: 8 },
              { name: 'LLMOps', icon: '🤖', count: 10 },
              { name: 'Infrastructure', icon: '🏗️', count: 7 },
              { name: 'Data Pipelines', icon: '🔄', count: 9 },
              { name: 'Testing & Validation', icon: '✅', count: 6 },
              { name: 'Best Practices', icon: '💡', count: 11 },
            ].map((topic) => (
              <Link
                key={topic.name}
                href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <span className="font-medium group-hover:text-blue-400 transition-colors">
                    {topic.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{topic.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay ahead in MLOps
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get weekly insights on production ML engineering delivered to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}