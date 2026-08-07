import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HeartHandshake, ShieldCheck, History, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function IndividualDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ngo/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('dashboard')}</h1>
          <p className="page-subtitle">Individual Portal — Claim surplus food donations for personal or community use</p>
        </div>
        <Link to="/individual/available" className="btn btn-primary">
          <HeartHandshake size={18} /> Browse Food Available
        </Link>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="stat-label">Food Claimed</div>
            <div className="stat-value">{stats?.food_received_kg || 0} kg</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-label">Accepted Donations</div>
            <div className="stat-value">{stats?.total_accepted || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <History size={24} />
          </div>
          <div>
            <div className="stat-label">Completed Deliveries</div>
            <div className="stat-value">{stats?.total_delivered || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <HeartHandshake size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Find Free Food Near You</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Browse food items donated by local bakeries, restaurants, and grocery stores.
          </p>
          <Link to="/individual/available" className="btn btn-secondary btn-sm">Explore Food &rarr;</Link>
        </div>

        <div className="card">
          <History size={32} color="var(--accent-saffron)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Claim History</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Review past food items claimed and delivered to your location.
          </p>
          <Link to="/individual/history" className="btn btn-secondary btn-sm">View History &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
