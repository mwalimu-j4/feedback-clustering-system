import { env } from '@/env';
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";

const convexClient = new ConvexReactClient(env.VITE_CONVEX_URL);

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexBetterAuthProvider client={convexClient} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}






