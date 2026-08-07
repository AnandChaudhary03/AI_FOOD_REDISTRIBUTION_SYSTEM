import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Users, Plus, Trash2, MapPin, Phone } from 'lucide-react'
import api from '../../api/api'

export default function Beneficiaries() {
  const { t } = useTranslation()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    count: 50,
    address: '',
    contact: '',
    notes: ''
  })

  const fetchBeneficiaries = () => {
    setLoading(true)
    api.get('/ngo/beneficiaries')
      .then(res => setList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBeneficiaries()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await api.post('/ngo/beneficiaries', formData)
      toast.success('Beneficiary group added!')
      setShowModal(false)
      fetchBeneficiaries()
    } catch (err) {
      toast.error('Failed to add')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete beneficiary record?')) return
    try {
      await api.delete(`/ngo/beneficiaries/${id}`)
      toast.success('Deleted')
      fetchBeneficiaries()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('beneficiaries')}</h1>
          <p className="page-subtitle">Manage orphanages, shelters, and community headcount supported by your NGO</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> {t('add_beneficiary')}
        </button>
      </div>

      <div className="grid-3">
        {loading ? (
          [1, 2].map(i => <div key={i} className="skeleton" style={{ height: 180 }} />)
        ) : list.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No beneficiaries added yet. Click "Add Beneficiary" above.
          </div>
        ) : list.map((b) => (
          <div key={b.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{b.name}</h3>
              <span className="badge badge-green">{b.count} People</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> {b.address || 'Address not specified'}
            </div>
            {b.contact && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone size={14} /> {b.contact}
              </div>
            )}
            <button onClick={() => handleDelete(b.id)} className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Beneficiary Center</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Center / Group Name *</label>
                <input type="text" className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">People Count *</label>
                <input type="number" className="input" value={formData.count} onChange={e => setFormData({ ...formData, count: parseInt(e.target.value) })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Address</label>
                <input type="text" className="input" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Contact Person / Phone</label>
                <input type="text" className="input" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Beneficiary</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
