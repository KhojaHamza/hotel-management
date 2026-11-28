import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { ROLES } from './utils/roles'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Customers from './pages/Customers'
import Reservations from './pages/Reservations'
import Payments from './pages/Payments'
import Services from './pages/Services'
import Users from './pages/Users'
import Unauthorized from './pages/Unauthorized'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import RoomFormPage from './pages/RoomFormPage'
import CustomerFormPage from './pages/CustomerFormPage'
import CustomerDetails from './pages/CustomerDetails'
import ReservationFormPage from './pages/ReservationFormPage'
function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<CustomerFormPage />} />
          <Route path="customers/:id/edit" element={<CustomerFormPage />} />
           <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="reservations/new" element={<ReservationFormPage />} />
          <Route path="reservations/:id/edit" element={<ReservationFormPage />} />
          <Route path="payments" element={<Payments />} />
          <Route path="services" element={<Services />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]} />}>
            <Route path="rooms/new" element={<RoomFormPage />} />
            <Route path="rooms/:id/edit" element={<RoomFormPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
