'use client'
import { useState } from 'react'
import { generateDraft } from '../new-post/actions'

export default function TestOpenAI() {
  const [keywords, setKeywords] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const draft = await generateDraft(keywords)
      setResult(draft)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAI Integration Test</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="keywords" className="block mb-1">Keywords:</label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter comma-separated keywords"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Draft'}
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Result:</h2>
        <textarea
          readOnly
          value={result}
          className="w-full h-64 p-2 border rounded"
        />
      </div>
    </div>
  )
}