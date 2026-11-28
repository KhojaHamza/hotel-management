import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReservations, cancelReservation } from '../services/reservationService'
import { getCustomers } from '../services/customerService'
import { getRooms } from '../services/roomService'
import {
  RESERVATION_STATUS,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_COLORS,
} from '../utils/reservationConstants'

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [customers, setCustomers] = useState([])
  const [rooms, setRooms] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    Promise.all([getReservations(), getCustomers(), getRooms()])
      .then(([res, cus, roo]) => {
        if (ignore) return
        setReservations(res)
        setCustomers(cus)
        setRooms(roo)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  async function handleCancel(id) {
    if (!window.confirm('Annuler cette réservation ?')) return
    try {
      const updated = await cancelReservation(id)
      setReservations(reservations.map((r) => (r.id === id ? updated : r)))
    } catch (err) {
      setError(err.message)
    }
  }

  const customerName = (id) => {
    const c = customers.find((x) => x.id === id)
    return c ? `${c.firstName} ${c.lastName}` : '-'
  }
  const roomNumber = (id) => {
    const r = rooms.find((x) => x.id === id)
    return r ? r.number : '-'
  }

  // Liste filtrée calculée au rendu
  const filtered = statusFilter
    ? reservations.filter((r) => r.status === statusFilter)
    : reservations

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Réservations</h2>
        <Link to="/reservations/new" className="btn btn-primary">
          Nouvelle réservation
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <select
        className="form-select mb-3 w-auto"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Tous les statuts</option>
        {Object.values(RESERVATION_STATUS).map((s) => (
          <option key={s} value={s}>
            {RESERVATION_STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Chambre</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  Aucune réservation
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{customerName(r.customerId)}</td>
                <td>{roomNumber(r.roomId)}</td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td>{r.totalAmount} DT</td>
                <td>
                  <span className={`badge bg-${RESERVATION_STATUS_COLORS[r.status]}`}>
                    {RESERVATION_STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td>
                  {r.status === RESERVATION_STATUS.CONFIRMED && (
                    <>
                      <Link
                        to={`/reservations/${r.id}/edit`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Modifier
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCancel(r.id)}
                      >
                        Annuler
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reservations