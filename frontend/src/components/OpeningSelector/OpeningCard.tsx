import { useNavigate } from 'react-router-dom'
import { Opening } from '@chess-trainer/shared'

interface OpeningCardProps {
  opening: Opening
}

const colorBadgeStyle = (color: 'white' | 'black'): React.CSSProperties => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: color === 'white' ? '#f5f5f5' : '#333',
  color: color === 'white' ? '#333' : '#f5f5f5',
  border: '1px solid #ccc',
})

export default function OpeningCard({ opening }: OpeningCardProps) {
  const navigate = useNavigate()

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onClick={() => navigate(`/train/${opening.id}`)}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 12px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px' }}>{opening.name}</h3>
        <span
          style={{
            fontSize: '12px',
            color: '#888',
            fontFamily: 'monospace',
          }}
        >
          {opening.ecoCode}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={colorBadgeStyle(opening.color)}>
          {opening.color === 'white' ? 'White' : 'Black'}
        </span>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {opening.moveCount} moves
        </span>
      </div>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: '12px',
          color: '#888',
          fontFamily: 'monospace',
        }}
      >
        {opening.pgnMoves}
      </p>
    </div>
  )
}
