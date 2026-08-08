import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2, Heart, User, Truck, Shield, ArrowRight, Download, Globe,
  Barcode, Zap, MapPin, KeyRound, Sparkles, CheckCircle2, Star, Clock,
  ChevronRight, PlayCircle, MessageSquare
} from 'lucide-react'
import AnnaSetuLogo from '../components/AnnaSetuLogo'

export default function LandingPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isPwaInstalled, setIsPwaInstalled] = useState(false)
  const [activePortal, setActivePortal] = useState('business')

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
      title: 'Business Donor Portal',
      subtitle: 'Restaurants, hotels & supermarkets manage stock & scan barcodes.',
      badge: 'Commercial Donors',
      icon: Building2,
      color: '#f97316'
    },
    {
      id: 'ngo',
      title: 'NGO Recipient Portal',
      subtitle: 'Food banks & shelters claim available food & schedule automated pickups.',
      badge: 'NGOs & Food Banks',
      icon: Heart,
      color: '#7c3aed'
    },
    {
      id: 'individual',
      title: 'Household Portal',
      subtitle: 'Individuals manage home inventory & claim surplus meals nearby.',
      badge: 'Citizens & Households',
      icon: User,
      color: '#f59e0b'
    },
    {
      id: 'delivery',
      title: 'Logistics Rider Portal',
      subtitle: 'Volunteers accept pickup routes & complete 6-digit OTP handshakes.',
      badge: 'Logistics Partners',
      icon: Truck,
      color: '#9333ea'
    },
    {
      id: 'admin',
      title: 'Admin Control Center',
      subtitle: 'System governance, user verification & live impact analytics.',
      badge: 'Governance',
      icon: Shield,
      color: '#dc2626'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 25%, #ea580c 75%, #f97316 100%)',
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Main Floating Container Frame - Exact Reference Image Aesthetic */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          background: '#fff7f5',
          borderRadius: '36px',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          position: 'relative'
        }}
      >
        {/* Top Header Navbar */}
        <header
          style={{
            padding: '1.75rem 3.5rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            background: 'transparent'
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AnnaSetuLogo size={42} />
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.925rem' }}>
              How it works
            </a>
            <a href="#portals" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.925rem' }}>
              Role Portals
            </a>
            <a href="#features" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.925rem' }}>
              AI Features
            </a>
            <a href="#impact" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.925rem' }}>
              Impact & Stats
            </a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff', padding: '0.45rem 0.85rem', borderRadius: '99px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <Globe size={16} color="#7c3aed" />
              <select
                value={i18n.language || 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{ background: 'transparent', color: '#0f172a', border: 'none', outline: 'none', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* PWA Button */}
            {deferredPrompt && !isPwaInstalled && (
              <button onClick={handleInstallPwa} className="btn btn-secondary btn-sm" style={{ borderRadius: '99px' }}>
                <Download size={15} /> PWA App
              </button>
            )}

            <button
              onClick={() => navigate('/login')}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              <User size={18} color="#0f172a" />
            </button>

            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)',
                color: '#ffffff',
                padding: '0.65rem 1.4rem',
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(124, 58, 237, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </header>

        {/* Hero Section Layout */}
        <section style={{ padding: '2.5rem 3.5rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Hero Content */}
            <div>
              <h1
                style={{
                  fontSize: '3.75rem',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#0f172a',
                  marginBottom: '1.5rem'
                }}
              >
                <span style={{ color: '#7c3aed' }}>AI analysis</span>{' '}
                <span style={{ color: '#f97316' }}>for real-time</span>
                <br />
                food redistribution
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#64748b',
                  lineHeight: 1.65,
                  maxWidth: '520px',
                  marginBottom: '2.5rem'
                }}
              >
                AnnaSetu records surplus food inventory, calculates AI expiry urgency scores, matches local recipient NGOs, and coordinates OTP-verified deliveries — all without manual overhead.
              </p>

              {/* Action Pill Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)',
                    color: '#ffffff',
                    padding: '0.9rem 2.25rem',
                    borderRadius: '99px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                    <ArrowRight size={14} color="#ffffff" />
                  </div>
                  <span>Start for free</span>
                </button>

                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '0.9rem 2rem',
                    borderRadius: '99px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Choose Portal
                </button>
              </div>

              {/* Bullet Features */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed' }}></span> Real-time AI Match
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f97316' }}></span> 6-Digit OTP Verification
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }}></span> Barcode Scanner
                </span>
              </div>
            </div>

            {/* Right Interactive Mockup Showcase (Exact Reference Image Multi-Card Layout) */}
            <div style={{ position: 'relative', width: '100%', height: '540px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
              
              {/* Main Central Mobile Dashboard Widget */}
              <div
                style={{
                  width: '310px',
                  background: '#090d16',
                  borderRadius: '32px',
                  padding: '1.75rem 1.5rem',
                  boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
                  border: '1px solid #1e293b',
                  position: 'relative',
                  zIndex: 2,
                  color: '#ffffff'
                }}
              >
                {/* Header Widget */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>End-of-Expiry Alert</div>
                    <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Surplus Food Batch #1092</div>
                  </div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem' }}>
                    •••
                  </div>
                </div>

                {/* Animated Wave Graph Bar */}
                <div style={{ height: '70px', display: 'flex', alignItems: 'flex-end', gap: '5px', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
                  {[40, 65, 30, 85, 95, 60, 45, 75, 90, 55, 80, 100, 65, 40].map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: '4px',
                        background: idx % 2 === 0 ? 'linear-gradient(to top, #7c3aed, #f97316)' : 'rgba(255,255,255,0.15)'
                      }}
                    />
                  ))}
                </div>

                {/* Live Urgency Status Pill */}
                <div style={{ background: '#131c31', borderRadius: '16px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Clock size={16} color="#f97316" />
                    <span>00:05:39</span>
                  </div>
                  <span style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.725rem', fontWeight: 800 }}>
                    Analysing...
                  </span>
                </div>

                {/* Bottom Control Play */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffffff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyCenter: 'center', boxShadow: '0 6px 20px rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                    <PlayCircle size={26} color="#0f172a" />
                  </div>
                </div>
              </div>

              {/* Floating Toast Notification Card (Overlay on Right) */}
              <div
                style={{
                  position: 'absolute',
                  top: '18%',
                  right: '0%',
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '1.15rem 1.35rem',
                  boxShadow: '0 20px 50px rgba(124, 58, 237, 0.15)',
                  border: '1px solid #e2e8f0',
                  width: '260px',
                  zIndex: 3,
                  animation: 'float-3d-slow 6s ease-in-out infinite alternate'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #f97316)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>
                      AI
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>AnnaSetu Match</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.725rem', fontWeight: 700 }}>
                    <Star size={12} fill="#f59e0b" /> 5.0/5.0
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600, lineHeight: 1.45 }}>
                  50 kg fresh meals available nearby! Pickup route dispatched.
                </p>
              </div>

              {/* 4 Floating Role Avatars (Positioned Around Mockup) */}
              {/* Top Left: Business Avatar */}
              <div
                style={{
                  position: 'absolute',
                  top: '6%',
                  left: '6%',
                  background: '#ffffff',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  zIndex: 3
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(249,115,22,0.15)', color: '#f97316', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Restaurant Donor</div>
                  <div style={{ fontSize: '0.68rem', color: '#f97316', fontWeight: 700 }}>● Active Stock</div>
                </div>
              </div>

              {/* Top Right: NGO Recipient Avatar */}
              <div
                style={{
                  position: 'absolute',
                  top: '4%',
                  right: '12%',
                  background: '#ffffff',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  zIndex: 3
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(124,58,237,0.15)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <Heart size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Food Bank NGO</div>
                  <div style={{ fontSize: '0.68rem', color: '#7c3aed', fontWeight: 700 }}>● Claimed 120 Meals</div>
                </div>
              </div>

              {/* Bottom Left: Delivery Volunteer Avatar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8%',
                  left: '8%',
                  background: '#ffffff',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  zIndex: 3
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(147,51,234,0.15)', color: '#9333ea', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Express Rider</div>
                  <div style={{ fontSize: '0.68rem', color: '#9333ea', fontWeight: 700 }}>● Verified OTP</div>
                </div>
              </div>

              {/* Bottom Right: Household Beneficiary Avatar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '6%',
                  right: '6%',
                  background: '#ffffff',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  zIndex: 3
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Household User</div>
                  <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700 }}>● Expiry Alert On</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5 Interactive Role Portals Section */}
        <section id="portals" style={{ padding: '3.5rem 3.5rem 4rem', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '1rem' }}>
              CHOOSE YOUR ROLE DASHBOARD
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>
              Multi-portal system for every stakeholder.
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.975rem' }}>
              Whether you are a commercial donor, recipient food bank, volunteer rider, or individual family — AnnaSetu provides a dedicated experience.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {rolePortals.map((portal) => {
              const Icon = portal.icon
              return (
                <div
                  key={portal.id}
                  className="card"
                  style={{
                    background: '#fff7f5',
                    border: '1px solid #e2e8f0',
                    borderRadius: '24px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: `${portal.color}18`, color: portal.color, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                        <Icon size={24} />
                      </div>
                      <span style={{ fontSize: '0.725rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '99px', background: '#ffffff', color: portal.color, border: `1px solid ${portal.color}33`, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        {portal.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
                      {portal.title}
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.55, marginBottom: '1.75rem' }}>
                      {portal.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '99px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <span>OPEN PORTAL</span>
                    <ChevronRight size={16} color={portal.color} />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Partner & Impact Banner Footer (Matching Reference Image) */}
        <footer style={{ padding: '2.5rem 3.5rem', background: '#fff7f5', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Powering food redistribution across 250+ partners — 15,400+ kg food saved
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', opacity: 0.8, fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em', fontSize: '1.1rem' }}>
            <div>SHELLS</div>
            <div>SmartFinder</div>
            <div>Zoomerr</div>
            <div>kontrastr</div>
            <div>WAVESMARATHON</div>
          </div>
        </footer>

      </div>
    </div>
  )
}
