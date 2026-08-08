import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2, Heart, User, Truck, Shield, ArrowRight, Download, Globe,
  Barcode, Zap, MapPin, KeyRound, Sparkles, CheckCircle2
} from 'lucide-react'
import AnnaSetuLogo from '../components/AnnaSetuLogo'
import ThreeDBackground from '../components/ThreeDBackground'

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

  // 5 Role Portals styled matching reference image card aesthetics
  const rolePortals = [
    {
      id: 'business',
      title: 'Business Dashboard',
      subtitle: 'Restaurants, hotels, supermarkets & bakeries manage stock, scan barcodes & publish expiring inventory for NGOs & individuals.',
      badge: 'Donors & Commercial',
      accentColor: '#f97316',
      iconBg: 'rgba(249, 115, 22, 0.12)',
      icon: Building2
    },
    {
      id: 'ngo',
      title: 'NGO Dashboard',
      subtitle: 'NGOs, food banks & community kitchens claim available food, view AI match scores & schedule automated pickups.',
      badge: 'NGOs & Food Banks',
      accentColor: '#7c3aed',
      iconBg: 'rgba(124, 58, 237, 0.12)',
      icon: Heart
    },
    {
      id: 'individual',
      title: 'Individual User Dashboard',
      subtitle: 'Households and individuals manage home inventory, receive expiry alerts & claim free surplus food nearby.',
      badge: 'Households & Citizens',
      accentColor: '#f59e0b',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      icon: User
    },
    {
      id: 'delivery',
      title: 'Delivery Dashboard',
      subtitle: 'Delivery logistics partners accept pickup routes, navigate maps & complete 6-digit OTP verification upon delivery.',
      badge: 'Volunteers & Logistics',
      accentColor: '#9333ea',
      iconBg: 'rgba(147, 51, 234, 0.12)',
      icon: Truck
    },
    {
      id: 'admin',
      title: 'Admin Control Center',
      subtitle: 'Platform administrators monitor real-time food analytics, verify user accounts & broadcast emergency notifications.',
      badge: 'System Governance',
      accentColor: '#dc2626',
      iconBg: 'rgba(220, 38, 38, 0.12)',
      icon: Shield
    }
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ThreeDBackground />

      {/* Main Floating App Frame Container (Reference Image Design) */}
      <div className="app-container-frame">

        {/* Top Header Navbar */}
        <header
          style={{
            padding: '1.25rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            borderBottom: '1px solid rgba(124, 58, 237, 0.08)'
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AnnaSetuLogo size={44} />
          </Link>

          {/* Navigation Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', padding: '0.45rem 0.85rem', borderRadius: '99px', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <Globe size={16} color="var(--accent-purple)" />
              <select
                value={i18n.language || 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', outline: 'none', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* PWA Install Button */}
            {deferredPrompt && !isPwaInstalled && (
              <button onClick={handleInstallPwa} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>
                <Download size={16} /> Install PWA App
              </button>
            )}

            <Link to="/login" className="btn btn-ghost" style={{ borderRadius: '99px' }}>
              {t('login')}
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </header>

        {/* Main Hero & Gateway Grid Section */}
        <section style={{ padding: '3.5rem 2.5rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '2.5rem', alignItems: 'stretch' }}>
            
            {/* Left Hero Card */}
            <div
              className="card"
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.75rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                boxShadow: '0 15px 40px rgba(124, 58, 237, 0.08)'
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.1)', color: 'var(--accent-purple)', padding: '0.45rem 0.9rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid rgba(124,58,237,0.2)', marginBottom: '1.5rem' }}>
                  <Sparkles size={14} /> AI FOOD REDISTRIBUTION PLATFORM
                </div>

                <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  AI food salvage for <span style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>real-time redistribution</span>.
                </h1>

                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  AnnaSetu connects surplus food donors, recipient organizations, delivery partners, and households through AI urgency scoring and 6-digit OTP verification.
                </p>
              </div>

              {/* Impact Stats */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.25rem', background: '#fff7f5', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-saffron)' }}>15,400+</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>kg Food Saved</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-purple)' }}>38,500+</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>kg CO₂ Offset</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b' }}>250+</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Partners</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-purple)" /> Select any portal on the right to enter role dashboard.
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
                      background: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>
                      {/* Role Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: portal.iconBg, color: portal.accentColor, display: 'flex', alignItems: 'center', justify: 'center' }}>
                          <Icon size={22} />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '99px', background: portal.iconBg, color: portal.accentColor, border: `1px solid ${portal.accentColor}33` }}>
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
                        borderRadius: '99px',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <span>OPEN PORTAL</span>
                      <ArrowRight size={14} color={portal.accentColor} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* AI Features & Technology Showcase */}
        <section style={{ padding: '4rem 2.5rem', background: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Engineered with Smart AI Logistics
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                From barcode scanning to 6-digit OTP delivery verification, AnnaSetu automates end-to-end surplus management.
              </p>
            </div>

            <div className="grid-4">
              <div className="card">
                <div className="stat-icon" style={{ background: 'rgba(249,115,22,0.12)', color: '#ea580c', marginBottom: '1rem' }}>
                  <Barcode size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Camera Barcode Scanner</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Instant webcam product lookup matching OpenFoodFacts global database with 1-click inventory addition.
                </p>
              </div>

              <div className="card">
                <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#d97706', marginBottom: '1rem' }}>
                  <Zap size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Expiry Urgency Score</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Algorithmic 0–100% urgency scoring ranks expiring stock to ensure critical items get donated first.
                </p>
              </div>

              <div className="card">
                <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed', marginBottom: '1rem' }}>
                  <MapPin size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Geospatial NGO Matching</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Haversine distance calculation pairs nearby food donors with recipient NGOs within radius limits.
                </p>
              </div>

              <div className="card">
                <div className="stat-icon" style={{ background: 'rgba(147,51,234,0.12)', color: '#9333ea', marginBottom: '1rem' }}>
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
        <footer style={{ padding: '2.5rem', background: '#fff7f5', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <AnnaSetuLogo size={36} />
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} AnnaSetu Platform. All Rights Reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }}></span>
              All API Systems Operational
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
