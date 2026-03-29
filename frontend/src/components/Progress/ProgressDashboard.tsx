import { UserProgress, Opening } from '@chess-trainer/shared'
import OpeningProgressBar from './OpeningProgressBar'

interface ProgressDashboardProps {
  progress: UserProgress[]
  openings: Opening[]
  loading: boolean
}

export default function ProgressDashboard({
  progress,
  openings,
  loading,
}: ProgressDashboardProps) {
  const openingMap = new Map(openings.map((o) => [o.id, o]))

  const mastered = progress.filter((p) => p.mastered).length
  const inProgress = progress.filter(
    (p) => !p.mastered && p.sessionsCompleted > 0
  ).length

  if (loading) {
    return <p>Loading progress...</p>
  }

  if (progress.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
        <p>No training sessions yet.</p>
        <p>Pick an opening from the home page to start training.</p>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
          }}
        >
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
            {mastered}
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#166534' }}>Mastered</p>
        </div>
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
          }}
        >
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
            {inProgress}
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>In Progress</p>
        </div>
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>
            {progress.reduce((sum, p) => sum + p.sessionsCompleted, 0)}
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Total Sessions</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Opening Progress</h2>
      {progress.map((p) => (
        <OpeningProgressBar
          key={p.id}
          progress={p}
          openingName={openingMap.get(p.openingId)?.name}
        />
      ))}
    </div>
  )
}
