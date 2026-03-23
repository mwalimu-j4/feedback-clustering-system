import { mutation } from './_generated/server'
import { v } from 'convex/values'
import {
  buildCategoryPrompt,
  Category,
  parseCategoryFromAIResponse,
} from './feedbackAiHelpers'
import { askAI } from './askAI'

export const categorizeFeedback = mutation({
  args: {
    feedback: v.string(),
  },
  handler: async (_ctx, args): Promise<Category> => {
    const prompt = buildCategoryPrompt(args.feedback)
    const aiResponse = await Promise.resolve(askAI(prompt))
    return parseCategoryFromAIResponse(aiResponse)
  },
})
