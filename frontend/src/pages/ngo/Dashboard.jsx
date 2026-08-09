import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HeartHandshake, ShieldCheck, Users, Calendar } from 'lucide-react'
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
          <p className="page-subtitle">{t('welcome_back_ngo')}</p>
        </div>
        <Link to="/ngo/available" className="btn btn-primary">
          <HeartHandshake size={18} /> {t('available_donations')}
        </Link>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="stat-label">{t('food_saved')}</div>
            <div className="stat-value">{stats?.food_received_kg || 0} <span style={{ fontSize: '1rem' }}>kg</span></div>
            <div className="stat-sub">{stats?.total_delivered || 0} {t('delivered_count')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-label">{t('beneficiaries')}</div>
            <div className="stat-value">{stats?.total_beneficiaries || 0}</div>
            <div className="stat-sub">{t('beneficiary_count')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-label">{t('pickup_schedule')}</div>
            <div className="stat-value">{stats?.pending_pickups || 0}</div>
            <div className="stat-sub">{t('pending')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-label">{t('accepted_donations')}</div>
            <div className="stat-value">{stats?.total_accepted || 0}</div>
            <div className="stat-sub">{t('accepted')}</div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid-3">
        <div className="card">
          <HeartHandshake size={32} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('available_donations_near_you')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('ngo_desc')}
          </p>
          <Link to="/ngo/available" className="btn btn-secondary btn-sm">{t('available_donations')} &rarr;</Link>
        </div>

        <div className="card">
          <Calendar size={32} color="var(--accent-saffron)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('pickup_schedule')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('delivery_desc')}
          </p>
          <Link to="/ngo/schedule" className="btn btn-secondary btn-sm">{t('pickup_schedule')} &rarr;</Link>
        </div>

        <div className="card">
          <Users size={32} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('beneficiaries')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('ngo_feature_2')}
          </p>
          <Link to="/ngo/beneficiaries" className="btn btn-secondary btn-sm">{t('beneficiaries')} &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
