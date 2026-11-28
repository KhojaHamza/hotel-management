import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function MainLayout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="content-area flex-grow-1 d-flex flex-column bg-light">
        <Topbar />
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
