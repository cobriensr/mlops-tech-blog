// src/app/resources/page.tsx

export default function ResourcesPage() {
  const resources = {
    tools: [
      {
        name: 'Kubeflow',
        description: 'End-to-end ML platform for Kubernetes',
        url: 'https://www.kubeflow.org/',
        category: 'Platform'
      },
      {
        name: 'MLflow',
        description: 'Open source platform for ML lifecycle',
        url: 'https://mlflow.org/',
        category: 'Experiment Tracking'
      },
      {
        name: 'DVC',
        description: 'Data version control for ML projects',
        url: 'https://dvc.org/',
        category: 'Data Versioning'
      },
      {
        name: 'Great Expectations',
        description: 'Data validation and documentation',
        url: 'https://greatexpectations.io/',
        category: 'Data Quality'
      },
      {
        name: 'Evidently AI',
        description: 'ML monitoring and testing',
        url: 'https://evidentlyai.com/',
        category: 'Monitoring'
      },
      {
        name: 'Feast',
        description: 'Open source feature store',
        url: 'https://feast.dev/',
        category: 'Feature Store'
      }
    ],
    books: [
      {
        title: 'Designing Machine Learning Systems',
        author: 'Chip Huyen',
        description: 'Comprehensive guide to ML system design',
        link: '#'
      },
      {
        title: 'Machine Learning Engineering',
        author: 'Andriy Burkov',
        description: 'Practical approach to ML in production',
        link: '#'
      },
      {
        title: 'Building Machine Learning Powered Applications',
        author: 'Emmanuel Ameisen',
        description: 'From idea to production deployment',
        link: '#'
      }
    ],
    courses: [
      {
        name: 'MLOps Specialization',
        provider: 'Coursera',
        description: 'Complete MLOps workflow and best practices',
        link: '#'
      },
      {
        name: 'Full Stack Deep Learning',
        provider: 'FSDL',
        description: 'Building and deploying ML applications',
        link: '#'
      },
      {
        name: 'Made With ML',
        provider: 'Goku Mohandas',
        description: 'Hands-on MLOps with modern tools',
        link: '#'
      }
    ]
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">MLOps Resources</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Curated collection of tools, books, courses, and materials to accelerate your MLOps journey
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Essential MLOps Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="h-full bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-3">{tool.description}</p>
                  <span className="text-sm text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                    {tool.category}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Recommended Books</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.books.map((book) => (
              <div
                key={book.title}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                <p className="text-blue-400 text-sm mb-3">by {book.author}</p>
                <p className="text-gray-400">{book.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Online Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.courses.map((course) => (
              <div
                key={course.name}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-blue-400 text-sm mb-3">{course.provider}</p>
                <p className="text-gray-400">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">More Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Community & Forums
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-blue-400 hover:text-blue-300">MLOps Community Slack</a></li>
                <li><a href="#" className="text-blue-400 hover:text-blue-300">r/MachineLearning</a></li>
                <li><a href="#" className="text-blue-400 hover:text-blue-300">ML Twitter Community</a></li>
                <li><a href="#" className="text-blue-400 hover:text-blue-300">LinkedIn MLOps Groups</a></li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Documentation & Guides
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-blue-400 hover:text-blue-300">Google MLOps Whitepaper</a></li>
                <li><a href="#" className="text-blue-400 hover:text-blue-300">AWS ML Best Practices</a></li>
                <li><a href="#" className="text-blue-400 hover:text-blue-300">Microsoft MLOps Guide</a></li>
                <li><a href="#" className="text-blue-400 hover:text-blue-300">MLOps Maturity Model</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold mb-4">Have a Resource to Share?</h2>
            <p className="text-gray-300 mb-6">
              Know of a great MLOps tool, book, or course that should be on this list? 
              Let us know and we will review it for inclusion.
            </p>
            <a
              href="mailto:resources@buildmlops.com"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit a Resource
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}