import { useEffect, useMemo, useState } from 'react'
import { UserContext } from './user.js'

const USER_ID_KEY = 'hg_user_id_v1'

function isValidUserId(value) {
  return typeof value === 'string' && value.trim().length >= 8
}

function generateUserId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `uid_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const existing = localStorage.getItem(USER_ID_KEY)
    if (isValidUserId(existing)) {
      setUserId(existing)
      return
    }
    const created = generateUserId()
    localStorage.setItem(USER_ID_KEY, created)
    setUserId(created)
  }, [])

  const value = useMemo(() => ({ userId }), [userId])

  if (!userId) return null
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

