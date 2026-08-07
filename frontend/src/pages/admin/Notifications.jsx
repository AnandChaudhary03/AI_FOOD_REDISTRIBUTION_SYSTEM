import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Bell, Send } from 'lucide-react'
import api from '../../api/api'

export default function AdminNotifications() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBroadcast = async (e) => {
    e.preventDefault()
    if (!title || !message) return toast.error('Enter title and message')
    setLoading(true)
    try {
      const res = await api.post(`/admin/broadcast-notification?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}${targetRole ? `&role=${targetRole}` : ''}`)
      toast.success(res.data.message)
      setTitle('')
      setMessage('')
    } catch (err) {
      toast.error('Broadcast failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('notifications')}</h1>
        <p className="page-subtitle">Send platform-wide broadcast alerts or targeted push notifications</p>
      </div>

      <div style={{ maxWidth: '600px' }} className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell color="var(--accent-saffron)" size={20} /> Broadcast Announcement
        </h3>

        <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Notification Title</label>
            <input type="text" className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. System Maintenance Notice" required />
          </div>

          <div className="input-group">
            <label className="input-label">Target Role (Optional)</label>
            <select className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
              <option value="">All Users</option>
              <option value="business">Business Users Only</option>
              <option value="ngo">NGO Users Only</option>
              <option value="individual">Individuals Only</option>
              <option value="delivery">Delivery Partners Only</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Message Content</label>
            <textarea className="input" rows="4" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type announcement message here..." required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Sending...' : <><Send size={18} /> Send Broadcast</>}
          </button>
        </form>
      </div>
    </div>
  )
}
