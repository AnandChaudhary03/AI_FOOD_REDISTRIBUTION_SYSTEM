import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Package, HeartHandshake, Receipt, MapPin, Radio, TrendingUp,
  Settings, User, LogOut, Calendar, History, Users, FileText, Truck, ShieldCheck, Bell, X, Award
} from 'lucide-react'
import AnnaSetuLogo from './AnnaSetuLogo'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar({ collapsed, isOpen, onClose, role }) {
  const { t } = useTranslation()
  const location = useLocation()
  const { logout } = useAuth()

  const getNavItems = () => {
    switch (role) {
      case 'business':
        return [
          { path: '/business', label: t('dashboard'), icon: LayoutDashboard },
          { path: '/business/inventory', label: t('inventory'), icon: Package },
          { path: '/business/forecasting', label: 'AI Waste Predictor', icon: TrendingUp },
          { path: '/business/donations', label: t('donations'), icon: HeartHandshake },
          { path: '/business/pos', label: 'POS Integration', icon: Radio },
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
          { path: '/individual/donations', label: t('my_donations'), icon: HeartHandshake },
          { path: '/individual/map', label: t('nearby_ngos'), icon: MapPin },
          { path: '/individual/impact', label: t('food_saved_impact'), icon: Award },
          { path: '/individual/profile', label: t('my_profile'), icon: User },
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
    <>
      {/* Mobile Semi-Transparent Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(35, 12, 63, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 140
          }}
        />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AnnaSetuLogo size={32} showText={!collapsed} />
          </div>
          {isOpen && (
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.4rem' }}>
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={logout}
            className="nav-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}
          >
            <LogOut className="nav-icon" />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
