import { useState } from 'react'
import { KeyRound, X, CheckCircle } from 'lucide-react'

export default function OTPModal({ title = "Verify OTP", subtitle = "Enter the 6-digit delivery confirmation code", onVerify, onClose, loading = false }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleChange = (val, index) => {
    if (!/^\d*$/.test(val)) return
    const updated = [...otp]
    updated[index] = val.slice(-1)
    setOtp(updated)

    // Auto-focus next input
    if (val && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    if (fullOtp.length === 6) {
      onVerify(fullOtp)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={22} color="var(--accent-green)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{title}</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {subtitle}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs" style={{ marginBottom: '1.5rem' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-input-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="otp-input"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={otp.join('').length < 6 || loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Verifying...' : <><CheckCircle size={18} /> Confirm Delivery</>}
          </button>
        </form>
      </div>
    </div>
  )
}
