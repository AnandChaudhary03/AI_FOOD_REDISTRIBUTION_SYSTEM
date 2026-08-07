import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Truck, CheckCircle, MapPin, KeyRound, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function DeliveryDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/delivery/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('dashboard')}</h1>
          <p className="page-subtitle">Delivery Partner Hub — Pick up food donations & verify delivery with OTP</p>
        </div>
        <Link to="/delivery/available" className="btn btn-primary">
          <Truck size={18} /> Available Deliveries
        </Link>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Truck size={24} />
          </div>
          <div>
            <div className="stat-label">Total Deliveries</div>
            <div className="stat-value">{stats?.total_deliveries || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-label">Completed Deliveries</div>
            <div className="stat-value">{stats?.completed_deliveries || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className="stat-label">Active Pickup Jobs</div>
            <div className="stat-value">{stats?.active_deliveries || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <Truck size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Available Food Pickups</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Find nearby food donations scheduled for NGO pickup. Accept orders and navigate.
          </p>
          <Link to="/delivery/available" className="btn btn-secondary btn-sm">Find Pickups &rarr;</Link>
        </div>

        <div className="card">
          <KeyRound size={32} color="var(--accent-saffron)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Active Delivery & OTP Verification</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Enter recipient OTP to verify food dropoff and mark delivery as completed.
          </p>
          <Link to="/delivery/active" className="btn btn-secondary btn-sm">Active Orders &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
