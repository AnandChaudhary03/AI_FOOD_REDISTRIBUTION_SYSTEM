import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { Settings, Globe, Bell, Moon, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function BusinessSettings() {
  const { t, i18n } = useTranslation()
  const { user, updateLanguage } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleLanguageChange = (e) => {
    const lang = e.target.value
    i18n.changeLanguage(lang)
    localStorage.setItem('annasetu_lang', lang)
    if (user) updateLanguage(lang)
    toast.success('Language preferences saved')
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('settings')}</h1>
        <p className="page-subtitle">Configure application preferences and language settings</p>
      </div>

      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Globe color="var(--accent-green)" size={20} />
            <h3 style={{ fontWeight: 700 }}>Language Preferences</h3>
          </div>
          <div className="input-group">
            <label className="input-label">Select Application Language</label>
            <select className="input" value={i18n.language} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Bell color="var(--accent-saffron)" size={20} />
            <h3 style={{ fontWeight: 700 }}>Notifications & AI Alerts</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Enable Real-time Surplus Alerts</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get alerts when food items are near expiry date</div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
