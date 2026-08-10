import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { LogIn, Building2, Heart, User, Truck, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AnnaSetuLogo from '../../components/AnnaSetuLogo'
import ThreeDBackground from '../../components/ThreeDBackground'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [activeRole, setActiveRole] = useState('business')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    { id: 'business', label: t('business'), icon: Building2 },
    { id: 'ngo', label: t('ngo'), icon: Heart },
    { id: 'individual', label: t('individual'), icon: User },
    { id: 'delivery', label: t('delivery'), icon: Truck },
    { id: 'admin', label: t('admin'), icon: Shield },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const userData = await login(email, password, activeRole)
      toast.success(`Welcome back!`)
      const targetRole = (userData?.role || activeRole).toLowerCase()
      navigate(`/${targetRole}`, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Quick fill for demo
  const fillDemo = (role) => {
    setActiveRole(role)
    setEmail(`${role}@annasetu.org`)
    setPassword('password123')
  }

  return (
    <div className="auth-bg">
      <ThreeDBackground />
      <div className="auth-card">
        <div className="auth-logo" style={{ marginBottom: '1.25rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AnnaSetuLogo size={52} />
          </Link>
        </div>

        {/* 5-Role Login Tabs */}
        <div className="role-tabs">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRole(r.id)}
                className={`role-tab ${activeRole === r.id ? 'active' : ''}`}
              >
                <Icon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {r.label}
              </button>
            )
          })}
        </div>

        {activeRole === 'admin' && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.75rem', color: '#d97706', textAlign: 'center', fontWeight: 600 }}>
            🔒 Master Administrator Account (Single Admin System)
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`your-${activeRole}@domain.com`}
              className="input"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? t('loading') : <><LogIn size={18} /> {t('login')} as {activeRole.toUpperCase()}</>}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Quick Demo Accounts (Click to test):
          </p>
          <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['business', 'ngo', 'individual', 'delivery', 'admin'].map(r => (
              <button key={r} onClick={() => fillDemo(r)} className="btn btn-ghost btn-sm" style={{ fontSize: '0.7rem' }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-saffron-dark)', fontWeight: 700, textDecoration: 'none' }}>
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
