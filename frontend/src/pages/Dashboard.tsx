import { useState, useEffect } from 'react'
import { Opening, UserProgress } from '@chess-trainer/shared'
import { fetchOpenings } from '../api/openings'
import { fetchProgress } from '../api/progress'
import ProgressDashboard from '../components/Progress/ProgressDashboard'

export default function Dashboard() {
  const [openings, setOpenings] = useState<Opening[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchOpenings(), fetchProgress()])
      .then(([openingData, progressData]) => {
        setOpenings(openingData)
        setProgress(progressData)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Track your opening training progress.
      </p>

      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            borderRadius: '6px',
            color: '#dc2626',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      <ProgressDashboard
        progress={progress}
        openings={openings}
        loading={loading}
      />
    </div>
  )
}
