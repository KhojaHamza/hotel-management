import { RESERVATION_STATUS } from '../utils/reservationConstants'
import { getRooms } from './roomService'

const STORAGE_KEY = 'hotel_reservations'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function readReservations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // données corrompues : on repart de zéro
  }
  return []
}

function writeReservations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// Nombre de nuits entre deux dates 'YYYY-MM-DD'
export function calculateNights(checkInDate, checkOutDate) {
  const [y1, m1, d1] = checkInDate.split('-').map(Number)
  const [y2, m2, d2] = checkOutDate.split('-').map(Number)
  const ms = Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)
  return Math.round(ms / 86400000)
}

export function calculateTotal(pricePerNight, checkInDate, checkOutDate) {
  return pricePerNight * calculateNights(checkInDate, checkOutDate)
}

// Deux séjours se chevauchent si chacun commence avant la fin de l'autre
function overlaps(a, b) {
  return a.checkInDate < b.checkOutDate && b.checkInDate < a.checkOutDate
}

function isActive(reservation) {
  return (
    reservation.status === RESERVATION_STATUS.CONFIRMED ||
    reservation.status === RESERVATION_STATUS.CHECKED_IN
  )
}

function hasConflict(reservations, roomId, checkInDate, checkOutDate, excludeId) {
  return reservations.some(
    (r) =>
      r.roomId === roomId &&
      r.id !== excludeId &&
      isActive(r) &&
      overlaps(r, { checkInDate, checkOutDate })
  )
}

function validateDates(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) throw new Error('Les dates sont obligatoires')
  if (checkOutDate <= checkInDate) {
    throw new Error("La date de départ doit être postérieure à la date d'arrivée")
  }
}

export async function getReservations() {
  await delay(300)
  return readReservations()
}

export async function getReservationById(id) {
  await delay(200)
  const reservation = readReservations().find((r) => r.id === Number(id))
  if (!reservation) throw new Error('Réservation introuvable')
  return reservation
}

// Chambres libres sur la période (hors maintenance)
export async function getAvailableRooms(checkInDate, checkOutDate, excludeId) {
  const [rooms] = await Promise.all([getRooms(), delay(150)])
  const reservations = readReservations()
  return rooms.filter(
    (room) =>
      room.status !== 'maintenance' &&
      !hasConflict(reservations, room.id, checkInDate, checkOutDate, excludeId)
  )
}

export async function createReservation(data) {
  await delay(300)
  validateDates(data.checkInDate, data.checkOutDate)

  const rooms = await getRooms()
  const room = rooms.find((r) => r.id === data.roomId)
  if (!room) throw new Error('Chambre introuvable')

  const reservations = readReservations()
  if (hasConflict(reservations, room.id, data.checkInDate, data.checkOutDate)) {
    throw new Error(`La chambre ${room.number} est déjà réservée sur cette période`)
  }

  const newReservation = {
    ...data,
    id: Math.max(0, ...reservations.map((r) => r.id)) + 1,
    status: RESERVATION_STATUS.CONFIRMED,
    totalAmount: calculateTotal(room.pricePerNight, data.checkInDate, data.checkOutDate),
  }
  writeReservations([...reservations, newReservation])
  return newReservation
}

export async function updateReservation(id, data) {
  await delay(300)
  validateDates(data.checkInDate, data.checkOutDate)

  const reservations = readReservations()
  const reservationId = Number(id)
  const index = reservations.findIndex((r) => r.id === reservationId)
  if (index === -1) throw new Error('Réservation introuvable')
  if (reservations[index].status !== RESERVATION_STATUS.CONFIRMED) {
    throw new Error('Seule une réservation confirmée peut être modifiée')
  }

  const rooms = await getRooms()
  const room = rooms.find((r) => r.id === data.roomId)
  if (!room) throw new Error('Chambre introuvable')

  if (hasConflict(reservations, room.id, data.checkInDate, data.checkOutDate, reservationId)) {
    throw new Error(`La chambre ${room.number} est déjà réservée sur cette période`)
  }

  reservations[index] = {
    ...reservations[index],
    ...data,
    id: reservationId,
    totalAmount: calculateTotal(room.pricePerNight, data.checkInDate, data.checkOutDate),
  }
  writeReservations(reservations)
  return reservations[index]
}

export async function cancelReservation(id) {
  await delay(300)
  const reservations = readReservations()
  const index = reservations.findIndex((r) => r.id === Number(id))
  if (index === -1) throw new Error('Réservation introuvable')
  if (reservations[index].status !== RESERVATION_STATUS.CONFIRMED) {
    throw new Error('Seule une réservation confirmée peut être annulée')
  }
  reservations[index] = { ...reservations[index], status: RESERVATION_STATUS.CANCELLED }
  writeReservations(reservations)
  return reservations[index]
}