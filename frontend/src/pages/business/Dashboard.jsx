import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Package, HeartHandshake, AlertTriangle, Leaf, Plus, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function BusinessDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/business/dashboard')
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
          <p className="page-subtitle">{t('welcome_back_business')}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/business/inventory" className="btn btn-primary">
            <Plus size={18} /> {t('add_item')}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="stat-label">{t('inventory_items')}</div>
            <div className="stat-value">{stats?.total_inventory_items || 0}</div>
            <div className="stat-sub">{stats?.expiring_soon_count || 0} {t('expiring_soon')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="stat-label">{t('total_donations')}</div>
            <div className="stat-value">{stats?.total_donations || 0}</div>
            <div className="stat-sub">{stats?.delivered_count || 0} {t('delivered_count')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <Leaf size={24} />
          </div>
          <div>
            <div className="stat-label">{t('food_saved')}</div>
            <div className="stat-value">{stats?.food_saved_kg || 0} <span style={{ fontSize: '1rem' }}>kg</span></div>
            <div className="stat-sub">{t('co2_saved')}: {stats?.co2_saved_kg || 0} kg</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-label">{t('ai_expiry_alerts')}</div>
            <div className="stat-value">{stats?.expiring_soon_count || 0}</div>
            <div className="stat-sub">{t('action_required')}</div>
          </div>
        </div>
      </div>

      {/* AI Alert Section */}
      {stats?.ai_alerts?.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-saffron)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle color="var(--accent-saffron)" size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('ai_predictions_alerts')}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {stats.ai_alerts.map((alert, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{alert.item}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {t('expires_in')} <strong style={{ color: 'var(--accent-saffron)' }}>{alert.days_left} {t('days_left')}</strong>
                </div>
                <div className="urgency-bar">
                  <div className="urgency-fill urgency-high" style={{ width: `${alert.urgency}%` }} />
                </div>
                <Link to="/business/donations" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}>
                  {t('donate_now')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid-2">
        <div className="card">
          <Package size={32} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('manage_inventory_barcodes')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('manage_inventory_desc')}
          </p>
          <Link to="/business/inventory" className="btn btn-secondary btn-sm">{t('manage_inventory_btn')}</Link>
        </div>

        <div className="card">
          <MapPin size={32} color="var(--accent-saffron)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('nearby_ngos_map')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('nearby_ngos_desc')}
          </p>
          <Link to="/business/map" className="btn btn-secondary btn-sm">{t('view_map_btn')}</Link>
        </div>
      </div>
    </div>
  )
}
