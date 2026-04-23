import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('admin_token') || '',
  admin: null,
  setAuth: (token, admin) => {
    localStorage.setItem('admin_token', token)
    set({ token, admin })
  },
  logout: () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_csrf')
    set({ token: '', admin: null })
  },
}))

export default useAuthStore
