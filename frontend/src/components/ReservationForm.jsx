import { useEffect, useState } from 'react'
import { getCustomers } from '../services/customerService'
import { getAvailableRooms, calculateNights } from '../services/reservationService'

const EMPTY = { customerId: '', roomId: '', checkInDate: '', checkOutDate: '' }

function ReservationForm({ initialData, excludeId, onSubmit, submitting }) {
  const [form, setForm] = useState(
    initialData
      ? {
          customerId: String(initialData.customerId),
          roomId: String(initialData.roomId),
          checkInDate: initialData.checkInDate,
          checkOutDate: initialData.checkOutDate,
        }
      : EMPTY
  )
  const [customers, setCustomers] = useState([])
  const [rooms, setRooms] = useState([])
  const [errors, setErrors] = useState({})

  const datesValid = Boolean(form.checkInDate && form.checkOutDate && form.checkOutDate > form.checkInDate)

  useEffect(() => {
    let ignore = false
    getCustomers().then((data) => {
      if (!ignore) setCustomers(data)
    })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!datesValid) return
    let ignore = false
    getAvailableRooms(form.checkInDate, form.checkOutDate, excludeId).then((data) => {
      if (!ignore) setRooms(data)
    })
    return () => {
      ignore = true
    }
  }, [datesValid, form.checkInDate, form.checkOutDate, excludeId])

  // Valeurs dérivées calculées au rendu
  const availableRooms = datesValid ? rooms : []
  const selectedRoom = availableRooms.find((r) => r.id === Number(form.roomId))
  const nights = datesValid ? calculateNights(form.checkInDate, form.checkOutDate) : 0
  const total = selectedRoom ? nights * selectedRoom.pricePerNight : 0

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const next = {}
    if (!form.customerId) next.customerId = 'Choisissez un client'
    if (!form.checkInDate) next.checkInDate = "La date d'arrivée est obligatoire"
    if (!form.checkOutDate) next.checkOutDate = 'La date de départ est obligatoire'
    if (form.checkInDate && form.checkOutDate && form.checkOutDate <= form.checkInDate) {
      next.checkOutDate = "Le départ doit être après l'arrivée"
    }
    if (datesValid && !selectedRoom) next.roomId = 'Choisissez une chambre disponible'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      customerId: Number(form.customerId),
      roomId: Number(form.roomId),
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Client</label>
        <select
          name="customerId"
          className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
          value={form.customerId}
          onChange={handleChange}
        >
          <option value="">-- Choisir un client --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{errors.customerId}</div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Date d'arrivée</label>
          <input
            type="date"
            name="checkInDate"
            className={`form-control ${errors.checkInDate ? 'is-invalid' : ''}`}
            value={form.checkInDate}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.checkInDate}</div>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Date de départ</label>
          <input
            type="date"
            name="checkOutDate"
            className={`form-control ${errors.checkOutDate ? 'is-invalid' : ''}`}
            value={form.checkOutDate}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.checkOutDate}</div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Chambre disponible</label>
        <select
          name="roomId"
          className={`form-select ${errors.roomId ? 'is-invalid' : ''}`}
          value={form.roomId}
          onChange={handleChange}
          disabled={!datesValid}
        >
          <option value="">
            {datesValid ? '-- Choisir une chambre --' : "Choisissez d'abord les dates"}
          </option>
          {availableRooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.number} - {r.type} ({r.capacity} pers.) - {r.pricePerNight} DT/nuit
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{errors.roomId}</div>
        {datesValid && availableRooms.length === 0 && (
          <div className="form-text text-danger">Aucune chambre disponible sur cette période.</div>
        )}
      </div>

      {selectedRoom && (
        <div className="alert alert-info">
          {nights} nuit(s) x {selectedRoom.pricePerNight} DT = <strong>{total} DT</strong>
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  )
}

export default ReservationForm