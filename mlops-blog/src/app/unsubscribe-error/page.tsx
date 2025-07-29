// src/app/unsubscribe-error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function UnsubscribeErrorPage() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  const errorMessages: Record<string, { title: string; message: string }> = {
    invalid: {
      title: 'Invalid unsubscribe link',
      message: 'The unsubscribe link is invalid or has expired. This can happen if the link was modified or is very old.'
    },
    notfound: {
      title: 'Email not found',
      message: "We couldn't find this email address in our records. You may have already unsubscribed or used a different email."
    },
    error: {
      title: 'Something went wrong',
      message: 'An error occurred while processing your unsubscribe request. Please try again or contact support.'
    }
  }

  const errorInfo = errorMessages[reason || 'error'] || errorMessages.error

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center animate-in">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 animate-in">
          {errorInfo.title}
        </h1>
        
        <p className="text-lg text-gray-300 mb-8 animate-in" style={{ animationDelay: '0.1s' }}>
          {errorInfo.message}
        </p>

        {/* Help Section */}
        <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 mb-8 border border-gray-800 animate-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold mb-3">Need help?</h2>
          <p className="text-sm text-gray-400 mb-4">
            If you are trying to unsubscribe and continue to have issues, please contact us directly.
          </p>
          <a
            href="mailto:support@buildmlops.com"
            className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-all"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
        </div>

        {/* Alternative Actions */}
        <div className="space-y-4 animate-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-gray-500">Or you can:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Homepage
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Read Blog
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-gray-600 animate-in" style={{ animationDelay: '0.4s' }}>
          Error code: {reason || 'unknown'}
        </p>
      </div>
    </div>
  )
}