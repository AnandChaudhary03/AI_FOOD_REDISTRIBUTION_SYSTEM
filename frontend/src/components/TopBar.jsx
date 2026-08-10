import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Menu, Sparkles, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function TopBar({ onToggleSidebar }) {
  const { i18n } = useTranslation()
  const { user, updateLanguage } = useAuth()
  const [langOpen, setLangOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('annasetu_theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
    localStorage.setItem('annasetu_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' }
  ]

  const handleLangChange = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('annasetu_lang', code)
    if (user) updateLanguage(code)
    setLangOpen(false)
  }

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onToggleSidebar} className="btn btn-ghost btn-sm">
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-green">
            <Sparkles size={12} /> AI Powered
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          {theme === 'light' ? (
            <>
              <Moon size={16} color="#FF6B52" />
              <span className="mobile-hide" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Dark</span>
            </>
          ) : (
            <>
              <Sun size={16} color="#f59e0b" />
              <span className="mobile-hide" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Light</span>
            </>
          )}
        </button>

        {/* Multilingual Language Selector */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(!langOpen)} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <Globe size={16} />
            <span>{languages.find(l => l.code === i18n.language)?.name || 'English'}</span>
          </button>

          {langOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '110%',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '0.4rem', zIndex: 100,
              minWidth: '130px', boxShadow: 'var(--shadow-card)'
            }}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLangChange(l.code)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem',
                    background: i18n.language === l.code ? 'rgba(255,107,82,0.15)' : 'transparent',
                    color: i18n.language === l.code ? '#FF6B52' : 'var(--text-primary)',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
                  }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--gradient-brand)', color: '#ffffff', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div className="mobile-hide" style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{user?.organization_name || user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
