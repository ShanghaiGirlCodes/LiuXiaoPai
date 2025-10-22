import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = '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'

export async function POST(request: NextRequest) {
  try {
    const { userInput, tone } = await request.json()

    if (!userInput || typeof tone !== 'number') {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const toneDescription = tone <= 3 ? '冷静理性' : tone <= 6 ? '适度强势' : '极度强烈'

    const prompt = `你是一个专业的辩论助手，擅长用逻辑和智慧进行有力回击。

对方说：「${userInput}」

请根据以下要求生成3条回击语句：
- 语气强度：${tone}/10（${toneDescription}）
- 回击要有逻辑性和说服力
- 根据语气强度调整措辞的强烈程度
- 可以带一点幽默或讽刺，但不要过分粗俗
- 每条回击独立成段，不要编号

请直接输出3条回击语句，每条之间用空行分隔。`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: 'AI 服务暂时不可用' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: '未能生成回复' },
        { status: 500 }
      )
    }

    const replies = content
      .split('\n\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+[\.\、]\s*/, '').trim())
      .slice(0, 3)

    return NextResponse.json({ replies })
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
