import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Receipt, Download } from 'lucide-react'
import api from '../../api/api'

export default function BusinessTransactions() {
  const { t } = useTranslation()
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/business/transactions')
      .then(res => setTxns(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('transactions')}</h1>
          <p className="page-subtitle">Historical donation delivery transactions audit trail</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : txns.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No transactions recorded yet</td></tr>
            ) : txns.map(t => (
              <tr key={t.id}>
                <td>#TXN-{t.id}</td>
                <td><span className="badge badge-blue">{t.type}</span></td>
                <td>{t.quantity} {t.unit}</td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
