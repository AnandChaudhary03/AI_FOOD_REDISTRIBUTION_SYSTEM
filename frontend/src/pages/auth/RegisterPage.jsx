import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { UserPlus, Building2, Heart, User, Truck, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

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

  const roles = [
    { id: 'business', label: t('business'), icon: Building2 },
    { id: 'ngo', label: t('ngo'), icon: Heart },
    { id: 'individual', label: t('individual'), icon: User },
    { id: 'delivery', label: t('delivery'), icon: Truck },
    { id: 'admin', label: t('admin'), icon: Shield },
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
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">अ</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join AnnaSetu to reduce food waste</p>
        </div>

        {/* 5-Role Tabs */}
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

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">{t('name')} *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" placeholder="John Doe" required />
          </div>

          <div className="input-group">
            <label className="input-label">{t('email')} *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" placeholder="john@example.com" required />
          </div>

          <div className="input-group">
            <label className="input-label">{t('phone')}</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="+91 9876543210" />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">{t('password')} *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input" placeholder="••••••••" required />
          </div>

          {(activeRole === 'business' || activeRole === 'ngo') && (
            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label className="input-label">{t('organization')}</label>
              <input type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} className="input" placeholder="e.g. Green Bakery or Hunger Care NGO" />
            </div>
          )}

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">{t('address')}</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="input" placeholder="123 Main Street" />
          </div>

          <div className="input-group">
            <label className="input-label">{t('city')}</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="input" />
          </div>

          <div className="input-group">
            <label className="input-label">{t('state')}</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} className="input" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ gridColumn: 'span 2', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? t('loading') : <><UserPlus size={18} /> Register as {activeRole.toUpperCase()}</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-green)', fontWeight: 600, textDecoration: 'none' }}>
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
