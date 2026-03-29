import { useState } from 'react'
import { Opening } from '@chess-trainer/shared'
import OpeningCard from './OpeningCard'

interface OpeningListProps {
  openings: Opening[]
}

export default function OpeningList({ openings }: OpeningListProps) {
  const [colorFilter, setColorFilter] = useState<'all' | 'white' | 'black'>('all')
  const [search, setSearch] = useState('')

  const filtered = openings.filter((o) => {
    const matchesColor = colorFilter === 'all' || o.color === colorFilter
    const matchesSearch =
      search === '' ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.ecoCode.toLowerCase().includes(search.toLowerCase())
    return matchesColor && matchesSearch
  })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search openings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            flex: '1',
            minWidth: '200px',
            fontSize: '14px',
          }}
        />
        <select
          value={colorFilter}
          onChange={(e) =>
            setColorFilter(e.target.value as 'all' | 'white' | 'black')
          }
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        >
          <option value="all">All colors</option>
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
          No openings match your filter.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {filtered.map((opening) => (
            <OpeningCard key={opening.id} opening={opening} />
          ))}
        </div>
      )}
    </div>
  )
}
