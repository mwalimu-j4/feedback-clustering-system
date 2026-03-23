import { action } from './_generated/server'
import { v } from 'convex/values'
import {
  buildPrioritiesPrompt,
  emptyPriorities,
  parsePrioritiesFromAIResponse,
} from './feedbackAiHelpers'
import { askAI } from './askAI'

export const prioritizeFeedbacks = action({
  args: {
    feedbacks: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    if (args.feedbacks.length === 0) {
      return emptyPriorities()
    }

    const prompt = buildPrioritiesPrompt(args.feedbacks)

    const aiResponse = await askAI(prompt)
    return parsePrioritiesFromAIResponse(aiResponse)
  },
})
