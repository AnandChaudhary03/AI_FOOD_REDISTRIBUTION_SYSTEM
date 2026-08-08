import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2, Heart, User, Truck, Shield, ArrowRight, Download, Globe,
  Barcode, Zap, MapPin, KeyRound, Sparkles, CheckCircle2, TrendingUp, Leaf, ShieldCheck
} from 'lucide-react'
import AnnaSetuLogo from '../components/AnnaSetuLogo'
import { registerSW } from 'virtual:pwa-register'

export default function LandingPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isPwaInstalled, setIsPwaInstalled] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
    window.addEventListener('appinstalled', () => {
      setIsPwaInstalled(true)
      setDeferredPrompt(null)
    })
  }, [])

  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setIsPwaInstalled(true)
        }
        setDeferredPrompt(null)
      })
    }
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('annasetu_lang', lang)
  }

  const rolePortals = [
    {
      id: 'business',
      title: 'Business Dashboard',
      subtitle: 'Restaurants, hotels, supermarkets & bakeries manage stock, scan barcodes & publish expiring inventory for NGOs & individuals.',
      badge: 'Donors & Commercial',
      color: '#22c55e',
      bgGlow: 'rgba(34,197,94,0.12)',
      icon: Building2
    },
    {
      id: 'ngo',
      title: 'NGO Dashboard',
      subtitle: 'NGOs, food banks & community kitchens claim available food, view AI match scores & schedule automated pickups.',
      badge: 'NGOs & Food Banks',
      color: '#3b82f6',
      bgGlow: 'rgba(59,130,246,0.12)',
      icon: Heart
    },
    {
      id: 'individual',
      title: 'Individual User Dashboard',
      subtitle: 'Households and individuals manage home inventory, receive expiry alerts & claim free surplus food nearby.',
      badge: 'Households & Citizens',
      color: '#f59e0b',
      bgGlow: 'rgba(245,158,11,0.12)',
      icon: User
    },
    {
      id: 'delivery',
      title: 'Delivery Dashboard',
      subtitle: 'Delivery logistics partners accept pickup routes, navigate maps & complete 6-digit OTP verification upon delivery.',
      badge: 'Volunteers & Logistics',
      color: '#a855f7',
      bgGlow: 'rgba(168,85,247,0.12)',
      icon: Truck
    },
    {
      id: 'admin',
      title: 'Admin Control Center',
      subtitle: 'Platform administrators monitor real-time food analytics, verify user accounts & broadcast emergency notifications.',
      badge: 'System Governance',
      color: '#ef4444',
      bgGlow: 'rgba(239,68,68,0.12)',
      icon: Shield
    }
  ]

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Top Header Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(10, 22, 40, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.875rem 2rem'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AnnaSetuLogo size={44} />
          </Link>

          {/* Nav Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Language Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <Globe size={16} color="var(--accent-saffron)" />
              <select
                value={i18n.language || 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="en" style={{ background: '#152035' }}>English</option>
                <option value="hi" style={{ background: '#152035' }}>हिन्दी (Hindi)</option>
                <option value="ta" style={{ background: '#152035' }}>தமிழ் (Tamil)</option>
                <option value="te" style={{ background: '#152035' }}>తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* PWA Install Button */}
            {deferredPrompt && !isPwaInstalled && (
              <button onClick={handleInstallPwa} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>
                <Download size={16} /> Install PWA App
              </button>
            )}

            <Link to="/login" className="btn btn-ghost">
              {t('login')}
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Dashboard Gateway Section */}
      <section style={{ padding: '3.5rem 2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '2.5rem', alignItems: 'stretch' }}>
          
          {/* Left Hero Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(145deg, #111f3d 0%, #152545 100%)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(34,197,94,0.3)', marginBottom: '1.5rem' }}>
                <Sparkles size={14} /> AI FOOD REDISTRIBUTION PLATFORM
              </div>

              <h1 style={{ fontSize: '2.75rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Choose your dashboard.
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                AnnaSetu connects food donors, recipient organizations, delivery volunteers, and households to eliminate food waste through real-time AI urgency tracking and smart OTP verification.
              </p>
            </div>

            {/* Impact Highlights Bar inside Left Card */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.25rem', background: 'rgba(10,22,40,0.6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-green)' }}>15,400+</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>kg Food Saved</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-saffron)' }}>38,500+</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>kg CO₂ Offset</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-blue)' }}>250+</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Partners</div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" /> Select any portal on the right to access role dashboard.
              </div>
            </div>
          </div>

          {/* Right Role Gateway Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {rolePortals.map((portal) => {
              const Icon = portal.icon
              return (
                <div
                  key={portal.id}
                  className="card"
                  style={{
                    background: 'var(--gradient-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    {/* Role Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: portal.bgGlow, color: portal.color, display: 'flex', alignItems: 'center', justify: 'center' }}>
                        <Icon size={22} />
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '99px', background: portal.bgGlow, color: portal.color, border: `1px solid ${portal.color}33` }}>
                        {portal.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {portal.title}
                    </h3>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {portal.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/login')}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      justify: 'space-between',
                      borderColor: 'var(--border-light)',
                      background: 'rgba(255,255,255,0.03)'
                    }}
                  >
                    <span>OPEN PORTAL</span>
                    <ArrowRight size={14} color={portal.color} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Features & Technology Showcase */}
      <section style={{ padding: '4rem 2rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Engineered with Smart AI Logistics
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              From barcode scanning to 6-digit OTP delivery verification, AnnaSetu automates end-to-end surplus management.
            </p>
          </div>

          <div className="grid-4">
            <div className="card">
              <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', marginBottom: '1rem' }}>
                <Barcode size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Camera Barcode Scanner</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Instant webcam product lookup matching OpenFoodFacts global database with 1-click inventory addition.
              </p>
            </div>

            <div className="card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', marginBottom: '1rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Expiry Urgency Score</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Algorithmic 0–100% urgency scoring ranks expiring stock to ensure critical items get donated first.
              </p>
            </div>

            <div className="card">
              <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', marginBottom: '1rem' }}>
                <MapPin size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Geospatial NGO Matching</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Haversine distance calculation pairs nearby food donors with recipient NGOs within radius limits.
              </p>
            </div>

            <div className="card">
              <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', marginBottom: '1rem' }}>
                <KeyRound size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>6-Digit Delivery OTP</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Tamper-proof handshakes require delivery volunteers to enter a recipient OTP to complete job status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2.5rem 2rem', background: 'var(--bg-primary)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <AnnaSetuLogo size={36} />
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} AnnaSetu Platform. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-green)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }}></span>
            All API Systems Operational
          </div>
        </div>
      </footer>
    </div>
  )
}
