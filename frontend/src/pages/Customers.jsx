import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../utils/roles'
import { deleteCustomer, getCustomers } from '../services/customerService'

function Customers() {
  const { hasRole } = useAuth()
  const canDelete = hasRole([ROLES.ADMIN, ROLES.MANAGER])

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let ignore = false

    getCustomers()
      .then((data) => { if (!ignore) setCustomers(data) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [])

  const handleDelete = async (customer) => {
    if (!window.confirm(`Supprimer ${customer.firstName} ${customer.lastName} ?`)) return
    setError('')
    try {
      await deleteCustomer(customer.id)
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
    } catch (err) {
      setError(err.message)
    }
  }

  const term = search.trim().toLowerCase()
  const filteredCustomers = customers.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(term) ||
    c.email.toLowerCase().includes(term) ||
    c.phone.includes(term)
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Clients</h2>
        <Link to="/customers/new" className="btn btn-primary">+ Nouveau client</Link>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      Aucun client trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="fw-semibold">
                        <Link to={`/customers/${customer.id}`} className="text-decoration-none">
                          {customer.firstName} {customer.lastName}
                        </Link>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td className="text-end">
                        <Link to={`/customers/${customer.id}`} className="btn btn-sm btn-outline-secondary me-2">
                          Voir
                        </Link>
                        <Link to={`/customers/${customer.id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                          Modifier
                        </Link>
                        {canDelete && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(customer)}>
                            Supprimer
                          </button>
                        )}
                      </td>
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

export default Customers