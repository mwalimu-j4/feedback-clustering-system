import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT:z.string(),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_CONVEX_URL: z.url(),
    VITE_SITE_URL: z.url(),
    VITE_CONVEX_SITE_URL: z.url(),
  },

  runtimeEnv: import.meta.env,

  emptyStringAsUndefined: true,
})
