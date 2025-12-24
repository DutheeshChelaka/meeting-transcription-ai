'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8000/')
      setMessage(JSON.stringify(response.data, null, 2))
    } catch (error) {
      setMessage('Error: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          🎙️ Meeting Transcription AI
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Testing Frontend ↔️ Backend Connection
        </p>

        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>

        {message && (
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <h2 className="font-semibold mb-2 text-gray-700">Response from Backend:</h2>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {message}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}