import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HeartHandshake, ShieldCheck, History } from 'lucide-react'
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
          <p className="page-subtitle">{t('welcome_back_individual')}</p>
        </div>
        <Link to="/individual/available" className="btn btn-primary">
          <HeartHandshake size={18} /> {t('available_donations')}
        </Link>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="stat-label">{t('food_saved')}</div>
            <div className="stat-value">{stats?.food_received_kg || 0} kg</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-label">{t('accepted_donations')}</div>
            <div className="stat-value">{stats?.total_accepted || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <History size={24} />
          </div>
          <div>
            <div className="stat-label">{t('completed_deliveries')}</div>
            <div className="stat-value">{stats?.total_delivered || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <HeartHandshake size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('available_donations_near_you')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('individual_desc')}
          </p>
          <Link to="/individual/available" className="btn btn-secondary btn-sm">{t('available_donations')} &rarr;</Link>
        </div>

        <div className="card">
          <History size={32} color="var(--accent-saffron)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('donation_history')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('individual_feature_2')}
          </p>
          <Link to="/individual/history" className="btn btn-secondary btn-sm">{t('donation_history')} &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
