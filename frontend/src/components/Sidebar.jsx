import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Package, HeartHandshake, Receipt, Barcode, MapPin,
  Settings, User, LogOut, Calendar, History, Users, FileText, Truck, ShieldCheck, Bell
} from 'lucide-react'
import AnnaSetuLogo from './AnnaSetuLogo'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar({ collapsed, role }) {
  const { t } = useTranslation()
  const location = useLocation()
  const { logout } = useAuth()

  const getNavItems = () => {
    switch (role) {
      case 'business':
        return [
          { path: '/business', label: t('dashboard'), icon: LayoutDashboard },
          { path: '/business/inventory', label: t('inventory'), icon: Package },
          { path: '/business/donations', label: t('donations'), icon: HeartHandshake },
          { path: '/business/transactions', label: t('transactions'), icon: Receipt },
          { path: '/business/map', label: t('map'), icon: MapPin },
          { path: '/business/settings', label: t('settings'), icon: Settings },
          { path: '/business/profile', label: t('profile'), icon: User },
        ]
      case 'ngo':
        return [
          { path: '/ngo', label: t('dashboard'), icon: LayoutDashboard },
          { path: '/ngo/available', label: t('available_donations'), icon: HeartHandshake },
          { path: '/ngo/accepted', label: t('accepted_donations'), icon: ShieldCheck },
          { path: '/ngo/schedule', label: t('pickup_schedule'), icon: Calendar },
          { path: '/ngo/history', label: t('donation_history'), icon: History },
          { path: '/ngo/beneficiaries', label: t('beneficiaries'), icon: Users },
          { path: '/ngo/reports', label: t('reports'), icon: FileText },
          { path: '/ngo/profile', label: t('profile'), icon: User },
        ]
      case 'individual':
        return [
          { path: '/individual', label: t('dashboard'), icon: LayoutDashboard },
          { path: '/individual/available', label: t('available_donations'), icon: HeartHandshake },
          { path: '/individual/accepted', label: t('accepted_donations'), icon: ShieldCheck },
          { path: '/individual/history', label: t('donation_history'), icon: History },
          { path: '/individual/profile', label: t('profile'), icon: User },
        ]
      case 'delivery':
        return [
          { path: '/delivery', label: t('dashboard'), icon: LayoutDashboard },
          { path: '/delivery/available', label: t('available_pickups'), icon: Truck },
          { path: '/delivery/active', label: t('active_delivery'), icon: MapPin },
          { path: '/delivery/completed', label: t('completed_deliveries'), icon: ShieldCheck },
          { path: '/delivery/profile', label: t('profile'), icon: User },
        ]
      case 'admin':
        return [
          { path: '/admin', label: t('dashboard'), icon: LayoutDashboard },
          { path: '/admin/users', label: t('users'), icon: Users },
          { path: '/admin/donations', label: t('donations'), icon: HeartHandshake },
          { path: '/admin/deliveries', label: t('completed_deliveries'), icon: Truck },
          { path: '/admin/reports', label: t('reports'), icon: FileText },
          { path: '/admin/notifications', label: t('notifications'), icon: Bell },
        ]
      default:
        return []
    }
  }

  const items = getNavItems()

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AnnaSetuLogo size={collapsed ? 36 : 40} showText={!collapsed} subtitle={role.toUpperCase()} />
        </Link>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon className="nav-icon" />
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={logout} className="nav-item" style={{ width: '100%', color: 'var(--accent-red)' }}>
          <LogOut className="nav-icon" />
          {!collapsed && <span className="nav-label">{t('logout')}</span>}
        </button>
      </div>
    </aside>
  )
}
