import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Package, Plus, Search, Trash2, HeartHandshake, Barcode, Upload, Camera, CheckCircle, X, Sparkles, FileSpreadsheet, AlertTriangle, Clock } from 'lucide-react'
import BarcodeScanner from '../../components/BarcodeScanner'
import api from '../../api/api'

export default function BusinessInventory() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Active Tab state above Inventory List: 'barcode' or 'csv'
  const [activeTab, setActiveTab] = useState('barcode')

  // Modals state
  const [showModal, setShowModal] = useState(false)
  const [showCameraScanner, setShowCameraScanner] = useState(false)

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

  // Calculate Expiry Status & Days Remaining
  const getItemExpiryInfo = (expiryDateStr) => {
    if (!expiryDateStr) return { isExpired: false, isExpiringSoon: false, diffDays: null, label: 'No Expiry' }
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const exp = new Date(expiryDateStr)
    exp.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { isExpired: true, isExpiringSoon: false, diffDays, label: 'EXPIRED' }
    } else if (diffDays <= 3) {
      return { isExpired: false, isExpiringSoon: true, diffDays, label: diffDays === 0 ? 'Expires Today' : `${diffDays} days left` }
    }
    return { isExpired: false, isExpiringSoon: false, diffDays, label: `${diffDays} days left` }
  }

  const fetchInventory = () => {
    setLoading(true)
    api.get(`/business/inventory?search=${search}`)
      .then(res => {
        setItems(res.data)
        const alerts = res.data.filter(item => {
          const info = getItemExpiryInfo(item.expiry_date)
          return info.isExpired || info.isExpiringSoon
        })
        if (alerts.length > 0) {
          toast(`⚠️ Notice: ${alerts.length} item(s) are expiring soon or expired!`, { icon: '🚨', duration: 4000 })
        }
      })
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

  // Real-World Barcode Lookup logic
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
      if (res.data) {
        setScannedProduct(res.data)
        toast.success(`Found product: ${res.data.product_name}`, { icon: '📦' })
      }
    } catch (err) {
      toast.error('Failed to look up barcode')
      setScannedProduct({
        barcode: cleanCode,
        product_name: `Scanned Item (#${cleanCode.slice(-4)})`,
        category: 'Packaged Goods',
        quantity: 1,
        unit: 'kg'
      })
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
        expiry_date: scannedProduct.expiry_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      })
      toast.success(`🎉 '${scannedProduct.product_name}' saved to inventory!`)
      setScannedProduct(null)
      setBarcodeInput('')
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
      fetchInventory()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'CSV upload failed')
    } finally {
      setCsvUploading(false)
    }
  }

  // Calculate total alert count
  const warningList = items.filter(item => {
    const info = getItemExpiryInfo(item.expiry_date)
    return info.isExpired || info.isExpiringSoon
  })

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">{t('inventory')}</h1>
          <p className="page-subtitle">Manage food stock, scan barcodes, bulk import CSV & track AI urgency scores</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} /> {t('add_item')}
          </button>
        </div>
      </div>

      {/* EXPIRY ALERT BANNER NOTIFICATION */}
      {warningList.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle color="#ef4444" size={24} />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Alert: {warningList.length} Food Item(s) Expired or Expiring Soon!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Donate these items to NGOs immediately to prevent food waste.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const first = warningList[0]
              if (first) handleDonate(first)
            }}
            className="btn btn-danger btn-sm"
          >
            Donate Expiring Stock Now
          </button>
        </div>
      )}

      {/* TWO SEPARATE MEDIUM TABS ABOVE INVENTORY LIST */}
      <div style={{ marginBottom: '2rem' }}>
        {/* Tab Selection Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card-hover)', padding: '0.35rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '1.25rem', maxWidth: '540px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('barcode')}
            style={{
              flex: 1, padding: '0.65rem 1rem', borderRadius: '12px', border: 'none',
              background: activeTab === 'barcode' ? 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)' : 'transparent',
              color: activeTab === 'barcode' ? '#ffffff' : 'var(--text-primary)',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: activeTab === 'barcode' ? '0 4px 12px rgba(255,107,82,0.3)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Barcode size={18} /> Barcode Scanner Tab
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            style={{
              flex: 1, padding: '0.65rem 1rem', borderRadius: '12px', border: 'none',
              background: activeTab === 'csv' ? 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)' : 'transparent',
              color: activeTab === 'csv' ? '#ffffff' : 'var(--text-primary)',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: activeTab === 'csv' ? '0 4px 12px rgba(255,107,82,0.3)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Upload size={18} /> Bulk CSV Upload Tab
          </button>
        </div>

        {/* TWO MEDIUM CONTENT PANELS (FIXED 340px HEIGHT) */}
        <div className="grid-2">
          
          {/* TAB 1: BARCODE SCANNER MEDIUM PANEL */}
          <div
            className="card"
            style={{
              border: activeTab === 'barcode' ? '2px solid #FF6B52' : '1px solid var(--border)',
              boxShadow: activeTab === 'barcode' ? '0 10px 30px rgba(255,107,82,0.15)' : 'none',
              padding: '1.25rem',
              borderRadius: '20px',
              height: '340px',
              minHeight: '340px',
              maxHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,107,82,0.12)', color: '#FF6B52', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Barcode size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Barcode Scanner Panel</h3>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>Scan barcodes directly inside this tab</p>
                </div>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}><Sparkles size={11} /> AI Powered</span>
            </div>

            {/* LIVE CAMERA EMBEDDED INSIDE FIXED 340px TAB CARD */}
            {showCameraScanner ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <BarcodeScanner
                  inline={true}
                  onDetected={handleCameraDetected}
                  onClose={() => setShowCameraScanner(false)}
                />
              </div>
            ) : scannedProduct ? (
              /* Scanned Product Auto-Fill Form */
              <form onSubmit={handleAddScannedProduct} style={{ padding: '0.85rem', background: 'var(--bg-card-hover)', borderRadius: '14px', border: '1px solid var(--border)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FF6B52', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={15} /> Product Recognized
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Product Name *</label>
                  <input
                    type="text"
                    className="input"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                    value={scannedProduct.product_name}
                    onChange={(e) => setScannedProduct({ ...scannedProduct, product_name: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Category</label>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                      value={scannedProduct.category || 'General'}
                      onChange={(e) => setScannedProduct({ ...scannedProduct, category: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Quantity</label>
                    <input
                      type="number"
                      className="input"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                      value={scannedProduct.quantity || 1}
                      onChange={(e) => setScannedProduct({ ...scannedProduct, quantity: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Add to Inventory
                </button>
              </form>
            ) : (
              /* Idle Tab View: Camera Trigger & Manual Entry */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.85rem' }}>
                <button
                  onClick={() => setShowCameraScanner(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                >
                  <Camera size={18} /> Open Camera Scanner
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter barcode e.g. 8901058000185"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button onClick={() => handleBarcodeLookup(barcodeInput)} className="btn btn-secondary" disabled={barcodeLoading}>
                    <Search size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TAB 2: BULK CSV UPLOAD MEDIUM PANEL */}
          <div
            className="card"
            style={{
              border: activeTab === 'csv' ? '2px solid #FF6B52' : '1px solid var(--border)',
              boxShadow: activeTab === 'csv' ? '0 10px 30px rgba(255,107,82,0.15)' : 'none',
              padding: '1.25rem',
              borderRadius: '20px',
              height: '340px',
              minHeight: '340px',
              maxHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(180,43,114,0.12)', color: '#B42B72', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Bulk CSV Upload Panel</h3>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>Import batch food inventory from CSV files</p>
                </div>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Batch Import</span>
            </div>

            <form onSubmit={handleCsvUpload} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ border: '2px dashed var(--border)', borderRadius: '14px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-card-hover)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} style={{ display: 'none' }} id="tab-csv-input" />
                <label htmlFor="tab-csv-input" style={{ cursor: 'pointer', width: '100%' }}>
                  <Upload size={32} color="#FF6B52" style={{ marginBottom: '0.4rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {csvFile ? csvFile.name : 'Click to Select CSV File'}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Columns: product_name, quantity, category, unit, barcode
                  </div>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={csvUploading || !csvFile} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.75rem' }}>
                {csvUploading ? 'Uploading CSV...' : 'Import CSV into Inventory'}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* SEARCH BAR ABOVE INVENTORY LIST TABLE */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search inventory items by product name or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {/* INVENTORY LIST TABLE WITH AI URGENCY & EXPIRY BADGES */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date & Alerts</th>
              <th>AI Urgency Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('no_data')}</td></tr>
            ) : items.map((item) => {
              const expInfo = getItemExpiryInfo(item.expiry_date)
              // AI Urgency override: if expired -> 100%, if expiring soon -> Math.max(score, 85%)
              const urgencyScore = expInfo.isExpired ? 100 : expInfo.isExpiringSoon ? Math.max(item.ai_urgency_score || 0, 85) : (item.ai_urgency_score || 35)

              return (
                <tr key={item.id} style={{ background: expInfo.isExpired ? 'rgba(239,68,68,0.05)' : expInfo.isExpiringSoon ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.product_name}</div>
                    {item.barcode && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BC: {item.barcode}</div>}
                  </td>
                  <td><span className="badge badge-gray">{item.category || 'General'}</span></td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                      </div>
                      {expInfo.isExpired ? (
                        <span className="badge badge-red" style={{ fontSize: '0.7rem', width: 'fit-content' }}>
                          <AlertTriangle size={11} /> EXPIRED
                        </span>
                      ) : expInfo.isExpiringSoon ? (
                        <span className="badge badge-saffron" style={{ fontSize: '0.7rem', width: 'fit-content' }}>
                          <Clock size={11} /> {expInfo.label}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div style={{ width: '130px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                        <span>{urgencyScore}%</span>
                        <span style={{ color: urgencyScore > 70 ? '#ef4444' : urgencyScore > 40 ? '#f59e0b' : '#FF6B52' }}>
                          {urgencyScore >= 95 ? 'Critical' : urgencyScore > 70 ? 'High' : urgencyScore > 40 ? 'Med' : 'Low'}
                        </span>
                      </div>
                      <div className="urgency-bar">
                        <div
                          className={`urgency-fill ${urgencyScore > 70 ? 'urgency-high' : urgencyScore > 40 ? 'urgency-medium' : 'urgency-low'}`}
                          style={{ width: `${urgencyScore}%` }}
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
              )
            })}
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
