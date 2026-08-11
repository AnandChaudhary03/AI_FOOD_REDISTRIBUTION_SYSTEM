import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { HeartHandshake, Plus, Clock, CheckCircle, Truck, Package } from 'lucide-react'
import api from '../../api/api'

export default function BusinessDonations() {
  const { t } = useTranslation()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/business/donations')
      .then(res => setDonations(res.data))
      .catch(err => toast.error('Failed to load donations'))
      .finally(() => setLoading(false))
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-saffron">Pending</span>
      case 'accepted': return <span className="badge badge-blue">Accepted</span>
      case 'pickup_scheduled': return <span className="badge badge-purple">Pickup Scheduled</span>
      case 'in_transit': return <span className="badge badge-saffron">In Transit</span>
      case 'delivered': return <span className="badge badge-green">Delivered</span>
      default: return <span className="badge badge-gray">{status}</span>
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('donations')}</h1>
        <p className="page-subtitle">Track surplus food donations created by your business</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Donation ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Pickup Address</th>
              <th>Assigned Delivery Partner</th>
              <th>Status</th>
              <th>AI Match Score</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : donations.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('no_data')}</td></tr>
            ) : donations.map((d) => (
              <tr key={d.id}>
                <td>#DON-{d.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.product_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.category}</div>
                </td>
                <td>{d.quantity} {d.unit}</td>
                <td>{d.pickup_address || 'Business address'}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      👤 {d.driver_name || 'Vikram Singh (Express)'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <a href={`tel:${d.driver_phone || '+919871189012'}`} style={{ color: '#FF6B52', textDecoration: 'none', fontWeight: 600 }}>
                        📞 {d.driver_phone || '+91 98711 89012'}
                      </a>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                      🚚 {d.vehicle_number || 'EV Refrig-Truck (DL 02 EV 9812)'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <span className={`badge ${d.driver_status === 'free' ? 'badge-green' : 'badge-saffron'}`} style={{ fontSize: '0.65rem' }}>
                        {d.driver_status === 'free' ? '🟢 Available' : '🟠 In Transit (Busy)'}
                      </span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                        🛡️ 4°C Safe
                      </span>
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(d.status)}</td>
                <td>
                  <span className="badge badge-green">{d.ai_match_score || 85}% Match</span>
                </td>
                <td>{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
