'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [tone, setTone] = useState(5)
  const [replies, setReplies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      return
    }

    setLoading(true)
    setReplies([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput, tone }),
      })

      const data = await response.json()

      if (response.ok) {
        setReplies(data.replies)
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Request failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">吵架包赢</h1>
          <p className="text-gray-600">智能生成强有力的回击话语</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              对方说了什么？
            </label>
            <Textarea
              placeholder="输入对方说的话..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              语气强烈程度：<span className="text-[#07c160] font-bold text-lg ml-2">{tone}</span>
            </label>
            <Slider
              value={tone}
              onValueChange={setTone}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>温和</span>
              <span>强烈</span>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !userInput.trim()}
            className="w-full text-lg font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                生成中...
              </>
            ) : (
              '开始吵架'
            )}
          </Button>
        </div>

        {replies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">回击方案：</h2>
            {replies.map((reply, index) => (
              <div
                key={index}
                className="bg-[#95ec69] rounded-lg rounded-tr-none p-4 shadow-sm max-w-[85%] ml-auto"
              >
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reply}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
