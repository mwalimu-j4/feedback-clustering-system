import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/convex')({
  component: DemoConvexPage,
})

function DemoConvexPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Convex Demo</h1>
      <p className="mt-3 text-muted-foreground">
        This route exists for navigation and can be expanded with Convex
        examples.
      </p>
    </main>
  )
}
