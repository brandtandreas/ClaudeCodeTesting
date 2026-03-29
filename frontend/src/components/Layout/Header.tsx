import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/userStore'

export default function Header() {
  const { user, logout } = useUserStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

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
      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
        {user && (
          <span style={{ color: '#aaa', fontSize: '13px' }}>{user.username}</span>
        )}
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#ccc',
            cursor: 'pointer',
            fontSize: '13px',
            padding: '4px 12px',
          }}
        >
          Log out
        </button>
      </nav>
    </header>
  )
}
