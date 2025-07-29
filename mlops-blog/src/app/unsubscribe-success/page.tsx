// src/app/unsubscribe-success/page.tsx
'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function UnsubscribeSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [resubscribing, setResubscribing] = useState(false)
  const [resubscribed, setResubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleResubscribe = async () => {
    if (!email) return
    
    setResubscribing(true)
    setError('')
    
    try {
      const response = await fetch('https://7ygb1encfc.execute-api.us-east-1.amazonaws.com/prod/api/resubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decodeURIComponent(email),
          confirmResubscribe: true
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResubscribed(true)
      } else {
        setError(data.error || 'Failed to resubscribe')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setResubscribing(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center animate-in">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 animate-in">
          You have been unsubscribed
        </h1>
        
        <p className="text-lg text-gray-300 mb-6 animate-in" style={{ animationDelay: '0.1s' }}>
          We are sorry to see you go! You have been successfully removed from our mailing list.
        </p>
        
        {email && (
          <p className="text-sm text-gray-500 mb-8 animate-in" style={{ animationDelay: '0.2s' }}>
            Email: {decodeURIComponent(email)}
          </p>
        )}

        {/* Resubscribe Section */}
        {!resubscribed ? (
          <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 mb-8 border border-gray-800 animate-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-lg font-semibold mb-3">Changed your mind?</h2>
            <p className="text-sm text-gray-400 mb-4">
              You can resubscribe anytime to continue receiving our MLOps insights.
            </p>
            <button
              onClick={handleResubscribe}
              disabled={resubscribing || !email}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {resubscribing ? 'Processing...' : 'Resubscribe'}
            </button>
            {error && (
              <p className="text-red-400 text-sm mt-3">{error}</p>
            )}
          </div>
        ) : (
          <div className="bg-green-900/20 backdrop-blur rounded-xl p-6 mb-8 border border-green-800/50 animate-in">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-semibold text-green-400">Welcome back!</h2>
            </div>
            <p className="text-sm text-gray-300">
              You have been resubscribed to our newsletter.
            </p>
          </div>
        )}

        {/* Home Link */}
        <div className="animate-in" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/"
            className="inline-flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to homepage
          </Link>
        </div>

        {/* Footer text */}
        <p className="mt-12 text-xs text-gray-600 animate-in" style={{ animationDelay: '0.5s' }}>
          We value your feedback. If you have a moment, we would love to know why you unsubscribed.
        </p>
      </div>
    </div>
  )
}