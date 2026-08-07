import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Calendar, Clock, Key } from 'lucide-react'
import api from '../../api/api'

export default function AcceptedDonations() {
  const { t } = useTranslation()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [scheduleTime, setScheduleTime] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState(null)

  useEffect(() => {
    api.get('/ngo/accepted-donations')
      .then(res => setDonations(res.data))
      .catch(err => toast.error('Failed to load accepted donations'))
      .finally(() => setLoading(false))
  }, [])

  const handleSchedule = async (e) => {
    e.preventDefault()
    if (!scheduleTime) return toast.error('Select schedule date and time')
    try {
      const res = await api.post(`/ngo/donations/${selectedDonation.id}/schedule-pickup`, {
        donation_id: selectedDonation.id,
        scheduled_time: scheduleTime
      })
      toast.success('Pickup scheduled!')
      setGeneratedOtp(res.data.otp_code)
      // refresh list
      api.get('/ngo/accepted-donations').then(r => setDonations(r.data))
    } catch (err) {
      toast.error('Scheduling failed')
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('accepted_donations')}</h1>
        <p className="page-subtitle">Schedule pickup times and view delivery OTP codes for accepted food donations</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Pickup Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : donations.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No active accepted donations</td></tr>
            ) : donations.map((d) => (
              <tr key={d.id}>
                <td>#DON-{d.id}</td>
                <td style={{ fontWeight: 600 }}>{d.product_name}</td>
                <td>{d.quantity} {d.unit}</td>
                <td>{d.pickup_address}</td>
                <td>
                  <span className={`badge ${d.status === 'accepted' ? 'badge-blue' : 'badge-purple'}`}>
                    {d.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => { setSelectedDonation(d); setGeneratedOtp(null); }} className="btn btn-primary btn-sm">
                    <Calendar size={14} /> Schedule Pickup
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDonation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Schedule Pickup - #{selectedDonation.id}</h3>
            {generatedOtp ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <Key size={36} color="var(--accent-green)" style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontWeight: 700 }}>Pickup Scheduled!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                  Give this OTP code to the delivery partner upon arrival:
                </p>
                <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '4px', color: 'var(--accent-green)', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius)', margin: '1rem 0' }}>
                  {generatedOtp}
                </div>
                <button onClick={() => setSelectedDonation(null)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Date & Time for Pickup</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setSelectedDonation(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Confirm Schedule</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
