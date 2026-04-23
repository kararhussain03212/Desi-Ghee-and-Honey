import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { OrderContext } from './order.js'

import { useUser } from './user.js'

const LEGACY_ORDER_KEY = 'hg_order_v1'
const ORDER_KEY_PREFIX = 'hg_order_v2:'

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function normalizeOrder(order) {
  if (!Array.isArray(order)) return []
  return order
    .filter((x) => x && typeof x === 'object' && typeof x.id === 'string')
    .map((x) => ({ id: x.id, qty: Math.max(1, Math.floor(Number(x.qty) || 1)) }))
}

function loadOrder(storageKey) {
  let existing = null
  try {
    existing = localStorage.getItem(storageKey)
  } catch {
    existing = null
  }
  if (existing) return normalizeOrder(safeParse(existing, []))

  let legacy = null
  try {
    legacy = localStorage.getItem(LEGACY_ORDER_KEY)
  } catch {
    legacy = null
  }
  if (!legacy) return []

  const migrated = normalizeOrder(safeParse(legacy, []))
  try {
    localStorage.setItem(storageKey, JSON.stringify(migrated))
    localStorage.removeItem(LEGACY_ORDER_KEY)
  } catch {
    // Ignore storage write errors (e.g. private mode / blocked storage)
  }
  return migrated
}

export function OrderProvider({ children }) {
  const { userId } = useUser()
  const storageKey = useMemo(() => `${ORDER_KEY_PREFIX}${userId}`, [userId])
  const [order, setOrder] = useState(() => loadOrder(storageKey))
  const orderKeyRef = useRef(storageKey)

  useEffect(() => {
    orderKeyRef.current = storageKey
    setOrder(loadOrder(storageKey))
  }, [storageKey])

  useEffect(() => {
    if (orderKeyRef.current !== storageKey) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(order))
    } catch {
      // Ignore storage write errors (e.g. private mode / blocked storage)
    }
  }, [order, storageKey])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== storageKey) return
      setOrder(normalizeOrder(safeParse(e.newValue, [])))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  const addToOrder = useCallback((id, qty = 1) => {
    if (typeof id !== 'string') return
    const amount = Math.max(1, Math.floor(Number(qty) || 1))
    setOrder((prev) => {
      const found = prev.find((x) => x.id === id)
      if (!found) return [...prev, { id, qty: amount }]
      return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + amount } : x))
    })
  }, [])

  const removeFromOrder = useCallback((id) => {
    setOrder((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const setOrderQty = useCallback((id, qty) => {
    const amount = Math.floor(Number(qty) || 0)
    setOrder((prev) => {
      if (amount <= 0) return prev.filter((x) => x.id !== id)
      return prev.map((x) => (x.id === id ? { ...x, qty: amount } : x))
    })
  }, [])

  const clearOrder = useCallback(() => setOrder([]), [])

  const orderCount = useMemo(() => order.reduce((sum, item) => sum + item.qty, 0), [order])

  const value = useMemo(
    () => ({ order, orderCount, addToOrder, removeFromOrder, setOrderQty, clearOrder }),
    [addToOrder, clearOrder, order, orderCount, removeFromOrder, setOrderQty],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
