import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCustomerById } from '../services/customerService'
import { formatDate } from '../utils/formatters'

function CustomerDetails() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    getCustomerById(id)
      .then((data) => { if (!ignore) setCustomer(data) })
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
        <div className="card-body text-muted">
          Disponible avec la gestion des réservations (feature/reservations).
        </div>
      </div>
    </div>
  )
}

export default CustomerDetails