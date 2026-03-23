import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useAction } from 'convex/react'
import type { FunctionReference } from 'convex/server'
import { Button } from '@/components/ui/button'
import { LoadingSwap } from '@/components/ui/loading-swap'

export const Route = createFileRoute('/')({
  component: App,
})

type Category = 'critical' | 'medium' | 'low'

type PrioritizedFeedback = {
  critical: string[]
  medium: string[]
  low: string[]
}

const categorizeFeedbackRef =
  'doCategorize:categorizeFeedback' as unknown as FunctionReference<
    'action',
    'public',
    { feedback: string },
    Category
  >

const prioritizeFeedbacksRef =
  'doCluster:prioritizeFeedbacks' as unknown as FunctionReference<
    'action',
    'public',
    { feedbacks: string[] },
    PrioritizedFeedback
  >

function App() {
  const [mode, setMode] = useState<'categorize' | 'cluster'>('categorize')
  const [singleFeedback, setSingleFeedback] = useState('')
  const [multiFeedbacks, setMultiFeedbacks] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [categoryResult, setCategoryResult] = useState<Category | null>(null)
  const [clusterResult, setClusterResult] =
    useState<PrioritizedFeedback | null>(null)

  const categorizeFeedback = useAction(categorizeFeedbackRef)
  const prioritizeFeedbacks = useAction(prioritizeFeedbacksRef)

  const hasClusterInput = useMemo(
    () => multiFeedbacks.some((item) => item.trim().length > 0),
    [multiFeedbacks],
  )

  const resetResults = () => {
    setErrorMessage(null)
    setCategoryResult(null)
    setClusterResult(null)
  }

  const onModeSwitch = (nextMode: 'categorize' | 'cluster') => {
    setMode(nextMode)
    resetResults()
  }

  const onAddFeedback = () => {
    setMultiFeedbacks((prev) => [...prev, ''])
  }

  const onUpdateFeedback = (index: number, value: string) => {
    setMultiFeedbacks((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const onRemoveFeedback = (index: number) => {
    setMultiFeedbacks((prev) => {
      if (prev.length <= 1) {
        return ['']
      }
      return prev.filter((_, currentIndex) => currentIndex !== index)
    })
  }

  const onSubmitCategorize = async () => {
    const feedback = singleFeedback.trim()
    if (!feedback) {
      setErrorMessage('Enter one feedback message before categorizing.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setClusterResult(null)

    try {
      const result = await categorizeFeedback({ feedback })
      setCategoryResult(result)
    } catch (error) {
      setCategoryResult(null)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to categorize feedback.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitCluster = async () => {
    const feedbacks = multiFeedbacks
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    if (feedbacks.length === 0) {
      setErrorMessage('Add at least one feedback item before clustering.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setCategoryResult(null)

    try {
      const result = await prioritizeFeedbacks({ feedbacks })
      setClusterResult(result)
    } catch (error) {
      setClusterResult(null)
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to cluster feedback.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryStyles: Record<Category, string> = {
    critical: 'bg-rose-100 text-rose-800 border border-rose-300',
    medium: 'bg-amber-100 text-amber-800 border border-amber-300',
    low: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  }

  return (
    <main className="relative min-h-[calc(100dvh-72px)] overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#f59e0b_0%,transparent_38%),radial-gradient(circle_at_80%_10%,#0ea5e9_0%,transparent_35%),linear-gradient(165deg,#f8fafc_0%,#fff7ed_45%,#ecfeff_100%)] px-4 py-10 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      <section className="mx-auto max-w-5xl rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            AI Feedback Console
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Categorize one note or cluster many feedback entries
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-700 sm:text-base">
            Pick a mode, paste feedback, and run AI analysis. Categorization is
            for one feedback item, while clustering processes a list and returns
            grouped priorities.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onModeSwitch('categorize')}
            className={`rounded-2xl border px-5 py-4 text-left transition ${
              mode === 'categorize'
                ? 'border-cyan-500 bg-cyan-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-cyan-300'
            }`}
          >
            <p className="text-base font-semibold text-slate-900">Categorize</p>
            <p className="mt-1 text-sm text-slate-600">One feedback string</p>
          </button>

          <button
            type="button"
            onClick={() => onModeSwitch('cluster')}
            className={`rounded-2xl border px-5 py-4 text-left transition ${
              mode === 'cluster'
                ? 'border-cyan-500 bg-cyan-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-cyan-300'
            }`}
          >
            <p className="text-base font-semibold text-slate-900">Cluster</p>
            <p className="mt-1 text-sm text-slate-600">
              Multiple feedback entries
            </p>
          </button>
        </div>

        {mode === 'categorize' ? (
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <label
              htmlFor="single-feedback"
              className="block text-sm font-medium text-slate-700"
            >
              Feedback
            </label>
            <textarea
              id="single-feedback"
              value={singleFeedback}
              onChange={(event) => setSingleFeedback(event.target.value)}
              placeholder="Example: Login takes too long after clicking sign in."
              rows={5}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />

            <Button
              onClick={onSubmitCategorize}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <LoadingSwap isLoading={isSubmitting}>
                Categorize Feedback
              </LoadingSwap>
            </Button>

            {categoryResult ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">Result</p>
                <p
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${categoryStyles[categoryResult]}`}
                >
                  {categoryResult}
                </p>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-700">Feedback List</p>

            <div className="space-y-3">
              {multiFeedbacks.map((feedback, index) => (
                <div key={index} className="flex flex-col gap-2 sm:flex-row">
                  <textarea
                    value={feedback}
                    onChange={(event) =>
                      onUpdateFeedback(index, event.target.value)
                    }
                    placeholder={`Feedback #${index + 1}`}
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onRemoveFeedback(index)}
                    className="sm:self-start"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="button" variant="secondary" onClick={onAddFeedback}>
                Another Feedback
              </Button>
              <Button
                type="button"
                onClick={onSubmitCluster}
                disabled={isSubmitting || !hasClusterInput}
              >
                <LoadingSwap isLoading={isSubmitting}>
                  Start Clustering
                </LoadingSwap>
              </Button>
            </div>

            {clusterResult ? (
              <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-rose-700">
                    Critical
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {clusterResult.critical.length ? (
                      clusterResult.critical.map((item, index) => (
                        <li key={`critical-${index}`}>- {item}</li>
                      ))
                    ) : (
                      <li>- none</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-700">Medium</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {clusterResult.medium.length ? (
                      clusterResult.medium.map((item, index) => (
                        <li key={`medium-${index}`}>- {item}</li>
                      ))
                    ) : (
                      <li>- none</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Low</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {clusterResult.low.length ? (
                      clusterResult.low.map((item, index) => (
                        <li key={`low-${index}`}>- {item}</li>
                      ))
                    ) : (
                      <li>- none</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : null}
          </section>
        )}

        {errorMessage ? (
          <p className="mt-5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  )
}
