import { useAuth } from '../hooks/useAuth'
import { ROLE_LABELS } from '../utils/roles'

function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
      <span className="fw-semibold">Gestion hôtelière</span>
      <div className="d-flex align-items-center gap-3">
        <span>
          {user.name}{' '}
          <span className="badge text-bg-secondary">{ROLE_LABELS[user.role]}</span>
        </span>
        <button className="btn btn-outline-danger btn-sm" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </header>
  )
}

export default Topbar