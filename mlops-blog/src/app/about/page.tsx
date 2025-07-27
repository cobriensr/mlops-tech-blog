// src/app/about/page.tsx
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Build MLOps</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Bridging the gap between machine learning research and production systems
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Mission Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Build MLOps is dedicated to helping data scientists, ML engineers, and DevOps professionals 
                master the art and science of deploying machine learning systems in production. We believe 
                that the gap between developing ML models and deploying them reliably at scale is one of 
                the biggest challenges facing the industry today.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Through in-depth tutorials, real-world case studies, and practical guides, we aim to 
                democratize MLOps knowledge and empower teams to build robust, scalable, and maintainable 
                ML systems.
              </p>
            </div>

            {/* About the Author */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">About the Author</h2>
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                      CO
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2 text-white">Charles OBrien</h3>
                    <p className="text-blue-400 mb-4">Senior ML Engineer & Technical Writer</p>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      With over a decade of experience in software engineering and machine learning, 
                      I have worked on ML systems at scale across various industries including finance, 
                      healthcare, and technology. My passion lies in making complex ML concepts 
                      accessible and helping teams avoid the pitfalls I have encountered along the way.
                    </p>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      I specialize in building end-to-end ML platforms, implementing robust CI/CD 
                      pipelines for ML, and designing monitoring systems that catch model drift 
                      before it impacts users. When I am not writing about MLOps, I am contributing 
                      to open-source projects or speaking at conferences about production ML.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href="https://charlesobriensr.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Portfolio
                      </a>
                      <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                      <a 
                        href="https://linkedin.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">What You Will Find Here</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">In-Depth Tutorials</h3>
                  <p className="text-gray-400">
                    Step-by-step guides covering everything from basic MLOps concepts to advanced 
                    deployment strategies, with real code examples and best practices.
                  </p>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Case Studies</h3>
                  <p className="text-gray-400">
                    Real-world examples of MLOps implementations, including challenges faced, 
                    solutions implemented, and lessons learned.
                  </p>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Best Practices</h3>
                  <p className="text-gray-400">
                    Industry-proven patterns and practices for building reliable, scalable, and 
                    maintainable ML systems in production.
                  </p>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Tool Reviews</h3>
                  <p className="text-gray-400">
                    Honest evaluations of MLOps tools and platforms, helping you choose the right 
                    stack for your needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">Technologies We Cover</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  'Kubernetes', 'Docker', 'Kubeflow', 'MLflow', 'TensorFlow', 'PyTorch',
                  'Apache Airflow', 'Apache Spark', 'Kafka', 'Prometheus', 'Grafana',
                  'GitOps', 'AWS SageMaker', 'Azure ML', 'Google Vertex AI', 'DVC',
                  'Feast', 'Great Expectations', 'Evidently AI', 'Seldon Core'
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20 text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Ready to Master MLOps?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of ML practitioners who are learning to build production-ready 
                ML systems. Get weekly insights delivered to your inbox.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/blog/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Start Reading
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/newsletter/"
                  className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Subscribe to Newsletter
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}