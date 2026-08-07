import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, CheckCircle } from 'lucide-react'
import api from '../../api/api'

export default function CompletedDeliveries() {
  const { t } = useTranslation()
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/delivery/completed-deliveries')
      .then(res => setCompleted(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('completed_deliveries')}</h1>
        <p className="page-subtitle">Log of all food deliveries verified via OTP confirmation</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Completed Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : completed.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No completed deliveries yet</td></tr>
            ) : completed.map((c) => (
              <tr key={c.pickup_id}>
                <td>#PKP-{c.pickup_id}</td>
                <td style={{ fontWeight: 600 }}>{c.product_name}</td>
                <td>{c.quantity} {c.unit}</td>
                <td><span className="badge badge-green"><CheckCircle size={12} /> OTP Verified</span></td>
                <td>{new Date(c.completed_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
