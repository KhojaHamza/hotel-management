import { ROOM_STATUS } from '../utils/roomConstants'

const STORAGE_KEY = 'hotel_rooms'

// Données de départ TEMPORAIRES : remplacées par l'API quand le backend sera branché
const SEED_ROOMS = [
  { id: 1, number: '101', type: 'Simple', capacity: 1, pricePerNight: 80, status: ROOM_STATUS.AVAILABLE },
  { id: 2, number: '102', type: 'Simple', capacity: 1, pricePerNight: 80, status: ROOM_STATUS.OCCUPIED },
  { id: 3, number: '103', type: 'Double', capacity: 2, pricePerNight: 120, status: ROOM_STATUS.AVAILABLE },
  { id: 4, number: '104', type: 'Double', capacity: 2, pricePerNight: 120, status: ROOM_STATUS.CLEANING },
  { id: 5, number: '201', type: 'Double', capacity: 2, pricePerNight: 130, status: ROOM_STATUS.AVAILABLE },
  { id: 6, number: '202', type: 'Familiale', capacity: 4, pricePerNight: 180, status: ROOM_STATUS.MAINTENANCE },
  { id: 7, number: '301', type: 'Suite', capacity: 3, pricePerNight: 250, status: ROOM_STATUS.AVAILABLE },
  { id: 8, number: '302', type: 'Suite', capacity: 4, pricePerNight: 300, status: ROOM_STATUS.OCCUPIED },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function readRooms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // données corrompues : on repart des données de départ
  }
  writeRooms(SEED_ROOMS)
  return [...SEED_ROOMS]
}

function writeRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
}

export async function getRooms() {
  await delay(300)
  return readRooms()
}

export async function getRoomById(id) {
  await delay(200)
  const room = readRooms().find((r) => r.id === Number(id))
  if (!room) throw new Error('Chambre introuvable')
  return room
}

export async function createRoom(data) {
  await delay(300)
  const rooms = readRooms()

  if (rooms.some((r) => r.number === data.number)) {
    throw new Error(`La chambre ${data.number} existe déjà`)
  }

  const newRoom = { ...data, id: Math.max(0, ...rooms.map((r) => r.id)) + 1 }
  writeRooms([...rooms, newRoom])
  return newRoom
}

export async function updateRoom(id, data) {
  await delay(300)
  const rooms = readRooms()
  const roomId = Number(id)

  if (rooms.some((r) => r.number === data.number && r.id !== roomId)) {
    throw new Error(`La chambre ${data.number} existe déjà`)
  }

  const index = rooms.findIndex((r) => r.id === roomId)
  if (index === -1) throw new Error('Chambre introuvable')

  rooms[index] = { ...rooms[index], ...data, id: roomId }
  writeRooms(rooms)
  return rooms[index]
}

export async function deleteRoom(id) {
  await delay(300)
  const rooms = readRooms()
  const room = rooms.find((r) => r.id === Number(id))

  if (!room) throw new Error('Chambre introuvable')
  if (room.status === ROOM_STATUS.OCCUPIED) {
    throw new Error('Impossible de supprimer une chambre occupée')
  }

  writeRooms(rooms.filter((r) => r.id !== room.id))
}