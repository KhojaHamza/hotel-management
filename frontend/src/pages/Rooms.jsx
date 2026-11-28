import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../utils/roles'
import { ROOM_STATUS_LABELS } from '../utils/roomConstants'
import { formatPrice } from '../utils/formatters'
import RoomStatusBadge from '../components/RoomStatusBadge'
import { deleteRoom, getRooms } from '../services/roomService'

function Rooms() {
  const { hasRole } = useAuth()
  const canManage = hasRole([ROLES.ADMIN, ROLES.MANAGER])

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    let ignore = false

    getRooms()
      .then((data) => { if (!ignore) setRooms(data) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [])

  const handleDelete = async (room) => {
    if (!window.confirm(`Supprimer la chambre ${room.number} ?`)) return
    setError('')
    try {
      await deleteRoom(room.id)
      setRooms((prev) => prev.filter((r) => r.id !== room.id))
    } catch (err) {
      setError(err.message)
    }
  }

  // Valeur dérivée : calculée à chaque rendu, pas stockée dans un état
  const filteredRooms = rooms.filter(
    (room) =>
      room.number.toLowerCase().includes(search.trim().toLowerCase()) &&
      (statusFilter === '' || room.status === statusFilter)
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Chambres</h2>
        {canManage && (
          <Link to="/rooms/new" className="btn btn-primary">+ Nouvelle chambre</Link>
        )}
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Rechercher par numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les états</option>
            {Object.entries(ROOM_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="spinner-border" role="status" />
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>N°</th>
                  <th>Type</th>
                  <th>Capacité</th>
                  <th>Tarif / nuit</th>
                  <th>État</th>
                  {canManage && <th className="text-end">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 6 : 5} className="text-center text-muted py-4">
                      Aucune chambre trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.id}>
                      <td className="fw-semibold">{room.number}</td>
                      <td>{room.type}</td>
                      <td>{room.capacity}</td>
                      <td>{formatPrice(room.pricePerNight)}</td>
                      <td><RoomStatusBadge status={room.status} /></td>
                      {canManage && (
                        <td className="text-end">
                          <Link to={`/rooms/${room.id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                            Modifier
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(room)}>
                            Supprimer
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rooms