import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { HeartHandshake, Plus, MapPin, Clock, CheckCircle2, Sparkles, Filter } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/api'

export default function MyDonations() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Wedding Surplus',
    quantity: 20,
    unit: 'kg',
    expiry_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickup_address: user?.address || '',
    description: ''
  })

  const fetchDonations = () => {
    setLoading(true)
    api.get('/individual/donations')
      .then(res => setDonations(res.data))
      .catch(err => toast.error('Failed to load donations'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.expiry_date) {
      const selectedExp = new Date(formData.expiry_date)
      selectedExp.setHours(23, 59, 59, 999)
      const now = new Date()
      if (selectedExp < now) {
        toast.error('🚫 Expired food items cannot be donated for safety reasons. Please select today or a future date.', { duration: 5000 })
        return
      }
    }
    try {
      await api.post('/individual/donations', formData)
      toast.success('Food donation created! NGOs will be notified for pickup.')
      setShowModal(false)
      fetchDonations()
    } catch (err) {
      toast.error('Failed to submit donation')
    }
  }

  const filtered = donations.filter(d => {
    if (filter === 'all') return true
    return d.status === filter
  })

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Home & Event Food Donations</h1>
          <p className="page-subtitle">Track pickup progress of your surplus food donations to food banks & NGOs</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> New Food Donation
        </button>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'accepted', 'in_transit', 'delivered'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`btn ${filter === st ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: '99px', textTransform: 'capitalize' }}
          >
            {st === 'all' ? 'All Donations' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* DONATION CARDS GRID */}
      <div className="grid-2">
        {loading ? (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>Loading donations...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No donations found under this filter. Click "New Food Donation" to share extra food!
          </div>
        ) : filtered.map((d) => (
          <div key={d.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{d.product_name}</h3>
                <span className="badge badge-gray" style={{ marginTop: '0.35rem' }}>{d.category || 'Surplus Food'}</span>
              </div>
              <span className={`badge ${
                d.status === 'delivered' ? 'badge-green' :
                d.status === 'in_transit' || d.status === 'accepted' ? 'badge-saffron' : 'badge-purple'
              }`}>
                {d.status === 'pending' ? '⏳ Pending NGO' :
                 d.status === 'accepted' ? '✅ NGO Accepted' :
                 d.status === 'in_transit' ? '🚚 Pickup In Transit' : '🎉 Delivered'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.85rem', fontSize: '0.875rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Quantity</div>
                <div style={{ fontWeight: 700 }}>{d.quantity} {d.unit}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Must Pickup By</div>
                <div style={{ fontWeight: 700 }}>{d.expiry_date || 'Today'}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} color="#FF6B52" /> {d.pickup_address}
            </div>

            {d.description && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-card-hover)', padding: '0.5rem 0.75rem', borderRadius: '10px', margin: 0 }}>
                "{d.description}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* NEW DONATION MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '520px' }}>
            <h3 className="modal-title">Donate Household / Event Food</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Food / Event Description *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Wedding Meal - Biryani & Sweets"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Category</label>
                  <select className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Wedding Surplus">Wedding Surplus</option>
                    <option value="Party Leftovers">Party Leftovers</option>
                    <option value="Home Cooked Meals">Home Cooked Meals</option>
                    <option value="Bakery & Sweets">Bakery & Sweets</option>
                  </select>
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Quantity *</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Pickup Address *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit Donation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
