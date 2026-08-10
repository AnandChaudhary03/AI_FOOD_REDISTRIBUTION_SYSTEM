import { useTranslation } from 'react-i18next'
import { User, Mail, Phone, MapPin, HeartHandshake, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function IndividualProfile() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('profile')}</h1>
        <p className="page-subtitle">Individual Household & Event Food Donor Profile</p>
      </div>

      <div style={{ maxWidth: '600px' }} className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--gradient-brand)', color: '#ffffff', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold'
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</h2>
            <span className="badge badge-green" style={{ marginTop: '0.25rem' }}>
              <HeartHandshake size={12} /> Verified Individual Food Donor
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius)' }}>
            <User color="#FF6B52" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Donor Name</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius)' }}>
            <Mail color="#35135F" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius)' }}>
            <Phone color="#f59e0b" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.phone || '+91 98765 43210'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius)' }}>
            <MapPin color="#ef4444" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default Pickup Address</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.address || 'Civil Lines, Delhi NCR'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
