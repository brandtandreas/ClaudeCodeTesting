import { ExplorerResult } from '@chess-trainer/shared'

interface MoveHintProps {
  explorerResult: ExplorerResult | null
  visible: boolean
}

export default function MoveHint({ explorerResult, visible }: MoveHintProps) {
  if (!visible || !explorerResult) return null

  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: '#f0f4ff',
        borderRadius: '8px',
        marginTop: '8px',
      }}
    >
      <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Common moves:</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {explorerResult.commonMoves.map((move) => (
          <li
            key={move.san}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
              fontFamily: 'monospace',
            }}
          >
            <span
              style={{
                fontWeight:
                  move.san === explorerResult.bestMove.san ? 'bold' : 'normal',
              }}
            >
              {move.san}
            </span>
            <span style={{ color: '#666' }}>
              {(move.share * 100).toFixed(0)}% ({move.games.toLocaleString()} games)
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
