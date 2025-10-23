import { json } from '@tanstack/start'
import { deleteSession } from '~/lib/auth'

export async function POST({ request }: { request: Request }) {
  try {
    const cookie = request.headers.get('Cookie')
    const sessionToken = cookie
      ?.split(';')
      .find((c) => c.trim().startsWith('session='))
      ?.split('=')[1]

    if (sessionToken) {
      await deleteSession(sessionToken)
    }

    // Clear cookie
    const headers = new Headers()
    headers.set('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')

    return json({ success: true }, { headers })
  } catch (error) {
    console.error('Signout error:', error)
    return json({ error: 'Failed to sign out' }, { status: 500 })
  }
}
