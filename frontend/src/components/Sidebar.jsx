import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../utils/roles'

// Sans "roles" : visible par tous les utilisateurs connectés
const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/rooms', label: 'Chambres' },
  { to: '/customers', label: 'Clients' },
  { to: '/reservations', label: 'Réservations' },
  { to: '/payments', label: 'Paiements' },
  { to: '/services', label: 'Services' },
  { to: '/users', label: 'Utilisateurs', roles: [ROLES.ADMIN] },
]

function Sidebar() {
  const { hasRole } = useAuth()
  const visibleLinks = links.filter((link) => !link.roles || hasRole(link.roles))

  return (
    <aside className="sidebar bg-dark text-white p-3">
      <h5 className="mb-4">🏨 Hotel Manager</h5>
      <nav className="nav nav-pills flex-column gap-1">
        {visibleLinks.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className="nav-link text-white">
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar