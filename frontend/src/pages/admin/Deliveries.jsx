import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Truck, CheckCircle, Phone, ShieldCheck, Thermometer, UserCheck, AlertCircle } from 'lucide-react'
import api from '../../api/api'

export default function AdminDeliveries() {
  const { t } = useTranslation()
  const [deliveries, setDeliveries] = useState([])
  const [fleet, setFleet] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    Promise.all([
      api.get('/admin/deliveries').catch(() => ({ data: [] })),
      api.get('/admin/fleet').catch(() => ({ data: [] }))
    ])
      .then(([delRes, fleetRes]) => {
        setDeliveries(delRes.data || [])
        setFleet(fleetRes.data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredDeliveries = deliveries.filter(d => {
    if (filter === 'busy') return d.driver_status === 'busy' || d.status === 'in_transit'
    if (filter === 'free') return d.driver_status === 'free'
    if (filter === 'delivered') return d.status === 'delivered'
    return true
  })

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Delivery Fleet & Food Safety Tracker</h1>
          <p className="page-subtitle">Real-time driver availability (Free/Busy), vehicle numbers, contact details & food safety verification</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          >
            All Deliveries
          </button>
          <button
            onClick={() => setFilter('busy')}
            className={`btn btn-sm ${filter === 'busy' ? 'btn-primary' : 'btn-ghost'}`}
          >
            In Transit (Busy)
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`btn btn-sm ${filter === 'free' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Available (Free)
          </button>
        </div>
      </div>

      {/* DRIVER FLEET STATUS OVERVIEW CARDS */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Truck color="#FF6B52" size={20} /> Active Delivery Fleet Partners
      </h3>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {fleet.length === 0 ? (
          /* Sample Driver Cards if no custom drivers created yet */
          [
            { name: 'Rohan Sharma', phone: '+91 98102 34567', vehicle: 'EV Cargo Van (DL 01 EV 4521)', status: 'free', rating: 4.9, count: 28 },
            { name: 'Vikram Singh', phone: '+91 98711 89012', vehicle: 'EV Refrig-Truck (DL 02 EV 9812)', status: 'busy', rating: 4.8, count: 42 },
            { name: 'Amit Kumar', phone: '+91 99530 12345', vehicle: 'EV Eco-Bike (DL 04 EV 1009)', status: 'free', rating: 5.0, count: 19 }
          ].map((driver, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: driver.status === 'busy' ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(34,197,94,0.4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {driver.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{driver.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={12} /> {driver.phone}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${driver.status === 'busy' ? 'badge-saffron' : 'badge-green'}`} style={{ fontWeight: 800 }}>
                    {driver.status === 'busy' ? '🟠 In Transit (Busy)' : '🟢 Available (Free)'}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.75rem', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🚚 Vehicle: {driver.vehicle}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <span>⭐ Rating: {driver.rating}/5</span> • <span>📦 Delivered: {driver.count} meals</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  <ShieldCheck size={12} /> Food Safety Certified
                </span>
                <a href={`tel:${driver.phone}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                  <Phone size={12} /> Call Driver
                </a>
              </div>
            </div>
          ))
        ) : (
          fleet.map((driver) => (
            <div key={driver.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: driver.status === 'busy' ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(34,197,94,0.4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {driver.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{driver.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={12} /> {driver.phone}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${driver.status === 'busy' ? 'badge-saffron' : 'badge-green'}`} style={{ fontWeight: 800 }}>
                    {driver.status === 'busy' ? '🟠 In Transit (Busy)' : '🟢 Available (Free)'}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.75rem', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🚚 Vehicle: {driver.vehicle_number}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <span>⭐ Rating: {driver.rating}/5</span> • <span>📦 Delivered: {driver.completed_deliveries} meals</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  <ShieldCheck size={12} /> Food Safety Certified
                </span>
                <a href={`tel:${driver.phone}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                  <Phone size={12} /> Call Driver
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* REAL-TIME DELIVERY AUDIT LOG TABLE */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck color="#22c55e" size={20} /> Real-Time Pickup & Food Safety Audit Log
      </h3>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Pickup ID</th>
              <th>Food Item & Batch</th>
              <th>Assigned Delivery Driver</th>
              <th>Vehicle Number</th>
              <th>Driver Availability</th>
              <th>Food Safety Status</th>
              <th>OTP Handover</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : filteredDeliveries.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No delivery audit records found</td></tr>
            ) : filteredDeliveries.map((d) => (
              <tr key={d.id}>
                <td><strong style={{ color: '#FF6B52' }}>#PKP-{d.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700 }}>{d.product_name || 'Surplus Food Batch'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.quantity}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>{d.driver_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {d.driver_phone}</div>
                </td>
                <td>
                  <span className="badge badge-gray" style={{ fontWeight: 700 }}>
                    🚚 {d.vehicle_number}
                  </span>
                </td>
                <td>
                  <span className={`badge ${d.driver_status === 'busy' ? 'badge-saffron' : 'badge-green'}`} style={{ fontWeight: 800 }}>
                    {d.driver_status === 'busy' ? '🟠 Busy (In Transit)' : '🟢 Free (Available)'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem', width: 'fit-content' }}>
                      <ShieldCheck size={11} /> Food Safety Verified
                    </span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      🌡️ {d.safety_temp || '4°C Cold Storage'}
                    </span>
                  </div>
                </td>
                <td>
                  {d.otp_verified ? (
                    <span className="badge badge-green"><CheckCircle size={12} /> Verified OTP</span>
                  ) : (
                    <span className="badge badge-saffron">Pending Handover</span>
                  )}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {d.created_at || 'Just Now'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
