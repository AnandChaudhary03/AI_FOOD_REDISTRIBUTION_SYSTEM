import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { TrendingUp, AlertTriangle, ShoppingBag, CheckCircle2, Play, RefreshCw, Zap, ShieldAlert, BarChart3, Database } from 'lucide-react'
import api from '../../api/api'

export default function WastePrediction() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [forecasts, setForecasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [runningBatch, setRunningBatch] = useState(false)
  const [storageCapacity, setStorageCapacity] = useState(500)

  const fetchForecastingData = async () => {
    try {
      const [reorderRes, forecastRes] = await Promise.all([
        api.get(`/forecasting/reorder-recommendations?storage_capacity=${storageCapacity}`).catch(() => ({ data: null })),
        api.get('/forecasting/demand-forecast').catch(() => ({ data: { forecasts: [] } }))
      ])
      setData(reorderRes.data || null)
      setForecasts(forecastRes.data?.forecasts || [])
    } catch (err) {
      toast.error('Failed to load forecasting recommendations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForecastingData()
  }, [storageCapacity])

  const handleTriggerBatch = async () => {
    setRunningBatch(true)
    try {
      const res = await api.post('/forecasting/trigger-batch')
      toast.success('Batch waste risk prediction completed!')
      fetchForecastingData()
    } catch (err) {
      toast.error('Batch risk prediction failed')
    } finally {
      setRunningBatch(false)
    }
  }

  const recommendations = data?.recommendations || []
  const criticalCount = data?.critical_reorder_items_count || 0
  const totalSuggestedQty = data?.total_suggested_reorder_qty || 0
  const totalSavings = data?.total_estimated_savings_inr || 0

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp color="#FF6B52" size={28} /> AI Waste Predictor & Smart Reordering
          </h1>
          <p className="page-subtitle">Predict daily product demand, flag items at waste risk, and receive optimal stock purchase reorder suggestions</p>
        </div>
        <button onClick={handleTriggerBatch} disabled={runningBatch} className="btn btn-primary">
          <Play size={16} /> {runningBatch ? 'Executing Batch Scan...' : 'Run On-Demand Batch Predictor'}
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-label">Critical Reorder Items</div>
            <div className="stat-value" style={{ color: criticalCount > 0 ? '#f87171' : 'var(--text-primary)' }}>
              {criticalCount} Items
            </div>
            <div className="stat-sub">Below Safety Stock Buffer</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="stat-label">Suggested Purchasing Qty</div>
            <div className="stat-value">{totalSuggestedQty} units</div>
            <div className="stat-sub">Optimal Reorder Order</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="stat-label">Est. Over-Stock Savings</div>
            <div className="stat-value" style={{ color: '#FFD166' }}>₹{totalSavings.toLocaleString()}</div>
            <div className="stat-sub">Wastage Avoidance Value</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
            <Database size={24} />
          </div>
          <div>
            <div className="stat-label">Storage Capacity Bound</div>
            <div className="stat-value">{storageCapacity} kg</div>
            <div className="stat-sub">Warehouse Max Limit</div>
          </div>
        </div>
      </div>

      {/* REORDER RECOMMENDATIONS TABLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap color="#FF6B52" size={20} /> Smart Reorder Recommendations & Waste Risk Matrix
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span>Storage Capacity Limit (kg):</span>
          <input
            type="number"
            className="input"
            style={{ width: '100px', padding: '0.35rem 0.6rem' }}
            value={storageCapacity}
            onChange={(e) => setStorageCapacity(parseFloat(e.target.value) || 500)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Daily Demand (AI)</th>
              <th>7-Day Demand</th>
              <th>Waste Risk Score</th>
              <th>Reorder Status</th>
              <th>Suggested Purchase Qty</th>
              <th>Est. Cost Savings</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Calculating AI demand forecasts...</td></tr>
            ) : recommendations.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No inventory items available for demand forecasting</td></tr>
            ) : recommendations.map((item, idx) => (
              <tr key={idx} style={{ background: item.reorder_required ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                <td style={{ fontWeight: 700 }}>{item.product_name}</td>
                <td>
                  <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                    {item.category}
                  </span>
                </td>
                <td>
                  <strong>{item.current_stock}</strong> {item.unit}
                </td>
                <td>
                  <span style={{ color: '#FF6B52', fontWeight: 700 }}>
                    ⚡ {item.predicted_daily_demand} {item.unit}/day
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>
                  {item.predicted_7day_demand} {item.unit}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${item.waste_risk_score}%`,
                          background: item.waste_risk_score >= 75 ? 'linear-gradient(90deg, #dc2626, #ef4444)' : (item.waste_risk_score >= 50 ? 'linear-gradient(90deg, #d97706, #f59e0b)' : 'linear-gradient(90deg, #16a34a, #22c55e)')
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: item.waste_risk_score >= 75 ? '#f87171' : 'var(--text-secondary)' }}>
                      {item.waste_risk_score}%
                    </span>
                  </div>
                </td>
                <td>
                  {item.reorder_required ? (
                    <span className="badge badge-red" style={{ fontWeight: 800 }}>
                      <AlertTriangle size={12} /> Reorder Urgently
                    </span>
                  ) : (
                    <span className="badge badge-green">
                      <CheckCircle2 size={12} /> Healthy Stock
                    </span>
                  )}
                </td>
                <td>
                  <strong style={{ color: item.suggested_reorder_qty > 0 ? '#4ade80' : 'var(--text-muted)' }}>
                    {item.suggested_reorder_qty > 0 ? `+${item.suggested_reorder_qty} ${item.unit}` : '0 (No Order Needed)'}
                  </strong>
                </td>
                <td style={{ fontSize: '0.85rem', color: item.estimated_cost_savings_inr > 0 ? '#FFD166' : 'var(--text-muted)', fontWeight: 700 }}>
                  {item.estimated_cost_savings_inr > 0 ? `₹${item.estimated_cost_savings_inr.toLocaleString()}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
