import { action } from './_generated/server'
import { v } from 'convex/values'
import {
  buildCategoryPrompt,
  parseCategoryFromAIResponse,
} from './feedbackAiHelpers'
import type { Category } from './feedbackAiHelpers'
import { askAI } from './askAI'

export const categorizeFeedback = action({
  args: {
    feedback: v.string(),
  },
  handler: async (_ctx, args): Promise<Category> => {
    const prompt = buildCategoryPrompt(args.feedback)
    const aiResponse = await askAI(prompt)
    return parseCategoryFromAIResponse(aiResponse)
  },
})
