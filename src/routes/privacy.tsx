import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="mt-3 text-muted-foreground">
        Add your Privacy Policy content here.
      </p>
    </main>
  )
}
