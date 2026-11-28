import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCustomerById } from '../services/customerService'
import { getReservations } from '../services/reservationService'
import { getRooms } from '../services/roomService'
import { formatDate } from '../utils/formatters'
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_COLORS,
} from '../utils/reservationConstants'

function CustomerDetails() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [reservations, setReservations] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    Promise.all([getCustomerById(id), getReservations(), getRooms()])
      .then(([customerData, reservationsData, roomsData]) => {
        if (ignore) return
        setCustomer(customerData)
        setReservations(reservationsData)
        setRooms(roomsData)
      })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [id])

  if (loading) {
    return <div className="spinner-border" role="status" />
  }

  if (!customer) {
    return (
      <div>
        <div className="alert alert-danger">{error || 'Client introuvable'}</div>
        <Link to="/customers" className="btn btn-outline-secondary">Retour à la liste</Link>
      </div>
    )
  }

  // Historique du client calculé au rendu (pas stocké dans un state)
  const history = reservations.filter((r) => r.customerId === customer.id)
  const roomNumber = (roomId) => {
    const room = rooms.find((r) => r.id === roomId)
    return room ? room.number : '-'
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{customer.firstName} {customer.lastName}</h2>
        <div className="d-flex gap-2">
          <Link to="/customers" className="btn btn-outline-secondary">Retour</Link>
          <Link to={`/customers/${customer.id}/edit`} className="btn btn-primary">Modifier</Link>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header fw-semibold">Coordonnées</div>
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-4">Email</dt>
            <dd className="col-sm-8">{customer.email}</dd>

            <dt className="col-sm-4">Téléphone</dt>
            <dd className="col-sm-8">{customer.phone}</dd>

            <dt className="col-sm-4">CIN / Passeport</dt>
            <dd className="col-sm-8">{customer.nationalId}</dd>

            <dt className="col-sm-4">Adresse</dt>
            <dd className="col-sm-8">{customer.address || '—'}</dd>

            <dt className="col-sm-4">Client depuis</dt>
            <dd className="col-sm-8 mb-0">{formatDate(customer.createdAt)}</dd>
          </dl>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-semibold">Historique des réservations</div>
        {history.length === 0 ? (
          <div className="card-body text-muted">Aucune réservation pour ce client.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Chambre</th>
                  <th>Arrivée</th>
                  <th>Départ</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id}>
                    <td>{roomNumber(r.roomId)}</td>
                    <td>{r.checkInDate}</td>
                    <td>{r.checkOutDate}</td>
                    <td>{r.totalAmount} DT</td>
                    <td>
                      <span className={`badge bg-${RESERVATION_STATUS_COLORS[r.status]}`}>
                        {RESERVATION_STATUS_LABELS[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDetails