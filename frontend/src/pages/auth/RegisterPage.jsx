import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { UserPlus, Building2, Heart, User, Truck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AnnaSetuLogo from '../../components/AnnaSetuLogo'
import ThreeDBackground from '../../components/ThreeDBackground'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [activeRole, setActiveRole] = useState('business')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    organization_name: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090
  })
  const [loading, setLoading] = useState(false)

  // Admin registration is disabled (System has single pre-configured admin)
  const roles = [
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'ngo', label: 'NGO', icon: Heart },
    { id: 'individual', label: 'Individual', icon: User },
    { id: 'delivery', label: 'Delivery', icon: Truck },
  ]

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill required fields')
      return
    }

    setLoading(true)
    try {
      await register({ ...formData, role: activeRole })
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <ThreeDBackground />
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-logo">
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '0.5rem' }}>
            <AnnaSetuLogo size={48} />
          </Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join AnnaSetu to reduce food waste</p>
        </div>

        {/* 4-Role Registration Tabs with Generous Spacing and Role Icons */}
        <div className="role-tabs" style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.75rem' }}>
          {roles.map((r) => {
            const Icon = r.icon
            const isActive = activeRole === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRole(r.id)}
                className={`role-tab ${isActive ? 'active' : ''}`}
                style={{ padding: '0.65rem 0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                <Icon size={16} />
                <span>{r.label}</span>
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">{t('name')} *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="input" required />
            </div>

            <div className="input-group">
              <label className="input-label">{t('email')} *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="input" required />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">{t('phone')}</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className="input" />
            </div>

            <div className="input-group">
              <label className="input-label">{t('password')} *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="input" required />
            </div>
          </div>

          {activeRole !== 'individual' && (
            <div className="input-group">
              <label className="input-label">{t('organization')}</label>
              <input type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} placeholder="Org / Business Name" className="input" />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">{t('address')}</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className="input" />
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">{t('city')}</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="input" />
            </div>

            <div className="input-group">
              <label className="input-label">{t('state')}</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className="input" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? t('loading') : <><UserPlus size={18} /> {t('register')} as {activeRole.toUpperCase()}</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-saffron-dark)', fontWeight: 700, textDecoration: 'none' }}>
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
