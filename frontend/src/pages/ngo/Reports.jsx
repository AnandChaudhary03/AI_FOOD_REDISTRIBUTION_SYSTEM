import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Download, TrendingUp, Award } from 'lucide-react'
import api from '../../api/api'

export default function NGOReports() {
  const { t } = useTranslation()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ngo/reports')
      .then(res => setReport(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('reports')}</h1>
          <p className="page-subtitle">Impact metrics, food distribution stats and exportable reports</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-secondary">
          <Download size={18} /> Export Impact Report
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-label">Total Donations Received</div>
            <div className="stat-value">{report?.total_donations_received || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-label">Total Food Volume</div>
            <div className="stat-value">{report?.total_food_kg || 0} kg</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-label">Beneficiaries Reached</div>
            <div className="stat-value">{report?.total_beneficiaries || 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
