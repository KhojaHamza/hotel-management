import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="w-100 px-3" style={{ maxWidth: 420 }}>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout