import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Package, Plus, Search, Trash2, Edit3, HeartHandshake, AlertCircle } from 'lucide-react'
import api from '../../api/api'

export default function BusinessInventory() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Dairy',
    quantity: 10,
    unit: 'kg',
    expiry_date: '',
    description: '',
    barcode: ''
  })

  const fetchInventory = () => {
    setLoading(true)
    api.get(`/business/inventory?search=${search}`)
      .then(res => setItems(res.data))
      .catch(err => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchInventory()
  }, [search])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/business/inventory', formData)
      toast.success('Inventory item added successfully!')
      setShowModal(false)
      fetchInventory()
    } catch (err) {
      toast.error('Failed to add item')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      await api.delete(`/business/inventory/${id}`)
      toast.success('Item deleted')
      fetchInventory()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const handleDonate = async (item) => {
    try {
      await api.post('/business/donations', {
        item_id: item.id,
        product_name: item.product_name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        expiry_date: item.expiry_date,
        description: item.description
      })
      toast.success('Donation created! NGOs will be notified.')
      fetchInventory()
    } catch (err) {
      toast.error('Failed to create donation')
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('inventory')}</h1>
          <p className="page-subtitle">Track food stock, expiry dates, and AI urgency scores</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> {t('add_item')}
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>AI Urgency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('no_data')}</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                  {item.barcode && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BC: {item.barcode}</div>}
                </td>
                <td><span className="badge badge-gray">{item.category || 'General'}</span></td>
                <td>{item.quantity} {item.unit}</td>
                <td>
                  {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <div style={{ width: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                      <span>{item.ai_urgency_score}%</span>
                      <span>{item.ai_urgency_score > 70 ? 'High' : item.ai_urgency_score > 40 ? 'Med' : 'Low'}</span>
                    </div>
                    <div className="urgency-bar">
                      <div
                        className={`urgency-fill ${item.ai_urgency_score > 70 ? 'urgency-high' : item.ai_urgency_score > 40 ? 'urgency-medium' : 'urgency-low'}`}
                        style={{ width: `${item.ai_urgency_score}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${item.status === 'available' ? 'badge-green' : 'badge-saffron'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {item.status === 'available' && (
                      <button onClick={() => handleDonate(item)} className="btn btn-primary btn-sm" title="Donate">
                        <HeartHandshake size={14} /> Donate
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Inventory Item</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Product Name *</label>
                <input type="text" className="input" value={formData.product_name} onChange={e => setFormData({ ...formData, product_name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select className="input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Dairy">Dairy & Eggs</option>
                  <option value="Bakery">Bakery & Bread</option>
                  <option value="Produce">Produce (Fruits & Veggies)</option>
                  <option value="Cooked">Cooked Meals</option>
                  <option value="Packaged">Packaged Goods</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 2 }}>
                  <label className="input-label">Quantity *</label>
                  <input type="number" className="input" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} required />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Unit</label>
                  <select className="input" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                    <option value="kg">kg</option>
                    <option value="litre">litre</option>
                    <option value="packets">packets</option>
                    <option value="servings">servings</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Expiry Date</label>
                <input type="date" className="input" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
