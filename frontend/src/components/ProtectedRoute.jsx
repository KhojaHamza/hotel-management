import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ allowedRoles }) {
  const { user, hasRole } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
