import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, Navigation } from 'lucide-react'
import MapView from '../../components/MapView'
import api from '../../api/api'

export default function BusinessMap() {
  const { t } = useTranslation()
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/business/nearby-ngos')
      .then(res => setNgos(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('map')}</h1>
        <p className="page-subtitle">Interactive map showing nearby NGOs registered on AnnaSetu</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <MapView locations={ngos} height="500px" />
        </div>

        <div>
          <div className="card" style={{ height: '500px', overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin color="var(--accent-green)" size={20} /> Registered NGOs ({ngos.length})
            </h3>
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>{t('loading')}</p>
            ) : ngos.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No nearby NGOs found</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ngos.map((ngo) => (
                  <div key={ngo.id} style={{ padding: '0.875rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600 }}>{ngo.organization_name || ngo.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {ngo.address || 'Delhi, India'}
                    </div>
                    {ngo.distance_km && (
                      <span className="badge badge-green" style={{ marginTop: '0.5rem' }}>
                        <Navigation size={12} /> {ngo.distance_km} km away
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
