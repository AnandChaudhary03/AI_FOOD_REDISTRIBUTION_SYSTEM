import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { HeartHandshake, MapPin, Sparkles, Check, Clock } from 'lucide-react'
import api from '../../api/api'

export default function AvailableDonations() {
  const { t } = useTranslation()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ngo/available-donations')
      .then(res => setDonations(res.data))
      .catch(err => toast.error('Failed to load donations'))
      .finally(() => setLoading(false))
  }, [])

  const handleAccept = async (id) => {
    try {
      await api.post(`/ngo/donations/${id}/accept`)
      toast.success('Donation accepted successfully!')
      setDonations(donations.filter(d => d.id !== id))
    } catch (err) {
      toast.error('Failed to accept donation')
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('available_donations')}</h1>
        <p className="page-subtitle">Surplus food offered by nearby businesses ranked by AI match score</p>
      </div>

      {loading ? (
        <div className="grid-3">{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 220 }} />)}</div>
      ) : donations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <HeartHandshake size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700 }}>No Available Donations Right Now</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Check back soon as businesses list surplus food items.</p>
        </div>
      ) : (
        <div className="grid-3">
          {donations.map((d) => (
            <div key={d.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-green">
                    <Sparkles size={12} /> {d.ai_match_score}% AI Match
                  </span>
                  {d.distance_km && (
                    <span className="badge badge-blue">
                      <MapPin size={12} /> {d.distance_km} km away
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{d.product_name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-saffron)', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Quantity: {d.quantity} {d.unit}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <strong>Donor:</strong> {d.business_name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <strong>Pickup:</strong> {d.pickup_address || 'Delhi'}
                </div>
                {d.expiry_date && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> Best before: {new Date(d.expiry_date).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button onClick={() => handleAccept(d.id)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Check size={18} /> Accept Donation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
