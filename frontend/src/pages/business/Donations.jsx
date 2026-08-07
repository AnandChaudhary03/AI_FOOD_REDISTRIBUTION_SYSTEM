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
              <th>Status</th>
              <th>AI Match Score</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : donations.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('no_data')}</td></tr>
            ) : donations.map((d) => (
              <tr key={d.id}>
                <td>#DON-{d.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.product_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.category}</div>
                </td>
                <td>{d.quantity} {d.unit}</td>
                <td>{d.pickup_address || 'Business address'}</td>
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
