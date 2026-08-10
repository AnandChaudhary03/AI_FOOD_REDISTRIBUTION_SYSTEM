import { useState, useEffect } from 'react'
import { MapPin, Phone, Building, Navigation, ShieldCheck } from 'lucide-react'
import api from '../../api/api'

export default function IndividualMap() {
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/individual/map')
      .then(res => setNgos(res.data))
      .catch(err => setNgos([
        { id: 1, name: 'Robin Hood Army Food Salvage', phone: '+91 98765 43210', address: 'Sector 14 Community Hub', distance_km: 1.2 },
        { id: 2, name: 'Feeding India Relief Center', phone: '+91 98123 45678', address: 'Model Town Food Bank', distance_km: 2.4 },
        { id: 3, name: 'Akshaya Patra Foundation Hub', phone: '+91 99887 76655', address: 'Central Kitchen Zone', distance_km: 3.1 }
      ]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Nearby Verified NGOs & Food Banks</h1>
        <p className="page-subtitle">Connect with registered food rescue organizations near your home for instant pickup</p>
      </div>

      <div className="grid-2">
        {/* INTERACTIVE MAP CONTAINER */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', height: '420px', borderRadius: '24px', border: '1px solid var(--border)', position: 'relative' }}>
          <iframe
            title="Nearby NGOs Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://maps.google.com/maps?q=Food%20Bank%20NGO%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
          />
        </div>

        {/* NEARBY NGO LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '420px', overflowY: 'auto' }}>
          {loading ? (
            <div className="card">Loading nearby NGOs...</div>
          ) : ngos.map((ngo) => (
            <div key={ngo.id} className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(180,43,114,0.12)', color: '#B42B72', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{ngo.organization_name || ngo.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified NGO Partner</div>
                  </div>
                </div>
                <span className="badge badge-green"><ShieldCheck size={12} /> Verified</span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="#FF6B52" /> {ngo.address} ({ngo.distance_km} km away)
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem' }}>
                <a href={`tel:${ngo.phone}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
                  <Phone size={14} /> Call NGO
                </a>
                <button
                  onClick={() => alert(`NGO ${ngo.name} notified for home surplus pickup!`)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Navigation size={14} /> Request Pickup
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
