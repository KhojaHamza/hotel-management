import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/rooms', label: 'Chambres' },
  { to: '/customers', label: 'Clients' },
  { to: '/reservations', label: 'Réservations' },
  { to: '/payments', label: 'Paiements' },
  { to: '/services', label: 'Services' },
]

function Sidebar() {
  return (
    <aside className="sidebar bg-dark text-white p-3">
      <h5 className="mb-4">🏨 Hotel Manager</h5>
      <nav className="nav nav-pills flex-column gap-1">
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className="nav-link text-white">
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
