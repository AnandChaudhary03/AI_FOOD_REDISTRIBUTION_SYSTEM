import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%' }} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = (user?.role || '').toLowerCase()
  const targetRole = (role || '').toLowerCase()

  const validRoles = ['business', 'ngo', 'individual', 'delivery', 'admin']
  const safeRole = validRoles.includes(userRole) ? userRole : 'business'

  if (targetRole && userRole !== targetRole) {
    return <Navigate to={`/${safeRole}`} replace />
  }

  return children
}
