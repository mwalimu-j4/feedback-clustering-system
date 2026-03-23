import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="mt-3 text-muted-foreground">
        Add your Terms of Service content here.
      </p>
    </main>
  )
}
