export type Category = 'critical' | 'medium' | 'low'

export type PrioritizedFeedback = {
  critical: string[]
  medium: string[]
  low: string[]
}

export function emptyPriorities(): PrioritizedFeedback {
  return {
    critical: [],
    medium: [],
    low: [],
  }
}

function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenced?.[1]) {
    return fenced[1].trim()
  }

  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1)
  }

  return text.trim()
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((item): item is string => typeof item === 'string')
}

function toCategory(value: unknown): Category | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (
    normalized === 'critical' ||
    normalized === 'medium' ||
    normalized === 'low'
  ) {
    return normalized
  }

  return null
}

export function buildPrioritiesPrompt(feedbacks: string[]): string {
  return [
    'Classify each feedback item into one priority bucket: critical, medium, or low.',
    'Return ONLY valid JSON with exactly this shape:',
    '{"critical": string[], "medium": string[], "low": string[]}',
    'Do not add markdown or explanation.',
    '',
    'Feedback items:',
    ...feedbacks.map((feedback, index) => `${index + 1}. ${feedback}`),
  ].join('\n')
}

export function buildCategoryPrompt(feedback: string): string {
  return [
    'Classify this feedback into one category: critical, medium, or low.',
    'Return ONLY valid JSON with exactly this shape:',
    '{"category": "critical" | "medium" | "low"}',
    'Do not add markdown or explanation.',
    '',
    `Feedback: ${feedback}`,
  ].join('\n')
}

export function parsePrioritiesFromAIResponse(
  aiResponse: string,
): PrioritizedFeedback {
  const jsonCandidate = extractJsonObject(aiResponse)

  try {
    const parsed = JSON.parse(jsonCandidate)
    if (!parsed || typeof parsed !== 'object') {
      return emptyPriorities()
    }

    const source = parsed as Record<string, unknown>
    return {
      critical: toStringArray(source.critical),
      medium: toStringArray(source.medium),
      low: toStringArray(source.low),
    }
  } catch {
    return emptyPriorities()
  }
}

export function parseCategoryFromAIResponse(aiResponse: string): Category {
  const jsonCandidate = extractJsonObject(aiResponse)

  try {
    const parsed = JSON.parse(jsonCandidate)
    if (parsed && typeof parsed === 'object') {
      const fromObject = toCategory(
        (parsed as Record<string, unknown>).category,
      )
      if (fromObject) {
        return fromObject
      }
    }
  } catch {
    // Fall through to plain-text parsing.
  }

  const plain = toCategory(aiResponse)
  if (plain) {
    return plain
  }

  const lowered = aiResponse.toLowerCase()
  if (lowered.includes('critical')) {
    return 'critical'
  }
  if (lowered.includes('medium')) {
    return 'medium'
  }
  if (lowered.includes('low')) {
    return 'low'
  }

  return 'medium'
}
