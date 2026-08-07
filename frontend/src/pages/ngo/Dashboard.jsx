import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HeartHandshake, ShieldCheck, Users, Calendar, ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function NGODashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ngo/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><div className="skeleton" style={{ height: 200 }} /></div>

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('dashboard')}</h1>
          <p className="page-subtitle">NGO Portal — Receive surplus food, manage beneficiaries & scheduled pickups</p>
        </div>
        <Link to="/ngo/available" className="btn btn-primary">
          <HeartHandshake size={18} /> Browse Available Donations
        </Link>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="stat-label">Food Received</div>
            <div className="stat-value">{stats?.food_received_kg || 0} <span style={{ fontSize: '1rem' }}>kg</span></div>
            <div className="stat-sub">{stats?.total_delivered || 0} donations completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-label">People Fed</div>
            <div className="stat-value">{stats?.total_beneficiaries || 0}</div>
            <div className="stat-sub">Active beneficiaries</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-label">Pending Pickups</div>
            <div className="stat-value">{stats?.pending_pickups || 0}</div>
            <div className="stat-sub">Scheduled for delivery</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-label">Total Accepted</div>
            <div className="stat-value">{stats?.total_accepted || 0}</div>
            <div className="stat-sub">Across all food donors</div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid-3">
        <div className="card">
          <HeartHandshake size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Available Food Surplus</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Browse nearby donations sorted by AI suitability score and distance.
          </p>
          <Link to="/ngo/available" className="btn btn-secondary btn-sm">Browse Donations &rarr;</Link>
        </div>

        <div className="card">
          <Calendar size={32} color="var(--accent-saffron)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Pickup Schedules</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            View pickup dates and delivery OTP codes for accepted donations.
          </p>
          <Link to="/ngo/schedule" className="btn btn-secondary btn-sm">View Schedule &rarr;</Link>
        </div>

        <div className="card">
          <Users size={32} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Beneficiaries Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Register community centers, orphanages, and headcount data.
          </p>
          <Link to="/ngo/beneficiaries" className="btn btn-secondary btn-sm">Manage Beneficiaries &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
