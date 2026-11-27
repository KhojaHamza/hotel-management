import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { createCustomer, getCustomerById, updateCustomer } from '../services/customerService'

function CustomerFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let ignore = false

    getCustomerById(id)
      .then((data) => { if (!ignore) setCustomer(data) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [id, isEdit])

  const handleSubmit = async (values) => {
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await updateCustomer(id, values)
      } else {
        await createCustomer(values)
      }
      navigate('/customers')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="spinner-border" role="status" />
  }

  if (isEdit && !customer) {
    return (
      <div>
        <div className="alert alert-danger">{error || 'Client introuvable'}</div>
        <Link to="/customers" className="btn btn-outline-secondary">Retour à la liste</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 className="mb-4">
        {isEdit ? `Modifier ${customer.firstName} ${customer.lastName}` : 'Nouveau client'}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <CustomerForm
            initialValues={isEdit ? customer : undefined}
            onSubmit={handleSubmit}
            submitLabel={isEdit ? 'Enregistrer les modifications' : 'Créer le client'}
            saving={saving}
          />
        </div>
      </div>
    </div>
  )
}

export default CustomerFormPage