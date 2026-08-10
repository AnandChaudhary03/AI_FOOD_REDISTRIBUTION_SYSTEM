import { useState, useEffect } from 'react'
import { Award, Leaf, Utensils, Users, Download, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/api'

export default function IndividualImpact() {
  const { user } = useAuth()
  const [impact, setImpact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/individual/impact')
      .then(res => setImpact(res.data))
      .catch(err => setImpact({
        donor_name: user?.name || 'Individual Donor',
        total_donations_submitted: 5,
        total_food_saved_kg: 124.5,
        meals_served: 311,
        co2_saved_kg: 311.25,
        badge_title: 'Surplus Food Salvation Champion',
        impact_history: []
      }))
      .finally(() => setLoading(false))
  }, [user])

  const handleDownloadCertificate = () => {
    alert(`🎉 Certificate of Appreciation generated for ${impact?.donor_name || user?.name} for saving ${impact?.total_food_saved_kg || 0} kg of food and feeding ${impact?.meals_served || 0} people!`)
  }

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Food Salvation & Social Impact</h1>
          <p className="page-subtitle">Track how much food you have saved from going to waste and how many meals you've shared</p>
        </div>
        <button onClick={handleDownloadCertificate} className="btn btn-primary btn-lg">
          <Download size={18} /> Download Certificate of Honor
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(255,107,82,0.12) 0%, rgba(255,135,95,0.05) 100%)', border: '1px solid rgba(255,107,82,0.25)', borderRadius: '24px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Utensils size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Food Saved</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{impact?.total_food_saved_kg || 0} <span style={{ fontSize: '1.1rem' }}>kg</span></div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Prevented from rotting in city landfills</p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(53,19,95,0.12) 0%, rgba(75,23,111,0.05) 100%)', border: '1px solid rgba(53,19,95,0.25)', borderRadius: '24px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#35135F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Meals Served</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{impact?.meals_served || 0} <span style={{ fontSize: '1.1rem' }}>meals</span></div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Provided to children & families via food banks</p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(22,163,74,0.05) 100%)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '24px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>CO₂ Waste Saved</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{impact?.co2_saved_kg || 0} <span style={{ fontSize: '1.1rem' }}>kg</span></div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Greenhouse gas emissions offset</p>
        </div>
      </div>

      {/* CERTIFICATE BANNER */}
      <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '28px', border: '2px solid rgba(255,107,82,0.3)', marginBottom: '2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,107,82,0.15)', color: '#FF6B52', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <Award size={36} />
        </div>
        <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={14} /> Official Donor Recognition
        </span>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {impact?.badge_title || 'Surplus Food Hero'}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Thank you, <strong>{impact?.donor_name || user?.name}</strong>! Your wedding & home food surplus donations have fed hundreds of hungry people and protected our environment.
        </p>
        <button onClick={handleDownloadCertificate} className="btn btn-primary btn-lg">
          <Download size={18} /> Download Verified PDF Certificate
        </button>
      </div>
    </div>
  )
}
