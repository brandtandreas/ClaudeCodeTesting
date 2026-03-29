import { useState, useEffect } from 'react'
import { UserProgress, SessionResult } from '@chess-trainer/shared'
import { fetchProgress, fetchOpeningProgress, submitSession } from '../api/progress'

interface UseProgressReturn {
  progress: UserProgress[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  submitSession: (session: SessionResult) => Promise<UserProgress | null>
}

export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProgress()
      setProgress(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const submit = async (session: SessionResult): Promise<UserProgress | null> => {
    try {
      const updated = await submitSession(session)
      setProgress((prev) => {
        const idx = prev.findIndex((p) => p.openingId === session.openingId)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = updated
          return next
        }
        return [...prev, updated]
      })
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit session')
      return null
    }
  }

  return { progress, loading, error, refresh, submitSession: submit }
}

export function useOpeningProgress(openingId: string) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchOpeningProgress(openingId)
      .then(setProgress)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load progress')
      )
      .finally(() => setLoading(false))
  }, [openingId])

  return { progress, loading, error }
}
