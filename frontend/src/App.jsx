import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Pages (Static Imports to guarantee 100% route loading reliability across Vercel & Render)
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'

// Business
import BusinessLayout from './pages/business/BusinessLayout.jsx'
import BusinessDashboard from './pages/business/Dashboard.jsx'
import BusinessInventory from './pages/business/Inventory.jsx'
import BusinessDonations from './pages/business/Donations.jsx'
import BusinessTransactions from './pages/business/Transactions.jsx'
import BusinessMap from './pages/business/Map.jsx'
import BusinessSettings from './pages/business/Settings.jsx'
import BusinessProfile from './pages/business/Profile.jsx'

// NGO
import NGOLayout from './pages/ngo/NGOLayout.jsx'
import NGODashboard from './pages/ngo/Dashboard.jsx'
import AvailableDonations from './pages/ngo/AvailableDonations.jsx'
import AcceptedDonations from './pages/ngo/AcceptedDonations.jsx'
import PickupSchedule from './pages/ngo/PickupSchedule.jsx'
import DonationHistory from './pages/ngo/DonationHistory.jsx'
import Beneficiaries from './pages/ngo/Beneficiaries.jsx'
import NGOReports from './pages/ngo/Reports.jsx'
import NGOProfile from './pages/ngo/Profile.jsx'

// Individual
import IndividualLayout from './pages/individual/IndividualLayout.jsx'
import IndividualDashboard from './pages/individual/Dashboard.jsx'
import IndividualAvailableDonations from './pages/individual/AvailableDonations.jsx'
import IndividualAccepted from './pages/individual/AcceptedDonations.jsx'
import IndividualHistory from './pages/individual/DonationHistory.jsx'
import IndividualProfile from './pages/individual/Profile.jsx'

// Delivery
import DeliveryLayout from './pages/delivery/DeliveryLayout.jsx'
import DeliveryDashboard from './pages/delivery/Dashboard.jsx'
import AvailablePickups from './pages/delivery/AvailablePickups.jsx'
import ActiveDelivery from './pages/delivery/ActiveDelivery.jsx'
import CompletedDeliveries from './pages/delivery/CompletedDeliveries.jsx'
import DeliveryProfile from './pages/delivery/Profile.jsx'

// Admin
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminDonations from './pages/admin/Donations.jsx'
import AdminDeliveries from './pages/admin/Deliveries.jsx'
import AdminReports from './pages/admin/Reports.jsx'
import AdminNotifications from './pages/admin/Notifications.jsx'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 60000 } } })

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error("App Route Error caught by ErrorBoundary:", error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#FFF8E9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 20px 60px rgba(53,19,95,0.15)', maxWidth: '460px', width: '100%', border: '1px solid rgba(53,19,95,0.1)' }}>
            <h2 style={{ color: '#35135F', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Something went wrong</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Please refresh the page to reload the latest version of AnnaSetu.</p>
            <button
              onClick={() => { window.location.href = '/' }}
              style={{ background: 'linear-gradient(135deg, #FF6B52 0%, #FF875F 100%)', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '99px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Return to Home Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ style: { background: '#35135F', color: '#fff', border: '1px solid rgba(255,107,82,0.3)' } }} />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Business Dashboard Routes */}
              <Route path="/business" element={<ProtectedRoute role="business"><BusinessLayout /></ProtectedRoute>}>
                <Route index element={<BusinessDashboard />} />
                <Route path="inventory" element={<BusinessInventory />} />
                <Route path="donations" element={<BusinessDonations />} />
                <Route path="transactions" element={<BusinessTransactions />} />
                <Route path="barcode" element={<Navigate to="/business/inventory" replace />} />
                <Route path="map" element={<BusinessMap />} />
                <Route path="settings" element={<BusinessSettings />} />
                <Route path="profile" element={<BusinessProfile />} />
              </Route>

              {/* NGO Dashboard Routes */}
              <Route path="/ngo" element={<ProtectedRoute role="ngo"><NGOLayout /></ProtectedRoute>}>
                <Route index element={<NGODashboard />} />
                <Route path="available" element={<AvailableDonations />} />
                <Route path="accepted" element={<AcceptedDonations />} />
                <Route path="schedule" element={<PickupSchedule />} />
                <Route path="history" element={<DonationHistory />} />
                <Route path="beneficiaries" element={<Beneficiaries />} />
                <Route path="reports" element={<NGOReports />} />
                <Route path="profile" element={<NGOProfile />} />
              </Route>

              {/* Individual Dashboard Routes */}
              <Route path="/individual" element={<ProtectedRoute role="individual"><IndividualLayout /></ProtectedRoute>}>
                <Route index element={<IndividualDashboard />} />
                <Route path="available" element={<IndividualAvailableDonations />} />
                <Route path="accepted" element={<IndividualAccepted />} />
                <Route path="history" element={<IndividualHistory />} />
                <Route path="profile" element={<IndividualProfile />} />
              </Route>

              {/* Delivery Dashboard Routes */}
              <Route path="/delivery" element={<ProtectedRoute role="delivery"><DeliveryLayout /></ProtectedRoute>}>
                <Route index element={<DeliveryDashboard />} />
                <Route path="available" element={<AvailablePickups />} />
                <Route path="active" element={<ActiveDelivery />} />
                <Route path="completed" element={<CompletedDeliveries />} />
                <Route path="profile" element={<DeliveryProfile />} />
              </Route>

              {/* Admin Dashboard Routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="donations" element={<AdminDonations />} />
                <Route path="deliveries" element={<AdminDeliveries />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="notifications" element={<AdminNotifications />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
