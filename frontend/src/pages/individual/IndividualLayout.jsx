import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import TopBar from '../../components/TopBar'

export default function IndividualLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} role="individual" />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <TopBar onToggleSidebar={handleToggle} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
