import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Package, Plus, Search, Trash2, Edit3, HeartHandshake, AlertCircle, Barcode, Upload, Camera, CheckCircle, X } from 'lucide-react'
import BarcodeScanner from '../../components/BarcodeScanner'
import api from '../../api/api'

export default function BusinessInventory() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modals state
  const [showModal, setShowModal] = useState(false)
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)
  const [showCameraScanner, setShowCameraScanner] = useState(false)
  const [showCsvModal, setShowCsvModal] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Dairy',
    quantity: 10,
    unit: 'kg',
    expiry_date: '',
    description: '',
    barcode: ''
  })

  // Barcode search state
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scannedProduct, setScannedProduct] = useState(null)
  const [barcodeLoading, setBarcodeLoading] = useState(false)

  // CSV upload state
  const [csvFile, setCsvFile] = useState(null)
  const [csvUploading, setCsvUploading] = useState(false)

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

  // Barcode Lookup logic
  const handleBarcodeLookup = async (code) => {
    const cleanCode = code ? code.trim() : ''
    if (!cleanCode) {
      toast.error('Please enter or scan a barcode')
      return
    }
    setBarcodeLoading(true)
    setScannedProduct(null)
    try {
      const res = await api.get(`/business/barcode/${cleanCode}`)
      if (res.data && res.data.found) {
        setScannedProduct(res.data)
        toast.success(`Found product: ${res.data.product_name}`)
      } else {
        toast('Barcode not found in DB or online. Enter product details to save.', { icon: '📝' })
        setScannedProduct({ barcode: cleanCode, product_name: '', category: 'General', quantity: 1, unit: 'kg' })
      }
    } catch (err) {
      toast('Please enter product details below to register barcode.', { icon: '📝' })
      setScannedProduct({ barcode: cleanCode, product_name: '', category: 'General', quantity: 1, unit: 'kg' })
    } finally {
      setBarcodeLoading(false)
    }
  }

  const handleCameraDetected = (code) => {
    setShowCameraScanner(false)
    setBarcodeInput(code)
    handleBarcodeLookup(code)
  }

  const handleAddScannedProduct = async (e) => {
    e.preventDefault()
    if (!scannedProduct || !scannedProduct.product_name) {
      toast.error('Product name is required')
      return
    }
    try {
      await api.post('/business/inventory', {
        barcode: scannedProduct.barcode,
        product_name: scannedProduct.product_name,
        category: scannedProduct.category || 'General',
        quantity: parseFloat(scannedProduct.quantity || 1),
        unit: scannedProduct.unit || 'kg',
        expiry_date: scannedProduct.expiry_date
      })
      toast.success('Scanned product saved to inventory!')
      setScannedProduct(null)
      setBarcodeInput('')
      setShowBarcodeModal(false)
      fetchInventory()
    } catch (err) {
      toast.error('Failed to add to inventory')
    }
  }

  // CSV Upload logic
  const handleCsvUpload = async (e) => {
    e.preventDefault()
    if (!csvFile) return toast.error('Select a CSV file first')
    const formData = new FormData()
    formData.append('file', csvFile)
    setCsvUploading(true)
    try {
      const res = await api.post('/business/inventory/csv-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success(res.data.message)
      setCsvFile(null)
      setShowCsvModal(false)
      fetchInventory()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'CSV upload failed')
    } finally {
      setCsvUploading(false)
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">{t('inventory')}</h1>
          <p className="page-subtitle">Track food stock, expiry dates, AI urgency scores, scan barcodes & CSV import</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowBarcodeModal(true)} className="btn btn-secondary">
            <Barcode size={18} /> Barcode Scanner
          </button>
          <button onClick={() => setShowCsvModal(true)} className="btn btn-secondary">
            <Upload size={18} /> Bulk CSV Upload
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} /> {t('add_item')}
          </button>
        </div>
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

      {/* 1. Add Item Modal */}
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

      {/* 2. Barcode Scanner Modal */}
      {showBarcodeModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
                <Barcode color="var(--accent-green)" size={22} /> Barcode Scanner & Lookup
              </h3>
              <button onClick={() => setShowBarcodeModal(false)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <button onClick={() => setShowCameraScanner(true)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
              <Camera size={18} /> Open Camera Scanner
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Enter barcode e.g. 8901058000185"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="input"
              />
              <button onClick={() => handleBarcodeLookup(barcodeInput)} className="btn btn-secondary" disabled={barcodeLoading}>
                <Search size={18} />
              </button>
            </div>

            {scannedProduct && (
              <form onSubmit={handleAddScannedProduct} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  {scannedProduct.found ? '✅ Product Recognized' : '📝 Register New Barcode'}
                </h4>
                <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="input-label">Product Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={scannedProduct.product_name}
                    onChange={(e) => setScannedProduct({ ...scannedProduct, product_name: e.target.value })}
                    placeholder="e.g. Milk 1L"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Category</label>
                    <input
                      type="text"
                      className="input"
                      value={scannedProduct.category || ''}
                      onChange={(e) => setScannedProduct({ ...scannedProduct, category: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Quantity</label>
                    <input
                      type="number"
                      className="input"
                      value={scannedProduct.quantity || 1}
                      onChange={(e) => setScannedProduct({ ...scannedProduct, quantity: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <CheckCircle size={18} /> Save Product to Inventory
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Camera Live Scanner Popup */}
      {showCameraScanner && (
        <BarcodeScanner onDetected={handleCameraDetected} onClose={() => setShowCameraScanner(false)} />
      )}

      {/* 3. Bulk CSV Upload Modal */}
      {showCsvModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
                <Upload color="var(--accent-saffron)" size={22} /> Bulk CSV Import
              </h3>
              <button onClick={() => setShowCsvModal(false)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCsvUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} style={{ display: 'none' }} id="inv-csv-input" />
                <label htmlFor="inv-csv-input" style={{ cursor: 'pointer' }}>
                  <Upload size={32} color="var(--accent-saffron)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 600 }}>{csvFile ? csvFile.name : 'Click to select CSV file'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Columns: product_name, quantity, category, unit, barcode</div>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowCsvModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={csvUploading || !csvFile} style={{ flex: 1, justifyContent: 'center' }}>
                  {csvUploading ? 'Uploading...' : 'Import Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
