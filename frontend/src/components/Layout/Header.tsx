import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: '#1a1a2e',
        color: '#fff',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <Link
        to="/"
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '20px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
        }}
      >
        Chess Opening Trainer
      </Link>
      <nav style={{ display: 'flex', gap: '24px' }}>
        <Link
          to="/"
          style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}
        >
          Openings
        </Link>
        <Link
          to="/dashboard"
          style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}
        >
          Dashboard
        </Link>
      </nav>
    </header>
  )
}
