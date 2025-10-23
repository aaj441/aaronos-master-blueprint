import { json } from '@tanstack/start'
import { authenticateUser, createSession } from '~/lib/auth'

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create session
    const session = await createSession(user.id)

    // Set cookie
    const headers = new Headers()
    headers.set(
      'Set-Cookie',
      `session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
    )

    return json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { headers }
    )
  } catch (error) {
    console.error('Signin error:', error)
    return json({ error: 'Failed to sign in' }, { status: 500 })
  }
}
