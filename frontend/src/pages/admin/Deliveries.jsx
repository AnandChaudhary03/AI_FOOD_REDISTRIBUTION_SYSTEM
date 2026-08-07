import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Truck, CheckCircle } from 'lucide-react'
import api from '../../api/api'

export default function AdminDeliveries() {
  const { t } = useTranslation()
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/deliveries')
      .then(res => setDeliveries(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Delivery Audit Log</h1>
        <p className="page-subtitle">Track pickup statuses and OTP verifications</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Pickup ID</th>
              <th>Donation ID</th>
              <th>Status</th>
              <th>OTP Verified</th>
              <th>Delivery Partner</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : deliveries.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No delivery records found</td></tr>
            ) : deliveries.map((d) => (
              <tr key={d.id}>
                <td>#PKP-{d.id}</td>
                <td>#DON-{d.donation_id}</td>
                <td><span className="badge badge-purple">{d.status}</span></td>
                <td>
                  {d.otp_verified ? <span className="badge badge-green"><CheckCircle size={12} /> Verified</span> : <span className="badge badge-saffron">Pending</span>}
                </td>
                <td>{d.delivery_partner_id ? `#DEL-${d.delivery_partner_id}` : 'Unassigned'}</td>
                <td>{new Date(d.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
