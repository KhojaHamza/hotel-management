import { ROOM_STATUS_LABELS, ROOM_STATUS_COLORS } from '../utils/roomConstants'

function RoomStatusBadge({ status }) {
  const color = ROOM_STATUS_COLORS[status] || 'secondary'
  const label = ROOM_STATUS_LABELS[status] || status

  return <span className={`badge text-bg-${color}`}>{label}</span>
}

export default RoomStatusBadge