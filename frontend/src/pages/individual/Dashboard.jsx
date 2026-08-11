import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { HeartHandshake, Plus, Utensils, Leaf, Users, MapPin, Sparkles } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/api'

export default function IndividualDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [data, setData] = useState({
    total_donations: 0,
    pending_donations: 0,
    active_donations: 0,
    delivered_donations: 0,
    food_saved_kg: 0,
    meals_served: 0,
    co2_saved_kg: 0,
    recent_donations: []
  })
  const [loading, setLoading] = useState(true)
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Wedding Surplus',
    quantity: 15,
    unit: 'kg',
    expiry_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickup_address: user?.address || '',
    description: ''
  })

  const fetchDashboard = () => {
    setLoading(true)
    api.get('/individual/dashboard')
      .then(res => {
        if (res.data) {
          setData({
            total_donations: res.data.total_donations || 0,
            pending_donations: res.data.pending_donations || 0,
            active_donations: res.data.active_donations || 0,
            delivered_donations: res.data.delivered_donations || 0,
            food_saved_kg: res.data.food_saved_kg || 0,
            meals_served: res.data.meals_served || 0,
            co2_saved_kg: res.data.co2_saved_kg || 0,
            recent_donations: Array.isArray(res.data.recent_donations) ? res.data.recent_donations : []
          })
        }
      })
      .catch(err => {
        console.warn('Individual dashboard API fallback:', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleSubmitDonation = async (e) => {
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
    setSubmitting(true)
    try {
      const res = await api.post('/individual/donations', formData)
      toast.success(res.data?.message || t('success'))
      setShowDonateModal(false)
      setFormData({
        product_name: '',
        category: 'Wedding Surplus',
        quantity: 15,
        unit: 'kg',
        expiry_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        pickup_address: user?.address || '',
        description: ''
      })
      fetchDashboard()
    } catch (err) {
      toast.error(t('error'))
    } finally {
      setSubmitting(false)
    }
  }

  const recentList = Array.isArray(data?.recent_donations) ? data.recent_donations : []

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">{t('individual_portal_title')}</h1>
          <p className="page-subtitle">{t('welcome_back_individual')}</p>
        </div>
        <button onClick={() => setShowDonateModal(true)} className="btn btn-primary btn-lg">
          <Plus size={20} /> {t('donate_surplus_food')}
        </button>
      </div>

      {/* STAT CARDS OVERVIEW */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,107,82,0.12)', color: '#FF6B52' }}>
            <Utensils size={26} />
          </div>
          <div>
            <div className="stat-label">{t('food_saved')}</div>
            <div className="stat-value">{data?.food_saved_kg || 0} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span></div>
            <div className="stat-sub">From home & event surplus</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(53,19,95,0.12)', color: '#35135F' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-label">Meals Served</div>
            <div className="stat-value">{data?.meals_served || 0}</div>
            <div className="stat-sub">{t('beneficiary_count')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
            <Leaf size={26} />
          </div>
          <div>
            <div className="stat-label">{t('co2_saved')}</div>
            <div className="stat-value">{data?.co2_saved_kg || 0} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span></div>
            <div className="stat-sub">Landfill waste offset</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
            <HeartHandshake size={26} />
          </div>
          <div>
            <div className="stat-label">{t('total_donations')}</div>
            <div className="stat-value">{data?.total_donations || 0}</div>
            <div className="stat-sub">{data?.active_donations || 0} {t('pending')}</div>
          </div>
        </div>
      </div>

      {/* QUICK DONATION BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,82,0.1) 0%, rgba(255,135,95,0.05) 100%)',
          border: '2px dashed rgba(255,107,82,0.3)',
          borderRadius: '24px',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,107,82,0.35)' }}>
            <HeartHandshake size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {t('wedding_party_banner_title')}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
              {t('wedding_party_banner_desc')}
            </p>
          </div>
        </div>
        <button onClick={() => setShowDonateModal(true)} className="btn btn-primary btn-lg">
          <Plus size={18} /> {t('donate_surplus_food')}
        </button>
      </div>

      {/* RECENT DONATIONS TABLE */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{t('my_recent_donations')}</h3>
          <span className="badge badge-green"><Sparkles size={12} /> {t('real_time_status')}</span>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>{t('product_name')}</th>
                <th>{t('quantity')}</th>
                <th>{t('pickup_address')}</th>
                <th>{t('expiry_date')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
              ) : recentList.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('no_data')}</td></tr>
              ) : recentList.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.product_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{item.id}</div>
                  </td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                      <MapPin size={14} color="#FF6B52" /> {item.pickup_address || t('address')}
                    </div>
                  </td>
                  <td>{item.created_at || 'Recent'}</td>
                  <td>
                    <span className={`badge ${
                      item.status === 'delivered' ? 'badge-green' :
                      item.status === 'in_transit' || item.status === 'accepted' ? 'badge-saffron' : 'badge-purple'
                    }`}>
                      {item.status === 'pending' ? `⏳ ${t('pending')}` :
                       item.status === 'accepted' ? `✅ ${t('accepted')}` :
                       item.status === 'in_transit' ? `🚚 ${t('in_transit')}` : `🎉 ${t('delivered')}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DONATE FOOD MODAL */}
      {showDonateModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '520px' }}>
            <h3 className="modal-title">{t('donate_surplus_food')}</h3>
            <form onSubmit={handleSubmitDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">{t('product_name')} *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Wedding Function Paneer Curry & Naan"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">{t('category')}</label>
                  <select className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Wedding Surplus">Wedding Surplus</option>
                    <option value="Party Leftovers">Party & Event Leftovers</option>
                    <option value="Home Meals">Home Cooked Food</option>
                    <option value="Bakery & Sweets">Bakery & Sweets</option>
                    <option value="Raw Ration">Packaged Ration</option>
                  </select>
                </div>

                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">{t('quantity')} *</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">{t('unit')}</label>
                  <select className="input" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                    <option value="kg">kg (weight)</option>
                    <option value="servings">servings / plates</option>
                    <option value="packets">packets</option>
                  </select>
                </div>

                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">{t('expiry_date')}</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">{t('pickup_address')} *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Community Hall / Home Address, Sector 15"
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">{t('description')}</label>
                <textarea
                  className="input"
                  rows="2"
                  placeholder="e.g. Freshly prepared 4 hours ago, packed in containers."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowDonateModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>{t('cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
                  {submitting ? t('loading') : t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
