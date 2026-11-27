import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROOM_TYPES, ROOM_STATUS_LABELS } from '../utils/roomConstants'

const EMPTY_ROOM = {
  number: '',
  type: ROOM_TYPES[0],
  capacity: 1,
  pricePerNight: '',
  status: 'available',
}

function validate(values) {
  const errors = {}
  if (!values.number.trim()) errors.number = 'Le numéro est obligatoire'
  if (!(Number(values.capacity) >= 1)) errors.capacity = 'La capacité doit être au moins 1'
  if (!(Number(values.pricePerNight) > 0)) errors.pricePerNight = 'Le tarif doit être supérieur à 0'
  return errors
}

function RoomForm({ initialValues = EMPTY_ROOM, onSubmit, submitLabel, saving }) {
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
      ...values,
      number: values.number.trim(),
      capacity: Number(values.capacity),
      pricePerNight: Number(values.pricePerNight),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="number" className="form-label">Numéro</label>
          <input
            id="number"
            name="number"
            className={`form-control ${errors.number ? 'is-invalid' : ''}`}
            value={values.number}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.number}</div>
        </div>

        <div className="col-md-6">
          <label htmlFor="type" className="form-label">Type</label>
          <select id="type" name="type" className="form-select" value={values.type} onChange={handleChange}>
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="capacity" className="form-label">Capacité (personnes)</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
            value={values.capacity}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.capacity}</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="pricePerNight" className="form-label">Tarif par nuit (DT)</label>
          <input
            id="pricePerNight"
            name="pricePerNight"
            type="number"
            min="0"
            step="0.01"
            className={`form-control ${errors.pricePerNight ? 'is-invalid' : ''}`}
            value={values.pricePerNight}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.pricePerNight}</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="status" className="form-label">État</label>
          <select id="status" name="status" className="form-select" value={values.status} onChange={handleChange}>
            {Object.entries(ROOM_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : submitLabel}
        </button>
        <Link to="/rooms" className="btn btn-outline-secondary">Annuler</Link>
      </div>
    </form>
  )
}

export default RoomForm