import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Radio, Key, Plus, Trash2, Copy, RefreshCw, CheckCircle2, Cpu, Zap, Code, ShieldCheck, ShoppingCart } from 'lucide-react'
import api from '../../api/api'

export default function PosIntegration() {
  const { t } = useTranslation()
  const [apiKeys, setApiKeys] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('keys') // 'keys', 'simulator', 'docs', 'logs'
  
  // New Key Form
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('Square Register #1')
  const [posProvider, setPosProvider] = useState('Square')
  const [generatedKey, setGeneratedKey] = useState(null)

  // POS Simulator State
  const [simProvider, setSimProvider] = useState('Square')
  const [simApiKey, setSimApiKey] = useState('')
  const [simItemName, setSimItemName] = useState('Organic Whole Milk 1L')
  const [simBarcode, setSimBarcode] = useState('8901030800012')
  const [simQty, setSimQty] = useState(2)
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState(null)

  const fetchPosData = async () => {
    try {
      const [keysRes, logsRes] = await Promise.all([
        api.get('/pos/api-keys').catch(() => ({ data: [] })),
        api.get('/pos/logs').catch(() => ({ data: [] }))
      ])
      setApiKeys(keysRes.data || [])
      setLogs(logsRes.data || [])
      if (keysRes.data && keysRes.data.length > 0) {
        setSimApiKey(keysRes.data[0].api_key)
      }
    } catch (err) {
      toast.error('Failed to load POS integration data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosData()
  }, [])

  const handleGenerateKey = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/pos/api-keys', {
        name: newKeyName,
        pos_provider: posProvider
      })
      toast.success('POS API Key generated!')
      setGeneratedKey(res.data)
      fetchPosData()
    } catch (err) {
      toast.error('Failed to generate POS API key')
    }
  }

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this POS API key?')) return
    try {
      await api.delete(`/pos/api-keys/${keyId}`)
      toast.success('POS API Key revoked')
      fetchPosData()
    } catch (err) {
      toast.error('Failed to revoke API key')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleRunSimulator = async (e) => {
    e.preventDefault()
    if (!simApiKey) return toast.error('Generate or select a POS API Key first!')
    setSimulating(true)
    setSimResult(null)

    try {
      const res = await api.post(
        '/pos/sync-sale',
        {
          pos_provider: simProvider,
          register_id: 'REG-SIMULATOR',
          items: [
            {
              barcode: simBarcode,
              product_name: simItemName,
              quantity_sold: parseFloat(simQty)
            }
          ]
        },
        {
          headers: { 'X-API-Key': simApiKey }
        }
      )
      setSimResult(res.data)
      toast.success('POS Sale transaction synced successfully!')
      fetchPosData()
    } catch (err) {
      setSimResult({
        error: true,
        detail: err.response?.data?.detail || 'POS Sync Failed. Check X-API-Key header.'
      })
      toast.error('POS Sync simulation failed')
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Radio color="#FF6B52" size={28} /> POS System Integration Portal
          </h1>
          <p className="page-subtitle">Sync third-party Point of Sale systems (Square, Toast, Clover, Custom POS) for real-time inventory deductions</p>
        </div>
        <button onClick={() => { setShowKeyModal(true); setGeneratedKey(null); }} className="btn btn-primary">
          <Plus size={16} /> Generate POS API Key
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,107,82,0.15)', color: '#FF6B52' }}>
            <Key size={24} />
          </div>
          <div>
            <div className="stat-label">Active POS Keys</div>
            <div className="stat-value">{apiKeys.filter(k => k.is_active).length} Keys</div>
            <div className="stat-sub">Authenticates REST API</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="stat-label">Live Sync Status</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', color: '#22c55e' }}>🟢 Connected</div>
            <div className="stat-sub">Real-Time Stock Auto-Deduct</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
            <Cpu size={24} />
          </div>
          <div>
            <div className="stat-label">Supported Hardware</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>Square, Toast, Clover</div>
            <div className="stat-sub">& Custom REST APIs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div className="stat-label">Total Sync Events</div>
            <div className="stat-value">{logs.length} Events</div>
            <div className="stat-sub">Last 50 POS Checkouts</div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('keys')}
          className={`btn btn-sm ${activeTab === 'keys' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Key size={14} /> API Key Management
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`btn btn-sm ${activeTab === 'simulator' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Zap size={14} /> Live POS Simulator
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`btn btn-sm ${activeTab === 'docs' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Code size={14} /> API Guide & cURL Samples
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <RefreshCw size={14} /> POS Audit Logs
        </button>
      </div>

      {/* TAB 1: API KEYS LIST */}
      {activeTab === 'keys' && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Key Name</th>
                <th>POS Provider</th>
                <th>API Key Token</th>
                <th>Status</th>
                <th>Last Used</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading POS keys...</td></tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>No POS API Keys generated yet</div>
                    <button onClick={() => setShowKeyModal(true)} className="btn btn-primary btn-sm">
                      <Plus size={14} /> Generate First POS API Key
                    </button>
                  </td>
                </tr>
              ) : apiKeys.map((key) => (
                <tr key={key.id}>
                  <td style={{ fontWeight: 700 }}>{key.name}</td>
                  <td>
                    <span className="badge badge-purple" style={{ fontWeight: 700 }}>
                      {key.pos_provider}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <code style={{ background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', color: '#FFD166' }}>
                        {key.api_key.substring(0, 16)}...
                      </code>
                      <button onClick={() => copyToClipboard(key.api_key)} className="btn btn-ghost btn-sm" title="Copy Key">
                        <Copy size={12} />
                      </button>
                    </div>
                  </td>
                  <td>
                    {key.is_active ? (
                      <span className="badge badge-green"><CheckCircle2 size={12} /> Active</span>
                    ) : (
                      <span className="badge badge-red">Revoked</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{key.last_used_at}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{key.created_at}</td>
                  <td>
                    {key.is_active && (
                      <button onClick={() => handleRevokeKey(key.id)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        <Trash2 size={12} /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: LIVE POS SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap color="#FF6B52" size={20} /> Live POS Register Checkout Simulator
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Simulate a live Point of Sale transaction checkout. The system will match stock by Barcode or Product Name and automatically deduct sold quantities from your AnnaSetu business inventory.
          </p>

          <form onSubmit={handleRunSimulator} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">POS Provider</label>
                <select className="input" value={simProvider} onChange={(e) => setSimProvider(e.target.value)}>
                  <option value="Square">Square POS</option>
                  <option value="Toast">Toast POS</option>
                  <option value="Clover">Clover POS</option>
                  <option value="Custom POS">Custom REST POS</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Select API Key for Auth</label>
                <select className="input" value={simApiKey} onChange={(e) => setSimApiKey(e.target.value)} required>
                  <option value="">-- Choose POS API Key --</option>
                  {apiKeys.filter(k => k.is_active).map(k => (
                    <option key={k.id} value={k.api_key}>{k.name} ({k.pos_provider})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-3">
              <div className="input-group">
                <label className="input-label">Product Name to Sell</label>
                <input type="text" className="input" value={simItemName} onChange={(e) => setSimItemName(e.target.value)} required />
              </div>

              <div className="input-group">
                <label className="input-label">Barcode (Optional)</label>
                <input type="text" className="input" value={simBarcode} onChange={(e) => setSimBarcode(e.target.value)} placeholder="8901030800012" />
              </div>

              <div className="input-group">
                <label className="input-label">Quantity Sold</label>
                <input type="number" step="0.1" className="input" value={simQty} onChange={(e) => setSimQty(e.target.value)} required min="0.1" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={simulating} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {simulating ? 'Syncing POS Checkout...' : '🚀 Fire POS Sale Checkout (Auto-Deduct Stock)'}
            </button>
          </form>

          {simResult && (
            <div style={{ marginTop: '1.5rem', background: simResult.error ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: simResult.error ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontWeight: 800, color: simResult.error ? '#f87171' : '#4ade80', marginBottom: '0.5rem' }}>
                {simResult.error ? '❌ POS Checkout Sync Failed' : '✅ POS Checkout Synced Successfully'}
              </div>
              <pre style={{ fontSize: '0.825rem', overflowX: 'auto', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', color: 'var(--text-primary)' }}>
                {JSON.stringify(simResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: API DOCS & CURL SAMPLES */}
      {activeTab === 'docs' && (
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code color="#FF6B52" size={20} /> REST API Integration Reference & cURL Samples
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Connect any Point of Sale hardware, mobile register, or custom backend to AnnaSetu via our high-speed REST API endpoints.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Endpoint 1 */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-green" style={{ fontWeight: 900 }}>POST</span>
                <code style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFD166' }}>/api/v1/pos/sync-sale</code>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Fired when a checkout occurs at your POS register. Automatically deducts sold quantities from stock levels.
              </p>
              <div style={{ position: 'relative' }}>
                <pre style={{ background: '#0a1628', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto', color: '#4ade80' }}>
{`curl -X POST "https://api.annasetu.org/pos/sync-sale" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: pos_live_your_secret_key_here" \\
  -d '{
    "pos_provider": "Square",
    "register_id": "REG-01",
    "items": [
      { "barcode": "8901030800012", "product_name": "Organic Whole Milk 1L", "quantity_sold": 2 }
    ]
  }'`}
                </pre>
                <button onClick={() => copyToClipboard(`curl -X POST "https://api.annasetu.org/pos/sync-sale" -H "Content-Type: application/json" -H "X-API-Key: pos_live_your_secret_key_here" -d '{"pos_provider":"Square","register_id":"REG-01","items":[{"barcode":"8901030800012","product_name":"Organic Whole Milk 1L","quantity_sold":2}]}'`)} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <Copy size={12} /> Copy
                </button>
              </div>
            </div>

            {/* Endpoint 2 */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-blue" style={{ fontWeight: 900 }}>POST</span>
                <code style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFD166' }}>/api/v1/pos/sync-inventory</code>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Batch update or insert POS inventory catalog into AnnaSetu.
              </p>
              <div style={{ position: 'relative' }}>
                <pre style={{ background: '#0a1628', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto', color: '#60a5fa' }}>
{`curl -X POST "https://api.annasetu.org/pos/sync-inventory" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: pos_live_your_secret_key_here" \\
  -d '{
    "pos_provider": "Toast",
    "items": [
      { "product_name": "Fresh Croissant Batch", "category": "Bakery", "quantity": 30, "unit": "pieces", "expiry_date": "2026-08-15" }
    ]
  }'`}
                </pre>
                <button onClick={() => copyToClipboard(`curl -X POST "https://api.annasetu.org/pos/sync-inventory" -H "Content-Type: application/json" -H "X-API-Key: pos_live_your_secret_key_here" -d '{"pos_provider":"Toast","items":[{"product_name":"Fresh Croissant Batch","category":"Bakery","quantity":30,"unit":"pieces","expiry_date":"2026-08-15"}]}'`)} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <Copy size={12} /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>POS Hardware Provider</th>
                <th>Items Synced</th>
                <th>Details</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No POS sync audit logs recorded yet</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className="badge badge-purple" style={{ fontWeight: 800 }}>
                      {log.event_type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{log.pos_provider}</td>
                  <td><strong>{log.items_synced}</strong> items</td>
                  <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
                  <td><span className="badge badge-green"><CheckCircle2 size={12} /> {log.status}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GENERATE KEY MODAL */}
      {showKeyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Generate New POS API Key</h3>
            {generatedKey ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle2 size={40} color="#22c55e" style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontWeight: 800 }}>POS API Key Ready!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                  Copy your secret API Key below. Include it in the <code>X-API-Key</code> HTTP header when connecting your POS:
                </p>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', color: '#FFD166', fontFamily: 'monospace', margin: '1rem 0', wordBreak: 'break-all' }}>
                  {generatedKey.api_key}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => copyToClipboard(generatedKey.api_key)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <Copy size={14} /> Copy API Key
                  </button>
                  <button onClick={() => setShowKeyModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Key Description Name</label>
                  <input
                    type="text"
                    className="input"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Square Register #1 Main Store"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">POS Provider</label>
                  <select className="input" value={posProvider} onChange={(e) => setPosProvider(e.target.value)}>
                    <option value="Square">Square POS</option>
                    <option value="Toast">Toast POS</option>
                    <option value="Clover">Clover POS</option>
                    <option value="Custom POS">Custom REST POS System</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowKeyModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Generate Key</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
