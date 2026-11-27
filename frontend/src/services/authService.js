import { ROLES } from '../utils/roles'

const STORAGE_KEY = 'hotel_auth_user'

// Comptes de test TEMPORAIRES : seront supprimés quand le backend sera branché
const MOCK_USERS = [
  { id: 1, name: 'Admin', email: 'admin@hotel.com', password: 'admin123', role: ROLES.ADMIN },
  { id: 2, name: 'Manager', email: 'manager@hotel.com', password: 'manager123', role: ROLES.MANAGER },
  { id: 3, name: 'Réceptionniste', email: 'reception@hotel.com', password: 'reception123', role: ROLES.RECEPTIONIST },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function login(email, password) {
  await delay(400) // simule la latence réseau

  const found = MOCK_USERS.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  )
  if (!found) {
    throw new Error('Email ou mot de passe incorrect')
  }

  const { password: _password, ...user } = found // on retire le mot de passe
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}