import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2, Heart, User, Truck, Shield, ArrowRight, Download, Globe,
  Barcode, Zap, MapPin, KeyRound, Sparkles, CheckCircle2, ChevronRight,
  Share2, Send, Copy, Layers
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

  const roleCards = [
    {
      id: 'business',
      role: 'business',
      title: 'Food Donors',
      subtitle: 'Hospitality, Retail',
      description: 'Easily list and schedule food surplus pickup',
      btnText: 'Donate Surplus',
      icon: Building2,
      color: '#ea580c'
    },
    {
      id: 'ngo',
      role: 'ngo',
      title: 'Non-Profit Partners',
      subtitle: 'NGOs, Food Banks',
      description: 'Access reliable food donations for local communities',
      btnText: 'Partner with Us',
      icon: Heart,
      color: '#7c3aed'
    },
    {
      id: 'delivery',
      role: 'delivery',
      title: 'Logistics Providers',
      subtitle: 'Fleet Owners, Couriers',
      description: 'Join our network for efficient food delivery',
      btnText: 'Partner on Delivery',
      icon: Truck,
      color: '#9333ea'
    },
    {
      id: 'individual',
      role: 'individual',
      title: 'Individual Households',
      subtitle: 'Citizens & Families',
      description: 'Claim surplus meals, track waste reduction & alerts',
      btnText: 'Claim Food',
      icon: User,
      color: '#d97706'
    },
    {
      id: 'admin',
      role: 'admin',
      title: 'Platform Admin',
      subtitle: 'Platform Operations',
      description: 'Manage users, optimize routes, and oversee network',
      btnText: 'Manage Platform',
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
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ThreeDBackground />

      {/* Main Floating Container Frame - Exact Reference Preview Design */}
      <div
        style={{
          width: '100%',
          maxWidth: '1360px',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff7f5 100%)',
          borderRadius: '32px',
          boxShadow: '0 35px 90px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Top Navbar Header */}
        <header
          style={{
            padding: '1.5rem 3rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            borderBottom: '1px solid rgba(124, 58, 237, 0.06)'
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AnnaSetuLogo size={42} />
          </Link>

          {/* Center Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#home" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
              Home
            </a>
            <a href="#platform" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
              Platform
            </a>
            <a href="#impact" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
              Impact
            </a>
            <a href="#case-studies" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
              Case Studies
            </a>
            <a href="#pricing" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
              Pricing
            </a>
            <a href="#resources" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
              Resources
            </a>
          </nav>

          {/* Right Header Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Language Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '99px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <Globe size={15} color="#ea580c" />
              <select
                value={i18n.language || 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{ background: 'transparent', color: '#0f172a', border: 'none', outline: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {deferredPrompt && !isPwaInstalled && (
              <button onClick={handleInstallPwa} className="btn btn-secondary btn-sm" style={{ borderRadius: '99px' }}>
                <Download size={14} /> PWA
              </button>
            )}

            <Link to="/login" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 700, fontSize: '0.9rem' }}>
              Login
            </Link>

            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                padding: '0.6rem 1.35rem',
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Body Layout */}
        <div style={{ padding: '3.5rem 3rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Left Column Text & CTAs */}
          <div>
            <h1
              style={{
                fontSize: '3.6rem',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                marginBottom: '1.5rem'
              }}
            >
              AI food salvage
              <br />
              <span style={{ color: '#ea580c' }}>for real-time</span>
              <br />
              <span style={{ color: '#ea580c' }}>redistribution.</span>
            </h1>

            <p
              style={{
                fontSize: '1.025rem',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '480px',
                marginBottom: '2.5rem'
              }}
            >
              Leverage intelligence to bridge surplus food with community needs — predict, match, and deliver efficiently with our real-time, AI-driven redistribution platform.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                  color: '#ffffff',
                  padding: '0.875rem 2.25rem',
                  borderRadius: '99px',
                  fontWeight: 700,
                  fontSize: '0.975rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(234, 88, 12, 0.4)',
                  transition: 'all 0.25s ease'
                }}
              >
                Start Saving Food
              </button>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '0.875rem 2rem',
                  borderRadius: '99px',
                  fontWeight: 700,
                  fontSize: '0.975rem',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s ease'
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: 5 Role Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {roleCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        {card.title}
                      </div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                        <Icon size={18} />
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {card.subtitle}
                    </div>

                    <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {card.description}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '99px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{card.btnText}</span>
                    <ChevronRight size={14} color={card.color} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Bar inside Frame */}
        <footer
          style={{
            padding: '1.25rem 3rem',
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}
        >
          {/* Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#64748b' }}>
            <Share2 size={18} style={{ cursor: 'pointer' }} />
            <Send size={18} style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
            © {new Date().getFullYear()} AnnaSetu AI Platform. All Rights Reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <Copy size={14} /> Copy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <Layers size={14} /> Visual design
            </span>
          </div>
        </footer>

      </div>
    </div>
  )
}
