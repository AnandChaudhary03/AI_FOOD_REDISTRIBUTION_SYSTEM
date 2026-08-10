import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Core Pages (Loaded eagerly for instant landing experience)
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'

// Lazy Loaded Dashboard Routes for Instant Load Speed
const BusinessLayout = lazy(() => import('./pages/business/BusinessLayout.jsx'))
const BusinessDashboard = lazy(() => import('./pages/business/Dashboard.jsx'))
const BusinessInventory = lazy(() => import('./pages/business/Inventory.jsx'))
const BusinessDonations = lazy(() => import('./pages/business/Donations.jsx'))
const BusinessTransactions = lazy(() => import('./pages/business/Transactions.jsx'))
const BusinessMap = lazy(() => import('./pages/business/Map.jsx'))
const BusinessSettings = lazy(() => import('./pages/business/Settings.jsx'))
const BusinessProfile = lazy(() => import('./pages/business/Profile.jsx'))

const NGOLayout = lazy(() => import('./pages/ngo/NGOLayout.jsx'))
const NGODashboard = lazy(() => import('./pages/ngo/Dashboard.jsx'))
const AvailableDonations = lazy(() => import('./pages/ngo/AvailableDonations.jsx'))
const AcceptedDonations = lazy(() => import('./pages/ngo/AcceptedDonations.jsx'))
const PickupSchedule = lazy(() => import('./pages/ngo/PickupSchedule.jsx'))
const DonationHistory = lazy(() => import('./pages/ngo/DonationHistory.jsx'))
const Beneficiaries = lazy(() => import('./pages/ngo/Beneficiaries.jsx'))
const NGOReports = lazy(() => import('./pages/ngo/Reports.jsx'))
const NGOProfile = lazy(() => import('./pages/ngo/Profile.jsx'))

const IndividualLayout = lazy(() => import('./pages/individual/IndividualLayout.jsx'))
const IndividualDashboard = lazy(() => import('./pages/individual/Dashboard.jsx'))
const IndividualAvailableDonations = lazy(() => import('./pages/individual/AvailableDonations.jsx'))
const IndividualAccepted = lazy(() => import('./pages/individual/AcceptedDonations.jsx'))
const IndividualHistory = lazy(() => import('./pages/individual/DonationHistory.jsx'))
const IndividualProfile = lazy(() => import('./pages/individual/Profile.jsx'))

const DeliveryLayout = lazy(() => import('./pages/delivery/DeliveryLayout.jsx'))
const DeliveryDashboard = lazy(() => import('./pages/delivery/Dashboard.jsx'))
const AvailablePickups = lazy(() => import('./pages/delivery/AvailablePickups.jsx'))
const ActiveDelivery = lazy(() => import('./pages/delivery/ActiveDelivery.jsx'))
const CompletedDeliveries = lazy(() => import('./pages/delivery/CompletedDeliveries.jsx'))
const DeliveryProfile = lazy(() => import('./pages/delivery/Profile.jsx'))

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminUsers = lazy(() => import('./pages/admin/Users.jsx'))
const AdminDonations = lazy(() => import('./pages/admin/Donations.jsx'))
const AdminDeliveries = lazy(() => import('./pages/admin/Deliveries.jsx'))
const AdminReports = lazy(() => import('./pages/admin/Reports.jsx'))
const AdminNotifications = lazy(() => import('./pages/admin/Notifications.jsx'))

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 60000 } } })

const PageLoader = () => (
  <div className="page fade-in" style={{ padding: '1.5rem' }}>
    <div className="skeleton" style={{ height: 220, borderRadius: 20 }} />
  </div>
)

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ style: { background: '#35135F', color: '#fff', border: '1px solid rgba(255,107,82,0.3)' } }} />
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
