import bcrypt from 'bcryptjs'
import { db } from './db'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name?: string) {
  const passwordHash = await hashPassword(password)

  return db.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  })
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
    include: { subscription: true },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    return null
  }

  return user
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

  return db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })
}

export async function getSessionUser(token: string) {
  const session = await db.session.findUnique({
    where: { token },
    include: { user: { include: { subscription: true } } },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return session.user
}

export async function deleteSession(token: string) {
  await db.session.delete({
    where: { token },
  })
}
