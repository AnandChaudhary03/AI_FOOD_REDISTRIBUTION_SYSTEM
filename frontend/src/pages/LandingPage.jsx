import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Utensils, HeartHandshake, Truck, TrendingUp, Settings2, ArrowRight, Download, Globe,
  Copy, Layers, Share2, Send, CheckCircle2, X, Sparkles, UserCheck, ShieldCheck
} from 'lucide-react'
import AnnaSetuLogo from '../components/AnnaSetuLogo'
import ThreeDBackground from '../components/ThreeDBackground'

export default function LandingPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isPwaInstalled, setIsPwaInstalled] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [demoForm, setDemoForm] = useState({ name: '', email: '', org: '', role: 'business' })
  const [demoSubmitted, setDemoSubmitted] = useState(false)

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

  const handleDemoSubmit = (e) => {
    e.preventDefault()
    setDemoSubmitted(true)
    setTimeout(() => {
      setDemoSubmitted(false)
      setDemoModalOpen(false)
    }, 2000)
  }

  const roleCards = [
    {
      id: 'business',
      role: 'business',
      title: 'Food Donors',
      subtitle: 'Hospitality, Retail',
      description: 'Easily list and schedule food surplus pickups',
      btnText: 'Donate Surplus',
      icon: Utensils,
      color: '#FF6B52'
    },
    {
      id: 'ngo',
      role: 'ngo',
      title: 'Non-Profit Partners',
      subtitle: 'NGOs, Food Banks',
      description: 'Access reliable food donations for local communities',
      btnText: 'Partner with Us',
      icon: HeartHandshake,
      color: '#B42B72'
    },
    {
      id: 'delivery',
      role: 'delivery',
      title: 'Logistics Providers',
      subtitle: 'Fleet Owners, Couriers',
      description: 'Join our network for efficient food delivery',
      btnText: 'Partner on Delivery',
      icon: Truck,
      color: '#4B176F'
    },
    {
      id: 'individual',
      role: 'individual',
      title: 'Corporate Sustainability',
      subtitle: 'ESG Teams',
      description: 'Drive impact, track waste reduction, and generate reports',
      btnText: 'Track Impact',
      icon: TrendingUp,
      color: '#35135F'
    },
    {
      id: 'admin',
      role: 'admin',
      title: 'Platform Admin',
      subtitle: 'Platform Operations',
      description: 'Manage users, optimize routes, and oversee the network',
      btnText: 'Manage Platform',
      icon: Settings2,
      color: '#FF875F'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #35135F 0%, #4B176F 25%, #B42B72 55%, #FF6B52 80%, #FF875F 100%)',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Ambient Canvas & Network Grid */}
      <ThreeDBackground />

      {/* CENTRAL WEBSITE PANEL - Exact Reference Image Composition */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          background: '#FFF8E9',
          borderRadius: '28px',
          boxShadow: '0 35px 90px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* NAVBAR */}
        <header
          style={{
            padding: '1.4rem 2.75rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            background: 'transparent'
          }}
        >
          {/* Left Brand Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AnnaSetuLogo size={38} />
          </Link>

          {/* Center/Right Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#home" style={{ textDecoration: 'none', color: '#35135F', fontWeight: 600, fontSize: '0.9rem' }}>
              Home
            </a>
            <a href="#platform" style={{ textDecoration: 'none', color: '#35135F', fontWeight: 600, fontSize: '0.9rem' }}>
              Platform
            </a>
            <a href="#impact" style={{ textDecoration: 'none', color: '#35135F', fontWeight: 600, fontSize: '0.9rem' }}>
              Impact
            </a>
            <a href="#case-studies" style={{ textDecoration: 'none', color: '#35135F', fontWeight: 600, fontSize: '0.9rem' }}>
              Case Studies
            </a>
            <a href="#pricing" style={{ textDecoration: 'none', color: '#35135F', fontWeight: 600, fontSize: '0.9rem' }}>
              Pricing
            </a>
            <a href="#resources" style={{ textDecoration: 'none', color: '#35135F', fontWeight: 600, fontSize: '0.9rem' }}>
              Resources
            </a>
          </nav>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Language Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#FFFFFF', padding: '0.38rem 0.75rem', borderRadius: '99px', border: '1px solid rgba(53,19,95,0.1)' }}>
              <Globe size={14} color="#FF6B52" />
              <select
                value={i18n.language || 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{ background: 'transparent', color: '#35135F', border: 'none', outline: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {deferredPrompt && !isPwaInstalled && (
              <button onClick={handleInstallPwa} className="btn btn-secondary btn-sm" style={{ borderRadius: '99px', fontSize: '0.8rem' }}>
                <Download size={14} /> PWA
              </button>
            )}

            <Link to="/login" style={{ textDecoration: 'none', color: '#35135F', fontWeight: 700, fontSize: '0.9rem' }}>
              Login
            </Link>

            <button
              onClick={() => setDemoModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)',
                color: '#ffffff',
                padding: '0.62rem 1.4rem',
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 107, 82, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              Request Demo
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <div style={{ padding: '2.5rem 2.75rem 3.5rem', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '3rem', alignItems: 'flex-start', position: 'relative' }}>
          
          {/* LEFT SIDE CONTENT */}
          <div style={{ paddingTop: '0.5rem' }}>
            <h1
              style={{
                fontSize: '3.5rem',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: '#35135F',
                marginBottom: '1.5rem'
              }}
            >
              AI food salvage
              <br />
              <span style={{ background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                for real-time
              </span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                redistribution.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: '#4B176F',
                lineHeight: 1.6,
                maxWidth: '460px',
                marginBottom: '2.25rem',
                opacity: 0.9
              }}
            >
              Leverage intelligence to bridge surplus food with community needs—predict, match, and deliver efficiently with our real-time, AI-driven redistribution platform.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)',
                  color: '#ffffff',
                  padding: '0.85rem 2.15rem',
                  borderRadius: '99px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 107, 82, 0.4)',
                  transition: 'all 0.25s ease'
                }}
              >
                Start Saving Food
              </button>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  color: '#35135F',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '99px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — 5 ROLE CARDS GRID & DECORATION */}
          <div style={{ position: 'relative' }}>
            
            {/* Lower Right Decorative AI Floating Network Nodes */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', width: '280px', height: '240px', pointerEvents: 'none', zIndex: 0, opacity: 0.85 }}>
              <svg width="280" height="240" viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Curved Connection Lines */}
                <path d="M40 180 C90 120, 160 210, 220 150" stroke="#FF6B52" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <path d="M80 80 C140 140, 180 60, 250 110" stroke="#B42B72" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                
                {/* Glowing Nodes */}
                <circle cx="40" cy="180" r="14" fill="rgba(255,107,82,0.2)" />
                <circle cx="40" cy="180" r="5" fill="#FF6B52" />
                
                <circle cx="160" cy="150" r="18" fill="rgba(180,43,114,0.25)" />
                <circle cx="160" cy="150" r="6" fill="#B42B72" />
                
                <circle cx="220" cy="150" r="12" fill="rgba(255,135,95,0.25)" />
                <circle cx="220" cy="150" r="4" fill="#FF875F" />

                {/* Floating Icons inside decorative nodes */}
                <text x="34" y="184" fontSize="10" fill="#ffffff">🌾</text>
                <text x="153" y="155" fontSize="12" fill="#ffffff">🍎</text>
                <text x="214" y="154" fontSize="10" fill="#ffffff">📦</text>
              </svg>
            </div>

            {/* Role Cards Container */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.15rem', position: 'relative', zIndex: 1 }}>
              {roleCards.slice(0, 4).map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(53, 19, 95, 0.08)',
                      borderRadius: '20px',
                      padding: '1.35rem 1.4rem',
                      boxShadow: '0 10px 25px rgba(53, 19, 95, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div>
                      {/* Card Header with Icon */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.65rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#35135F', lineHeight: 1.2 }}>
                            {card.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.15rem' }}>
                            {card.subtitle}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: '#4B176F', lineHeight: 1.45, marginBottom: '1.1rem', opacity: 0.95 }}>
                        {card.description}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate('/login')}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '99px',
                        background: '#FFF8E9',
                        color: '#35135F',
                        border: '1px solid rgba(53, 19, 95, 0.1)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {card.btnText}
                    </button>
                  </div>
                )
              })}

              {/* CARD 5 — Platform Admin (Centered below Row 1 & 2 matching reference layout) */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  maxWidth: '310px',
                  margin: '0 auto',
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid rgba(53, 19, 95, 0.08)',
                  borderRadius: '20px',
                  padding: '1.35rem 1.4rem',
                  boxShadow: '0 10px 25px rgba(53, 19, 95, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(255, 135, 95, 0.15)', color: '#FF875F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Settings2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#35135F', lineHeight: 1.2 }}>
                        Platform Admin
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.15rem' }}>
                        Platform Operations
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#4B176F', lineHeight: 1.45, marginBottom: '1.1rem', opacity: 0.95 }}>
                    Manage users, optimize routes, and oversee the network
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '99px',
                    background: '#FFF8E9',
                    color: '#35135F',
                    border: '1px solid rgba(53, 19, 95, 0.1)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Manage Platform
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <footer
          style={{
            padding: '1.1rem 2.75rem',
            background: '#FFF8E9',
            borderTop: '1px solid rgba(53, 19, 95, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}
        >
          {/* Left Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#35135F' }}>
            <Share2 size={16} style={{ cursor: 'pointer' }} />
            <Send size={16} style={{ cursor: 'pointer' }} />
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: '#35135F', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <Copy size={14} /> Copy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <Layers size={14} color="#B42B72" /> Visual design
            </span>
          </div>
        </footer>

      </div>

      {/* DEMO REQUEST MODAL */}
      {demoModalOpen && (
        <div className="modal-overlay" onClick={() => setDemoModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <AnnaSetuLogo size={36} />
              <button onClick={() => setDemoModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {demoSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,107,82,0.15)', color: '#FF6B52', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#35135F', marginBottom: '0.5rem' }}>Request Submitted!</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Our team will reach out shortly to schedule your demo.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#35135F', marginBottom: '0.25rem' }}>Request Platform Demo</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Experience real-time AI food salvage & redistribution in action.</p>

                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={demoForm.email}
                    onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                    placeholder="jane@organization.org"
                    className="input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Organization Name</label>
                  <input
                    type="text"
                    value={demoForm.org}
                    onChange={(e) => setDemoForm({ ...demoForm, org: e.target.value })}
                    placeholder="Food Bank / Hotel / NGO"
                    className="input"
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)',
                    color: '#ffffff',
                    padding: '0.85rem',
                    borderRadius: '99px',
                    fontWeight: 700,
                    fontSize: '0.925rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    boxShadow: '0 6px 20px rgba(255, 107, 82, 0.35)'
                  }}
                >
                  Submit Demo Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
