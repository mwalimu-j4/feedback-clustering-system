import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SITE_URL: z.string().url(),
    GROQ_API_KEY: z.string().min(1),
    GROQ_MODEL: z.string().default('llama-3.1-8b-instant'),
  },

  /**
   * Convex uses process.env for environment variables.
   * Set these via: npx convex env set VARIABLE_NAME "value"
   */
  runtimeEnv: process.env,

  /**
   * Treat empty strings as undefined for proper default value handling.
   */
  emptyStringAsUndefined: true,
})
