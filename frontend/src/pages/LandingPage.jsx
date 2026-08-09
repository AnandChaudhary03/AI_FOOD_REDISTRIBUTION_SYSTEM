import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Utensils, HeartHandshake, Truck, User, Settings2, Download, Globe,
  CheckCircle2, X, ChevronRight
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

  // 5 Role Portals with updated names & bullet features
  const roleCards = [
    {
      id: 'business',
      role: 'business',
      titleKey: 'business',
      subtitleKey: 'business_subtitle',
      descKey: 'business_desc',
      feat1Key: 'business_feature_1',
      feat2Key: 'business_feature_2',
      btnKey: 'business_btn',
      icon: Utensils,
      color: '#FF6B52'
    },
    {
      id: 'ngo',
      role: 'ngo',
      titleKey: 'ngo',
      subtitleKey: 'ngo_subtitle',
      descKey: 'ngo_desc',
      feat1Key: 'ngo_feature_1',
      feat2Key: 'ngo_feature_2',
      btnKey: 'ngo_btn',
      icon: HeartHandshake,
      color: '#B42B72'
    },
    {
      id: 'delivery',
      role: 'delivery',
      titleKey: 'delivery',
      subtitleKey: 'delivery_subtitle',
      descKey: 'delivery_desc',
      feat1Key: 'delivery_feature_1',
      feat2Key: 'delivery_feature_2',
      btnKey: 'delivery_btn',
      icon: Truck,
      color: '#4B176F'
    },
    {
      id: 'individual',
      role: 'individual',
      titleKey: 'individual',
      subtitleKey: 'individual_subtitle',
      descKey: 'individual_desc',
      feat1Key: 'individual_feature_1',
      feat2Key: 'individual_feature_2',
      btnKey: 'individual_btn',
      icon: User,
      color: '#35135F'
    },
    {
      id: 'admin',
      role: 'admin',
      titleKey: 'admin',
      subtitleKey: 'admin_subtitle',
      descKey: 'admin_desc',
      feat1Key: 'admin_feature_1',
      feat2Key: 'admin_feature_2',
      btnKey: 'admin_btn',
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
        justify: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Background Canvas */}
      <ThreeDBackground />

      {/* CENTRAL WEBSITE PANEL */}
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
        {/* NAVBAR — Clean layout without center nav links */}
        <header
          style={{
            padding: '1.4rem 2.75rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            background: 'transparent'
          }}
        >
          {/* Left Brand Logo (Without "AI" text) */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AnnaSetuLogo size={38} />
          </Link>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Language Selector */}
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
              {t('login')}
            </Link>

            <button
              onClick={() => navigate('/register')}
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
              {t('sign_up')}
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <div style={{ padding: '2.5rem 2.75rem 3.5rem', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '3rem', alignItems: 'center', position: 'relative' }}>
          
          {/* LEFT SIDE CONTENT */}
          <div>
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
              {t('hero_headline_1')}
              <br />
              <span style={{ background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('hero_headline_2')}
              </span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('hero_headline_3')}
              </span>
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: '#4B176F',
                lineHeight: 1.6,
                maxWidth: '460px',
                marginBottom: '2.25rem',
                opacity: 0.95
              }}
            >
              {t('hero_description')}
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
                {t('start_saving_food')}
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
                {t('learn_more')}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — 5 ROLE CARDS WITH FEATURES */}
          <div style={{ position: 'relative' }}>
            
            {/* Floating Network Decoration */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', width: '260px', height: '220px', pointerEvents: 'none', zIndex: 0, opacity: 0.8 }}>
              <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 160 C90 100, 160 190, 220 130" stroke="#FF6B52" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="40" cy="160" r="5" fill="#FF6B52" />
                <circle cx="160" cy="130" r="6" fill="#B42B72" />
                <circle cx="220" cy="130" r="4" fill="#FF875F" />
                <text x="34" y="164" fontSize="10" fill="#ffffff">🌾</text>
                <text x="153" y="135" fontSize="12" fill="#ffffff">🍎</text>
              </svg>
            </div>

            {/* Role Cards Grid */}
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
                      transition: 'all 0.3s ease'
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
                            {t(card.titleKey)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.15rem' }}>
                            {t(card.subtitleKey)}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: '#4B176F', lineHeight: 1.4, marginBottom: '0.75rem', opacity: 0.95 }}>
                        {t(card.descKey)}
                      </p>

                      {/* Included Features List inside Card */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.1rem' }}>
                        <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#64748b' }}>
                          {t(card.feat1Key)}
                        </div>
                        <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#64748b' }}>
                          {t(card.feat2Key)}
                        </div>
                      </div>
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
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{t(card.btnKey)}</span>
                      <ChevronRight size={14} color={card.color} />
                    </button>
                  </div>
                )
              })}

              {/* CARD 5 — Admin (Centered below Row 1 & 2) */}
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
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(255, 135, 95, 0.15)', color: '#FF875F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Settings2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#35135F', lineHeight: 1.2 }}>
                        {t('admin')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.15rem' }}>
                        {t('admin_subtitle')}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#4B176F', lineHeight: 1.4, marginBottom: '0.75rem', opacity: 0.95 }}>
                    {t('admin_desc')}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.1rem' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#64748b' }}>
                      {t('admin_feature_1')}
                    </div>
                    <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#64748b' }}>
                      {t('admin_feature_2')}
                    </div>
                  </div>
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
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{t('admin_btn')}</span>
                  <ChevronRight size={14} color="#FF875F" />
                </button>
              </div>

            </div>
          </div>
        </div>
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#35135F', marginBottom: '0.25rem' }}>{t('request_demo')}</h3>
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
