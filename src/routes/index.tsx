import { createFileRoute } from '@tanstack/react-router'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
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

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  minRows = 3,
  id,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  minRows?: number
  id?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useLayoutEffect(() => {
    const element = textareaRef.current
    if (!element) {
      return
    }
    element.style.height = '0px'
    element.style.height = `${element.scrollHeight}px`
  }, [value])

  return (
    <textarea
      id={id}
      ref={textareaRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className="w-full resize-none overflow-hidden rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
    />
  )
}

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
    <main className="min-h-[100dvh] bg-slate-100 px-3 py-4 sm:px-6 sm:py-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 space-y-2 sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Feedback Pilot System
          </p>
          <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            Sort customer feedback in seconds
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Choose one mode below. Use Categorize for one message, or Cluster to
            group several messages by priority.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3">
          <button
            type="button"
            onClick={() => onModeSwitch('categorize')}
            className={`rounded-xl border px-3 py-3 text-left transition sm:px-5 sm:py-4 ${
              mode === 'categorize'
                ? 'border-sky-500 bg-sky-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-sky-300'
            }`}
          >
            <p className="text-sm font-semibold text-slate-900 sm:text-base">
              Categorize
            </p>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              One feedback message
            </p>
          </button>

          <button
            type="button"
            onClick={() => onModeSwitch('cluster')}
            className={`rounded-xl border px-3 py-3 text-left transition sm:px-5 sm:py-4 ${
              mode === 'cluster'
                ? 'border-sky-500 bg-sky-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-sky-300'
            }`}
          >
            <p className="text-sm font-semibold text-slate-900 sm:text-base">
              Cluster
            </p>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Multiple feedback messages
            </p>
          </button>
        </div>

        {mode === 'categorize' ? (
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:space-y-4 sm:p-5">
            <label
              htmlFor="single-feedback"
              className="block text-sm font-medium text-slate-700"
            >
              Your feedback
            </label>
            <AutoResizeTextarea
              id="single-feedback"
              value={singleFeedback}
              onChange={setSingleFeedback}
              placeholder="Type a feedback message, like: Login is slow after I click sign in."
              minRows={4}
            />

            <Button
              onClick={onSubmitCategorize}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <LoadingSwap isLoading={isSubmitting}>
                Analyze Message
              </LoadingSwap>
            </Button>

            {categoryResult ? (
              <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                <p className="text-sm font-medium text-slate-700">
                  Suggested priority
                </p>
                <p
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${categoryStyles[categoryResult]}`}
                >
                  {categoryResult}
                </p>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:space-y-4 sm:p-5">
            <p className="text-sm font-medium text-slate-700">
              Feedback messages
            </p>

            <div className="space-y-2 sm:space-y-3">
              {multiFeedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 sm:flex-row sm:items-start"
                >
                  <AutoResizeTextarea
                    value={feedback}
                    onChange={(value) => onUpdateFeedback(index, value)}
                    placeholder={`Feedback #${index + 1}`}
                    minRows={3}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onRemoveFeedback(index)}
                    className="w-full sm:w-auto"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
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
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-3 sm:gap-4 sm:p-4">
                <div>
                  <p className="text-sm font-semibold text-rose-700">
                    Critical
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {clusterResult.critical.length ? (
                      clusterResult.critical.map((item, index) => (
                        <li key={`critical-${index}`}>• {item}</li>
                      ))
                    ) : (
                      <li>• No items yet</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-700">Medium</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {clusterResult.medium.length ? (
                      clusterResult.medium.map((item, index) => (
                        <li key={`medium-${index}`}>• {item}</li>
                      ))
                    ) : (
                      <li>• No items yet</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Low</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {clusterResult.low.length ? (
                      clusterResult.low.map((item, index) => (
                        <li key={`low-${index}`}>• {item}</li>
                      ))
                    ) : (
                      <li>• No items yet</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : null}
          </section>
        )}

        {errorMessage ? (
          <p className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:mt-5 sm:px-4 sm:py-3">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  )
}
