import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('annasetu_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('annasetu_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role })
    const { access_token, refresh_token, user: userData } = res.data
    localStorage.setItem('annasetu_token', access_token)
    localStorage.setItem('annasetu_refresh', refresh_token)
    localStorage.setItem('annasetu_user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data
  }

  const logout = () => {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('annasetu_token')
    localStorage.removeItem('annasetu_refresh')
    localStorage.removeItem('annasetu_user')
    setUser(null)
    window.location.href = '/login'
  }

  const updateLanguage = async (lang) => {
    try {
      await api.put(`/auth/language?lang=${lang}`)
      const updatedUser = { ...user, language_pref: lang }
      setUser(updatedUser)
      localStorage.setItem('annasetu_user', JSON.stringify(updatedUser))
    } catch (e) {
      console.warn('Language preference save notice:', e)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
