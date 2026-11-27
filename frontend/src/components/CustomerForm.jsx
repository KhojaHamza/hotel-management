import { useState } from 'react'
import { Link } from 'react-router-dom'

const EMPTY_CUSTOMER = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  nationalId: '',
  address: '',
}

function validate(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'Le prénom est obligatoire'
  if (!values.lastName.trim()) errors.lastName = 'Le nom est obligatoire'
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = 'Email invalide'
  if (!/^[+\d\s-]{8,}$/.test(values.phone.trim())) errors.phone = 'Téléphone invalide (8 chiffres minimum)'
  if (!values.nationalId.trim()) errors.nationalId = 'La pièce d\'identité est obligatoire'
  return errors
}

function CustomerForm({ initialValues = EMPTY_CUSTOMER, onSubmit, submitLabel, saving }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      nationalId: values.nationalId.trim(),
      address: values.address.trim(),
    })
  }

  const field = (name, label, type = 'text', colClass = 'col-md-6') => (
    <div className={colClass}>
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        value={values[name]}
        onChange={handleChange}
      />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        {field('firstName', 'Prénom')}
        {field('lastName', 'Nom')}
        {field('email', 'Email', 'email')}
        {field('phone', 'Téléphone', 'tel')}
        {field('nationalId', 'CIN / Passeport')}
        {field('address', 'Adresse (optionnel)')}
      </div>

      <div className="mt-4 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : submitLabel}
        </button>
        <Link to="/customers" className="btn btn-outline-secondary">Annuler</Link>
      </div>
    </form>
  )
}

export default CustomerForm