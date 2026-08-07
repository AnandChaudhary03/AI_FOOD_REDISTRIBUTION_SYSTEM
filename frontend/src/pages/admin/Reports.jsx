import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Download } from 'lucide-react'
import api from '../../api/api'

export default function AdminReports() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/reports/system')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Platform Impact Reports</h1>
          <p className="page-subtitle">Detailed breakdown of food categories and total transactions</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-secondary">
          <Download size={18} /> Print System Summary
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Food Saved by Category (kg)</h3>
          {loading ? (
            <p>{t('loading')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(data?.category_breakdown || {}).map(([cat, qty]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontWeight: 600 }}>{cat}</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>{qty} kg</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Operational Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
              <span>Total Transactions</span>
              <strong>{data?.total_transactions || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
              <span>Total Pickups Scheduled</span>
              <strong>{data?.total_pickups || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
              <span>Successful Pickups</span>
              <strong style={{ color: 'var(--accent-green)' }}>{data?.successful_pickups || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
