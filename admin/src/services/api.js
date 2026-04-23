import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  const csrf = localStorage.getItem('admin_csrf')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (csrf && ['post', 'put', 'patch', 'delete'].includes((config.method || '').toLowerCase())) {
    config.headers['X-CSRF-Token'] = csrf
  }

  return config
})

export default api
