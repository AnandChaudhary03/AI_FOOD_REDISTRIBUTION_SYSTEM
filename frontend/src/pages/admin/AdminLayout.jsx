import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import TopBar from '../../components/TopBar'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} role="admin" />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <TopBar onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="content-area"><Outlet /></main>
      </div>
    </div>
  )
}
