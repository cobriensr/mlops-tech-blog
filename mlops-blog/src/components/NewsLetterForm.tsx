// src/components/NewsletterForm.tsx
'use client'

import { useState } from 'react'

interface NewsletterFormProps {
  variant?: 'default' | 'inline' | 'hero'
  showName?: boolean
}

export default function NewsletterForm({ variant = 'default', showName = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const SUBSCRIBE_ENDPOINT = process.env.NEXT_PUBLIC_SUBSCRIBE_ENDPOINT

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return

    if (!SUBSCRIBE_ENDPOINT) {
      setStatus('error')
      setMessage('Subscription endpoint is not configured.')
      return
    }
    
    setStatus('loading')
    setMessage('')
    
    try {
      const response = await fetch(SUBSCRIBE_ENDPOINT as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name: name || undefined })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setStatus('success')
        setMessage(data.message || 'Please check your email to confirm your subscription.')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('An error occurred. Please try again later.')
    }
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading'}
          className="flex-1 px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    )
  }

  return (
    <div className="w-full">
      {status === 'success' ? (
        <div className="bg-green-900/20 backdrop-blur rounded-xl p-6 border border-green-800/50 text-center animate-in">
          <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-green-400 mb-2">Almost there!</h3>
          <p className="text-sm text-gray-300">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {showName && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              disabled={status === 'loading'}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
          {status === 'error' && (
            <p className="text-red-400 text-sm text-center animate-in">{message}</p>
          )}
        </form>
      )}
    </div>
  )
}