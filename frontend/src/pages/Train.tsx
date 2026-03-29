import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Opening } from '@chess-trainer/shared'
import { fetchOpening } from '../api/openings'
import { useOpeningTrainer } from '../hooks/useOpeningTrainer'
import TrainingBoard from '../components/Board/TrainingBoard'
import MoveHint from '../components/Board/MoveHint'

const qualityColors: Record<string, string> = {
  best: '#16a34a',
  acceptable: '#ca8a04',
  mistake: '#dc2626',
}

const qualityLabels: Record<string, string> = {
  best: 'Best move!',
  acceptable: 'Acceptable move',
  mistake: 'Mistake',
}

export default function Train() {
  const { openingId } = useParams<{ openingId: string }>()
  const navigate = useNavigate()

  const [opening, setOpening] = useState<Opening | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const trainer = useOpeningTrainer()

  useEffect(() => {
    if (!openingId) return
    fetchOpening(openingId)
      .then((o) => {
        setOpening(o)
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : 'Failed to load opening'))
  }, [openingId])

  useEffect(() => {
    if (opening && trainer.status === 'idle') {
      trainer.startSession(opening)
    }
  }, [opening, trainer])

  useEffect(() => {
    if (trainer.status === 'opponent_thinking') {
      trainer.handleOpponentMove()
    }
  }, [trainer.status])

  if (loadError) {
    return (
      <div>
        <p style={{ color: '#dc2626' }}>{loadError}</p>
        <button onClick={() => navigate('/')}>Back to openings</button>
      </div>
    )
  }

  if (!opening || trainer.status === 'idle') {
    return <p>Loading training session...</p>
  }

  const isUserTurn = trainer.status === 'user_turn'
  const isComplete = trainer.status === 'complete'
  const isFeedback = trainer.status === 'move_feedback'

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: '0 0 auto' }}>
        <TrainingBoard
          fen={trainer.fen}
          onMove={(from, to, promotion) => trainer.handleUserMove(from, to, promotion)}
          explorerResult={trainer.explorerResult}
          orientation={opening.color}
          disabled={!isUserTurn}
          showArrows={isUserTurn}
        />
      </div>

      <div style={{ flex: '1', minWidth: '280px', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '4px' }}>{opening.name}</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
          Playing as {opening.color} · {opening.ecoCode} ·{' '}
          {trainer.movesPlayed.length} / {opening.moveCount} moves
        </p>

        {trainer.feedback && (isFeedback || isComplete) && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              border: `2px solid ${qualityColors[trainer.feedback.quality]}`,
              marginBottom: '16px',
            }}
          >
            <p
              style={{
                fontWeight: 'bold',
                color: qualityColors[trainer.feedback.quality],
                margin: '0 0 4px',
              }}
            >
              {qualityLabels[trainer.feedback.quality]}
            </p>
            {trainer.feedback.quality !== 'best' && (
              <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                Best move was{' '}
                <strong style={{ fontFamily: 'monospace' }}>
                  {trainer.feedback.bestMove}
                </strong>{' '}
                ({(trainer.feedback.bestShare * 100).toFixed(0)}% of master games)
              </p>
            )}
          </div>
        )}

        {isComplete && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ margin: '0 0 8px', color: '#15803d' }}>
              Session Complete!
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#374151' }}>
              {trainer.movesPlayed.filter((m) => m.quality === 'best').length} /{' '}
              {trainer.movesPlayed.length} best moves
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => trainer.startSession(opening)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1d4ed8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Train Again
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#fff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Choose Another
              </button>
            </div>
          </div>
        )}

        {isFeedback && (
          <button
            onClick={trainer.continueAfterFeedback}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1d4ed8',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            Continue
          </button>
        )}

        {isUserTurn && (
          <MoveHint
            explorerResult={trainer.explorerResult}
            visible={false}
          />
        )}

        <div style={{ marginTop: '16px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
            Move History
          </h4>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
            {trainer.movesPlayed.map((attempt, i) => (
              <span
                key={i}
                style={{
                  color: qualityColors[attempt.quality],
                  marginRight: '8px',
                }}
                title={`${attempt.quality}: played ${attempt.movePlayed}, best was ${attempt.bestMove}`}
              >
                {attempt.movePlayed}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
