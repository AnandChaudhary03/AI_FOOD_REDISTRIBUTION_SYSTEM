import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('annasetu_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role })
    const { access_token, refresh_token, user: userData } = res.data
    localStorage.setItem('annasetu_token', access_token)
    localStorage.setItem('annasetu_refresh', refresh_token)
    localStorage.setItem('annasetu_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('annasetu_token')
    localStorage.removeItem('annasetu_refresh')
    localStorage.removeItem('annasetu_user')
    setUser(null)
    window.location.href = '/login'
  }

  const updateLanguage = async (lang) => {
    await api.put(`/auth/language?lang=${lang}`)
    const updatedUser = { ...user, language_pref: lang }
    setUser(updatedUser)
    localStorage.setItem('annasetu_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
