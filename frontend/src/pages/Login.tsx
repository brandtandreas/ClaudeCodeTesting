import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useUserStore } from '../store/userStore'

type Mode = 'login' | 'register'

export default function Login() {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { setUser, setToken } = useUserStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result =
        mode === 'login'
          ? await authApi.login(email, password)
          : await authApi.register(username, email, password)
      setToken(result.token)
      setUser(result.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#1a1a2e',
          }}
        >
          Chess Opening Trainer
        </h1>

        {/* Tab toggle */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #e0e0e0',
            marginBottom: '24px',
          }}
        >
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null) }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: mode === m ? 'bold' : 'normal',
                color: mode === m ? '#1a1a2e' : '#888',
                borderBottom: mode === m ? '2px solid #1a1a2e' : '2px solid transparent',
                marginBottom: '-2px',
                fontSize: '14px',
                textTransform: 'capitalize',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <label style={labelStyle}>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={2}
                maxLength={40}
                style={inputStyle}
                placeholder="Your display name"
              />
            </label>
          )}

          <label style={labelStyle}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="you@example.com"
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === 'register' ? 8 : 1}
              style={inputStyle}
              placeholder={mode === 'register' ? 'At least 8 characters' : ''}
            />
          </label>

          {error && (
            <p style={{ color: '#c0392b', fontSize: '13px', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1a1a2e',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '4px',
            }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#333',
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '14px',
  outline: 'none',
}
