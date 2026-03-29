import { useRef, useState, useCallback } from 'react'
import { ExplorerResult } from '@chess-trainer/shared'

interface UseLichessExplorerReturn {
  result: ExplorerResult | null
  loading: boolean
  error: string | null
  fetch: (fen: string) => Promise<ExplorerResult | null>
}

export function useLichessExplorer(): UseLichessExplorerReturn {
  const cacheRef = useRef<Map<string, ExplorerResult | null>>(new Map())
  const [result, setResult] = useState<ExplorerResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async (fen: string): Promise<ExplorerResult | null> => {
    if (cacheRef.current.has(fen)) {
      const cached = cacheRef.current.get(fen) ?? null
      setResult(cached)
      return cached
    }

    setLoading(true)
    setError(null)

    try {
      const response = await window.fetch(
        `/api/explorer?fen=${encodeURIComponent(fen)}`
      )
      if (!response.ok) {
        throw new Error(`Explorer request failed: ${response.status}`)
      }
      const data = (await response.json()) as ExplorerResult | null
      cacheRef.current.set(fen, data)
      setResult(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      cacheRef.current.set(fen, null)
      setResult(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { result, loading, error, fetch }
}
