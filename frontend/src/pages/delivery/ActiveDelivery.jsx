import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { KeyRound, MapPin, CheckCircle, Navigation } from 'lucide-react'
import OTPModal from '../../components/OTPModal'
import api from '../../api/api'

export default function ActiveDelivery() {
  const { t } = useTranslation()
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeOtpPickup, setActiveOtpPickup] = useState(null)
  const [verifying, setVerifying] = useState(false)

  const fetchActive = () => {
    setLoading(true)
    api.get('/delivery/active-deliveries')
      .then(res => setDeliveries(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchActive()
  }, [])

  const handleVerifyOtp = async (otpCode) => {
    setVerifying(true)
    try {
      await api.post(`/delivery/pickups/${activeOtpPickup.pickup_id}/verify-otp?otp_code=${otpCode}`)
      toast.success('OTP Verified! Delivery Completed Successfully!')
      setActiveOtpPickup(null)
      fetchActive()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid OTP code')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('active_delivery')}</h1>
        <p className="page-subtitle">Current in-transit food packages requiring delivery OTP authentication</p>
      </div>

      {loading ? (
        <div className="grid-2">{[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}</div>
      ) : deliveries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700 }}>No Active Deliveries</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Accept a new task from "Available Pickups".</p>
        </div>
      ) : (
        <div className="grid-2">
          {deliveries.map((d) => (
            <div key={d.pickup_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-purple">In Transit</span>
                <span className="badge badge-saffron">#PKP-{d.pickup_id}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{d.product_name}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 700, marginBottom: '1rem' }}>
                {d.quantity} {d.unit}
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '0.75rem', fontSize: '0.825rem' }}>
                <strong>1. Pickup Address:</strong> {d.pickup_address}
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.25rem', fontSize: '0.825rem' }}>
                <strong>2. Recipient:</strong> {d.recipient_name} ({d.recipient_address})
              </div>

              <button
                onClick={() => setActiveOtpPickup(d)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <KeyRound size={18} /> Enter Recipient Delivery OTP
              </button>
            </div>
          ))}
        </div>
      )}

      {activeOtpPickup && (
        <OTPModal
          title={`Delivery Confirmation - #${activeOtpPickup.pickup_id}`}
          subtitle={`Ask ${activeOtpPickup.recipient_name} for their 6-digit delivery OTP code`}
          onVerify={handleVerifyOtp}
          onClose={() => setActiveOtpPickup(null)}
          loading={verifying}
        />
      )}
    </div>
  )
}
