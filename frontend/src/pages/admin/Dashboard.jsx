import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, HeartHandshake, Truck, Shield, AlertTriangle, Leaf, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><div className="skeleton" style={{ height: 200 }} /></div>

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('admin')} {t('dashboard')}</h1>
          <p className="page-subtitle">Platform-wide overview, user management, and AI impact metrics</p>
        </div>
        <Link to="/admin/notifications" className="btn btn-primary">
          <Shield size={18} /> Broadcast Notification
        </Link>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats?.total_users || 0}</div>
            <div className="stat-sub">{stats?.businesses || 0} Biz | {stats?.ngos || 0} NGO</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="stat-label">Total Donations</div>
            <div className="stat-value">{stats?.total_donations || 0}</div>
            <div className="stat-sub">{stats?.delivered_donations || 0} delivered</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <Leaf size={24} />
          </div>
          <div>
            <div className="stat-label">Food Saved</div>
            <div className="stat-value">{stats?.total_food_saved_kg || 0} kg</div>
            <div className="stat-sub">CO₂ Saved: {stats?.co2_saved_kg || 0} kg</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-label">Delivery Success</div>
            <div className="stat-value">{stats?.delivery_success_rate || 0}%</div>
            <div className="stat-sub">OTP authenticated</div>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <Users size={32} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>User Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Approve, suspend, or manage roles for Businesses, NGOs, Individuals, and Delivery partners.
          </p>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">Manage Users &rarr;</Link>
        </div>

        <div className="card">
          <HeartHandshake size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>All Donations Overview</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Monitor food surplus listings across all registered business accounts.
          </p>
          <Link to="/admin/donations" className="btn btn-secondary btn-sm">View Donations &rarr;</Link>
        </div>

        <div className="card">
          <Truck size={32} color="var(--accent-saffron)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Delivery Oversight</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Track real-time delivery progress and OTP confirmation logs.
          </p>
          <Link to="/admin/deliveries" className="btn btn-secondary btn-sm">View Deliveries &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
