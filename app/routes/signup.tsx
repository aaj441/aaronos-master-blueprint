import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Sign up failed')
        setLoading(false)
        return
      }

      // Redirect to dashboard
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
          <Link to="/signin">Sign In</Link>
        </nav>
      </header>

      <main className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Your Account</h2>

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '1.5rem', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
                autoComplete="new-password"
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: '#14b8a6', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
