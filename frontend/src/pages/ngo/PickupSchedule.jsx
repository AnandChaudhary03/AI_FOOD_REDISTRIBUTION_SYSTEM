import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import api from '../../api/api'

export default function PickupSchedule() {
  const { t } = useTranslation()
  const [pickups, setPickups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ngo/pickup-schedule')
      .then(res => setPickups(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('pickup_schedule')}</h1>
        <p className="page-subtitle">Calendar view of all scheduled food delivery pickups</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Pickup ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Scheduled Time</th>
              <th>Status</th>
              <th>OTP Verified</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : pickups.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No pickups scheduled yet</td></tr>
            ) : pickups.map((p) => (
              <tr key={p.pickup_id}>
                <td>#PKP-{p.pickup_id}</td>
                <td style={{ fontWeight: 600 }}>{p.product_name}</td>
                <td>{p.quantity} {p.unit}</td>
                <td>{p.scheduled_time ? new Date(p.scheduled_time).toLocaleString() : 'Pending'}</td>
                <td><span className="badge badge-purple">{p.status}</span></td>
                <td>
                  {p.otp_verified ? (
                    <span className="badge badge-green"><CheckCircle size={12} /> Yes</span>
                  ) : (
                    <span className="badge badge-saffron">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
