import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import TopBar from '../../components/TopBar'

export default function DeliveryLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }

  return (
    <div className="app-layout" data-portal="delivery">
      <Sidebar collapsed={collapsed} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} role="delivery" />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <TopBar onToggleSidebar={handleToggle} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
