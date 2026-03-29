import { UserProgress } from '@chess-trainer/shared'

interface OpeningProgressBarProps {
  progress: UserProgress
  openingName?: string
}

export default function OpeningProgressBar({
  progress,
  openingName,
}: OpeningProgressBarProps) {
  const masteryPct = Math.min(
    100,
    Math.floor((progress.sessionsCompleted / 5) * 100)
  )

  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: '500' }}>
          {openingName ?? progress.openingId}
          {progress.mastered && (
            <span
              style={{
                marginLeft: '8px',
                fontSize: '12px',
                color: '#22c55e',
                fontWeight: 'bold',
              }}
            >
              Mastered
            </span>
          )}
        </span>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {progress.sessionsCompleted} sessions · streak {progress.bestStreak}
        </span>
      </div>
      <div
        style={{
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${masteryPct}%`,
            backgroundColor: progress.mastered ? '#22c55e' : '#3b82f6',
            borderRadius: '4px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
