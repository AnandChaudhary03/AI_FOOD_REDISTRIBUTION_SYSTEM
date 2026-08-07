import { useTranslation } from 'react-i18next'
import { User, Building2, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function BusinessProfile() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('profile')}</h1>
        <p className="page-subtitle">Business details and account verification status</p>
      </div>

      <div style={{ maxWidth: '600px' }} className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--gradient-green)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold'
          }}>
            {user?.name?.[0]}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user?.organization_name || user?.name}</h2>
            <span className="badge badge-green" style={{ marginTop: '0.25rem' }}>
              <ShieldCheck size={12} /> Verified Business Account
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
            <User color="var(--accent-green)" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Person</div>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
            <Mail color="var(--accent-blue)" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
              <div style={{ fontWeight: 600 }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
            <Phone color="var(--accent-saffron)" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</div>
              <div style={{ fontWeight: 600 }}>{user?.phone || '+91 98765 43210'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
            <MapPin color="var(--accent-red)" size={18} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address</div>
              <div style={{ fontWeight: 600 }}>{user?.address || 'Connaught Place, New Delhi'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
