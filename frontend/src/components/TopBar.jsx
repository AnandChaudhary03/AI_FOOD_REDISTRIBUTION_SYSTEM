import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Menu, Sun, Moon, Download } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function TopBar({ onToggleSidebar }) {
  const { i18n } = useTranslation()
  const { user, updateLanguage } = useAuth()
  const [langOpen, setLangOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('annasetu_theme') || 'light')
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    // Detect if app is running in installed PWA standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')
      setIsStandalone(isStandaloneMode)
    }

    checkStandalone()

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('annasetu_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      alert('To install AnnaSetu on your device:\n\n• On Chrome/Edge: Click the ⊕ install icon in address bar.\n• On iOS Safari: Tap Share ➔ Add to Home Screen.')
    }
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
  ]

  const handleLangChange = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('annasetu_lang', code)
    updateLanguage(code)
    setLangOpen(false)
  }

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={onToggleSidebar} className="topbar-btn" title="Toggle Sidebar Menu">
          <Menu size={18} color="#FF6B52" />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* PWA Install Button (Only visible when opened in browser, hidden when running inside app) */}
        {!isStandalone && (
          <button
            onClick={handleInstallApp}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '99px', fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
            title="Install AnnaSetu App to Home Screen"
          >
            <Download size={14} /> <span className="mobile-hide">Install App</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="topbar-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <>
              <Moon size={16} color="#FF6B52" />
              <span className="mobile-hide">Dark</span>
            </>
          ) : (
            <>
              <Sun size={16} color="#f59e0b" />
              <span className="mobile-hide">Light</span>
            </>
          )}
        </button>

        {/* Multilingual Language Selector */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(!langOpen)} className="topbar-btn">
            <Globe size={16} color="#FF6B52" />
            <span>{languages.find(l => l.code === i18n.language)?.name || 'English'}</span>
          </button>

          {langOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '115%',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '0.4rem', zIndex: 200,
              minWidth: '135px', boxShadow: 'var(--shadow-card)'
            }}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLangChange(l.code)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem',
                    background: i18n.language === l.code ? 'rgba(255,107,82,0.15)' : 'transparent',
                    color: i18n.language === l.code ? '#FF6B52' : 'var(--text-primary)',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                  }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Info with Crystal Clear High-Contrast Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(0,0,0,0.25)', padding: '0.35rem 0.75rem', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', color: '#ffffff', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.95rem',
            border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 8px rgba(255,107,82,0.4)'
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div className="mobile-hide" style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '0.9rem', letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#FFD166', fontWeight: 700, textTransform: 'capitalize', letterSpacing: '0.01em' }}>
              {user?.organization_name || user?.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
