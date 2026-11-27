import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RoomForm from '../components/RoomForm'
import { createRoom, getRoomById, updateRoom } from '../services/roomService'

function RoomFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let ignore = false

    getRoomById(id)
      .then((data) => { if (!ignore) setRoom(data) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [id, isEdit])

  const handleSubmit = async (values) => {
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await updateRoom(id, values)
      } else {
        await createRoom(values)
      }
      navigate('/rooms')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="spinner-border" role="status" />
  }

  if (isEdit && !room) {
    return (
      <div>
        <div className="alert alert-danger">{error || 'Chambre introuvable'}</div>
        <Link to="/rooms" className="btn btn-outline-secondary">Retour à la liste</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 className="mb-4">{isEdit ? `Modifier la chambre ${room.number}` : 'Nouvelle chambre'}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <RoomForm
            initialValues={isEdit ? room : undefined}
            onSubmit={handleSubmit}
            submitLabel={isEdit ? 'Enregistrer les modifications' : 'Créer la chambre'}
            saving={saving}
          />
        </div>
      </div>
    </div>
  )
}

export default RoomFormPage