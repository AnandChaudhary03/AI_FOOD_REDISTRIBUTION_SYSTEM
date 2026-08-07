import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HeartHandshake } from 'lucide-react'
import api from '../../api/api'

export default function AdminDonations() {
  const { t } = useTranslation()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/donations')
      .then(res => setDonations(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Platform {t('donations')}</h1>
        <p className="page-subtitle">All food surplus listings created across AnnaSetu</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Business ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : donations.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No donations found</td></tr>
            ) : donations.map((d) => (
              <tr key={d.id}>
                <td>#DON-{d.id}</td>
                <td style={{ fontWeight: 600 }}>{d.product_name}</td>
                <td>{d.quantity} {d.unit}</td>
                <td><span className="badge badge-green">{d.status}</span></td>
                <td>#BIZ-{d.business_id}</td>
                <td>{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
