// src/app/admin/newsletter/page.tsx
'use client'

import { useState } from 'react'
import '@mdxeditor/editor/style.css'

export default function NewsletterAdminPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const PUBLISH_ENDPOINT = process.env.NEXT_PUBLIC_PUBLISH_ENDPOINT || 'YOUR_PUBLISH_ENDPOINT'

  const handlePublish = async (testMode = false) => {
    setIsPublishing(true)
    setMessage(null)

    try {
      const response = await fetch(PUBLISH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          htmlContent: convertMarkdownToHtml(content),
          textContent: content,
          testMode,
          testEmail: testMode ? testEmail : undefined,
          apiKey
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: testMode 
            ? 'Test email sent successfully!' 
            : `Newsletter sent to ${data.stats.sent} subscribers!`
        })
        
        if (!testMode) {
          // Clear form after successful send
          setSubject('')
          setContent('')
        }
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to send newsletter'
        })
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Newsletter Publisher</h1>

        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          {/* API Key */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="This week in MLOps..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Newsletter Content</label>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 min-h-[400px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your newsletter content in Markdown..."
                className="w-full h-96 bg-transparent text-white resize-none focus:outline-none"
              />
            </div>
          </div>

          {/* Test Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Test Email</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handlePublish(true)}
              disabled={isPublishing || !subject || !content || !testEmail || !apiKey}
              className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {isPublishing ? 'Sending...' : 'Send Test'}
            </button>
            
            <button
              onClick={() => handlePublish(false)}
              disabled={isPublishing || !subject || !content || !apiKey}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPublishing ? 'Publishing...' : 'Publish Newsletter'}
            </button>
          </div>

          {/* Preview Section */}
          <details className="mt-8">
            <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
              Preview HTML
            </summary>
            <div className="mt-4 bg-gray-900 p-4 rounded-lg overflow-auto max-h-96">
              <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }} />
            </div>
          </details>
        </div>

        {/* Stats Dashboard */}
        <div className="mt-8 bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Newsletter Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">--</div>
              <div className="text-sm text-gray-400">Total Subscribers</div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">--</div>
              <div className="text-sm text-gray-400">Last Sent</div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">--</div>
              <div className="text-sm text-gray-400">Open Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
  // This is a basic implementation - consider using a proper markdown parser
  const html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    
  return `<p>${html}</p>`
}