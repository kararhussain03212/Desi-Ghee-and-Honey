import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password })
      const payload = response?.data?.data
      localStorage.setItem('admin_csrf', payload?.csrf_token || '')
      setAuth(payload?.token || '', payload?.admin || null)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg border border-stone-200">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <input
          className="w-full border border-stone-300 rounded-md p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email or username"
        />
        <input
          className="w-full border border-stone-300 rounded-md p-2 mb-3"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
        <button
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-md py-2 disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </main>
  )
}
