import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Barcode, Camera, Upload, CheckCircle, Search, AlertCircle } from 'lucide-react'
import BarcodeScanner from '../../components/BarcodeScanner'
import api from '../../api/api'

export default function BusinessBarcode() {
  const { t } = useTranslation()
  const [showScanner, setShowScanner] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState('')
  const [scannedProduct, setScannedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [csvUploading, setCsvUploading] = useState(false)

  const handleLookup = async (code) => {
    const cleanCode = code ? code.trim() : ''
    if (!cleanCode) {
      toast.error('Please enter or scan a barcode')
      return
    }
    setLoading(true)
    setScannedProduct(null)
    try {
      const res = await api.get(`/business/barcode/${cleanCode}`)
      if (res.data && res.data.found) {
        setScannedProduct(res.data)
        toast.success(`Found product: ${res.data.product_name}`)
      } else {
        toast('Barcode not found online/db. Please enter product name to save it.', { icon: '📝' })
        setScannedProduct({ barcode: cleanCode, product_name: '', category: 'General', quantity: 1, unit: 'kg' })
      }
    } catch (err) {
      toast('Please enter product details below to register this barcode.', { icon: '📝' })
      setScannedProduct({ barcode: cleanCode, product_name: '', category: 'General', quantity: 1, unit: 'kg' })
    } finally {
      setLoading(false)
    }
  }

  const handleDetected = (code) => {
    setShowScanner(false)
    setBarcodeInput(code)
    handleLookup(code)
  }

  const handleAddProduct = async (e) => {
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
      toast.success('Product saved to inventory!')
      setScannedProduct(null)
      setBarcodeInput('')
    } catch (err) {
      toast.error('Failed to add to inventory')
    }
  }

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
    } catch (err) {
      toast.error(err.response?.data?.detail || 'CSV upload failed')
    } finally {
      setCsvUploading(false)
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('barcode')}</h1>
        <p className="page-subtitle">Real-time camera barcode scanner & CSV bulk upload</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Real-time Barcode Scanner Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="stat-icon" style={{ background: 'var(--accent-green-glow)', color: 'var(--accent-green)' }}>
              <Barcode size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700 }}>Scan Product Barcode</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Use camera or enter barcode manually</p>
            </div>
          </div>

          <button onClick={() => setShowScanner(true)} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Camera size={20} /> Open Camera Scanner
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Enter barcode e.g. 8901058000185"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="input"
            />
            <button onClick={() => handleLookup(barcodeInput)} className="btn btn-secondary" disabled={loading}>
              <Search size={18} />
            </button>
          </div>

          {/* Product Result Preview */}
          {scannedProduct && (
            <form onSubmit={handleAddProduct} style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.75rem' }}>
                {scannedProduct.found ? '✅ Product Recognized' : '📝 Register New Barcode'}
              </h4>
              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label className="input-label">Product Name *</label>
                <input
                  type="text"
                  className="input"
                  value={scannedProduct.product_name}
                  onChange={(e) => setScannedProduct({ ...scannedProduct, product_name: e.target.value })}
                  placeholder="e.g. Fresh Bread or Milk 1L"
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
                    placeholder="Dairy / Bakery"
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

        {/* CSV Bulk Upload Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              <Upload size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700 }}>Bulk CSV Upload</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Import multiple inventory items from a CSV file</p>
            </div>
          </div>

          <form onSubmit={handleCsvUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
              <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} style={{ display: 'none' }} id="csv-input" />
              <label htmlFor="csv-input" style={{ cursor: 'pointer' }}>
                <Upload size={32} color="var(--accent-saffron)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 600 }}>{csvFile ? csvFile.name : 'Click to upload CSV'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required columns: product_name, quantity</div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={csvUploading || !csvFile} style={{ justifyContent: 'center' }}>
              {csvUploading ? 'Uploading...' : 'Upload & Import Inventory'}
            </button>
          </form>

          {/* Sample CSV Download format reference */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Sample CSV Format:
            </div>
            <pre style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '4px' }}>
{`product_name,category,quantity,unit,expiry_date,barcode
Milk 1L,Dairy,20,litre,2026-08-10,8901262010012
Whole Bread,Bakery,15,packets,2026-08-05,8901058000185`}
            </pre>
          </div>
        </div>
      </div>

      {showScanner && (
        <BarcodeScanner onDetected={handleDetected} onClose={() => setShowScanner(false)} />
      )}
    </div>
  )
}
