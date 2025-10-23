import { json } from '@tanstack/start'
import { createUser, createSession } from '~/lib/auth'
import { db } from '~/lib/db'

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Create user
    const user = await createUser(email, password, name)

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
    console.error('Signup error:', error)
    return json({ error: 'Failed to create account' }, { status: 500 })
  }
}
