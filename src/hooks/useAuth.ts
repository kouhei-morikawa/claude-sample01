import { useState, useCallback } from 'react'
import { User } from '../types/auth'

const USERS_KEY = 'users'
const SESSION_KEY = 'currentUserId'

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadCurrentUser(): User | null {
  const userId = localStorage.getItem(SESSION_KEY)
  if (!userId) return null
  return loadUsers().find(u => u.id === userId) ?? null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(loadCurrentUser)
  const [error, setError] = useState<string | null>(null)

  const signUp = useCallback(async (email: string, name: string, password: string) => {
    setError(null)
    const users = loadUsers()
    if (users.some(u => u.email === email)) {
      setError('このメールアドレスはすでに登録されています')
      return false
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.trim(),
      name: name.trim(),
      passwordHash: await hashPassword(password),
      createdAt: Date.now(),
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    localStorage.setItem(SESSION_KEY, newUser.id)
    setUser(newUser)
    return true
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null)
    const found = loadUsers().find(u => u.email === email)
    if (!found || found.passwordHash !== await hashPassword(password)) {
      setError('メールアドレスまたはパスワードが正しくありません')
      return false
    }
    localStorage.setItem(SESSION_KEY, found.id)
    setUser(found)
    return true
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { user, error, signUp, signIn, signOut, clearError }
}
