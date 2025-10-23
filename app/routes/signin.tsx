import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/signin')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Sign in failed')
        setLoading(false)
        return
      }

      // Redirect to dashboard or home
      navigate({ to: '/lucy' })
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          AaronOS
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </header>

      <main className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In to AaronOS</h2>

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '1.5rem', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#14b8a6', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
