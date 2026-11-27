import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Customers from './pages/Customers'
import Reservations from './pages/Reservations'
import Payments from './pages/Payments'
import Services from './pages/Services'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="payments" element={<Payments />} />
        <Route path="services" element={<Services />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App