import { useState, useEffect } from 'react'
import { Opening } from '@chess-trainer/shared'
import { fetchOpenings } from '../api/openings'
import OpeningList from '../components/OpeningSelector/OpeningList'

export default function Home() {
  const [openings, setOpenings] = useState<Opening[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOpenings()
      .then(setOpenings)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load openings')
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 style={{ marginBottom: '8px' }}>Choose an Opening</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Select an opening to start training. Practice both sides by choosing
        openings as White or Black.
      </p>

      {loading && <p>Loading openings...</p>}
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
      {!loading && !error && <OpeningList openings={openings} />}
    </div>
  )
}
