import { env } from './env'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function askAI(aprompt: string): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a strict JSON-only assistant. Return only valid JSON with no markdown or prose.',
        },
        {
          role: 'user',
          content: aprompt,
        },
      ],
      temperature: 0,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Groq request failed (${response.status} ${response.statusText}): ${errorText}`,
    )
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Groq response did not include message content')
  }

  return content
}
