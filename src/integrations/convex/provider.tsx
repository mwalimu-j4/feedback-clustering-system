import { env } from '@/env'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convexClient = new ConvexReactClient(env.VITE_CONVEX_URL)

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  )
}
