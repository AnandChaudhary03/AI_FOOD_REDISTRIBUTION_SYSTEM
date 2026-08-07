import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { History, CheckCircle } from 'lucide-react'
import api from '../../api/api'

export default function DonationHistory() {
  const { t } = useTranslation()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ngo/donation-history')
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('donation_history')}</h1>
        <p className="page-subtitle">Historical log of all successfully delivered food donations</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity Received</th>
              <th>Pickup Address</th>
              <th>Delivered Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No completed donation history found</td></tr>
            ) : history.map((h) => (
              <tr key={h.id}>
                <td>#DON-{h.id}</td>
                <td style={{ fontWeight: 600 }}>{h.product_name}</td>
                <td>{h.quantity} {h.unit}</td>
                <td>{h.pickup_address}</td>
                <td>{new Date(h.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
