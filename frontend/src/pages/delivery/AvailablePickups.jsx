import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Truck, MapPin, Navigation, Check } from 'lucide-react'
import api from '../../api/api'

export default function AvailablePickups() {
  const { t } = useTranslation()
  const [pickups, setPickups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/delivery/available-pickups')
      .then(res => setPickups(res.data))
      .catch(err => toast.error('Failed to load available pickups'))
      .finally(() => setLoading(false))
  }, [])

  const handleAccept = async (id) => {
    try {
      await api.post(`/delivery/pickups/${id}/accept`)
      toast.success('Pickup order accepted! Check Active Deliveries.')
      setPickups(pickups.filter(p => p.pickup_id !== id))
    } catch (err) {
      toast.error('Failed to accept pickup')
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('available_pickups')}</h1>
        <p className="page-subtitle">Nearby food surplus orders ready for pickup and delivery</p>
      </div>

      {loading ? (
        <div className="grid-3">{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 220 }} />)}</div>
      ) : pickups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Truck size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700 }}>No Available Pickups Nearby</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Check back soon for new food delivery requests.</p>
        </div>
      ) : (
        <div className="grid-3">
          {pickups.map((p) => (
            <div key={p.pickup_id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-saffron">#PKP-{p.pickup_id}</span>
                  {p.distance_km && (
                    <span className="badge badge-green">
                      <Navigation size={12} /> {p.distance_km} km
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{p.product_name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {p.quantity} {p.unit}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <strong>Pickup from:</strong> {p.pickup_address}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <strong>Deliver to:</strong> {p.recipient_name} ({p.recipient_address})
                </div>
              </div>

              <button onClick={() => handleAccept(p.pickup_id)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Check size={18} /> Accept Delivery Task
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
