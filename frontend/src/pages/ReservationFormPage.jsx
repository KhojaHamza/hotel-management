import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReservationForm from '../components/ReservationForm'
import {
  createReservation,
  getReservationById,
  updateReservation,
} from '../services/reservationService'

function ReservationFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let ignore = false
    getReservationById(id)
      .then((data) => {
        if (!ignore) setReservation(data)
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
  }, [id, isEdit])

  async function handleSubmit(data) {
    setSubmitting(true)
    setError('')
    try {
      if (isEdit) await updateReservation(id, data)
      else await createReservation(data)
      navigate('/reservations')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <h2 className="mb-4">{isEdit ? 'Modifier la réservation' : 'Nouvelle réservation'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {(!isEdit || reservation) && (
        <ReservationForm
          initialData={reservation}
          excludeId={reservation ? reservation.id : undefined}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  )
}

export default ReservationFormPage