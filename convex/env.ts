import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Server-side environment variables for Convex functions.
 * 
 * Usage in Convex functions:
 * ```ts
 * import { env } from "./env";
 * 
 * export const myQuery = query({
 *   handler: async (ctx) => {
 *     const apiKey = env.GOOGLE_CLIENT_ID;
 *     // ...
 *   }
 * });
 * ```
 */
export const env = createEnv({
  server: {
    SITE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
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
});
