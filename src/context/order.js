import { createContext, useContext } from 'react'

export const OrderContext = createContext(null)

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used inside OrderProvider')
  return ctx
}

