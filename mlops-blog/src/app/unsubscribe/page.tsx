// src/app/unsubscribe/page.tsx
'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const reasons = [
  'Too many emails',
  'Content not relevant',
  'No longer interested', 
  'Email looks like spam',
  'Other'
];

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleUnsubscribe = async (skipFeedback = false) => {
    if (!email || !token) {
      setError('Invalid unsubscribe link')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('https://7ygb1encfc.execute-api.us-east-1.amazonaws.com/prod/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decodeURIComponent(email),
          token,
          reason: skipFeedback ? undefined : reason,
          feedback: skipFeedback ? undefined : feedback.trim()
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        router.push(`/unsubscribe-success?email=${email}`)
      } else {
        setError(data.error || 'Failed to unsubscribe')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleUnsubscribe(false)
  }

  if (!email || !token) {
    router.push('/unsubscribe-error?reason=invalid')
    return null
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
      
      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 animate-in">
            Unsubscribe from Build MLOps
          </h1>
          <p className="text-lg text-gray-300 animate-in" style={{ animationDelay: '0.1s' }}>
            We are sorry to see you go!
          </p>
          <p className="text-sm text-gray-500 mt-2 animate-in" style={{ animationDelay: '0.2s' }}>
            {decodeURIComponent(email)}
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-800 animate-in" style={{ animationDelay: '0.3s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Would you mind telling us why? (Optional)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a reason...</option>
                {reasons.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Please tell us more
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Your feedback helps us improve..."
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Processing...' : 'Unsubscribe'}
              </button>
              
              <button
                type="button"
                onClick={() => handleUnsubscribe(true)}
                disabled={submitting}
                className="w-full text-gray-400 text-sm hover:text-gray-300 transition disabled:opacity-50"
              >
                Skip and unsubscribe
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Link */}
        <div className="text-center mt-6 animate-in" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Never mind, keep me subscribed
          </Link>
        </div>
      </div>
    </div>
  )
}