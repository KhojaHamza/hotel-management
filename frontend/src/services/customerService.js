const STORAGE_KEY = 'hotel_customers'

// Données de départ TEMPORAIRES : remplacées par l'API quand le backend sera branché
const SEED_CUSTOMERS = [
  { id: 1, firstName: 'Ahmed', lastName: 'Ben Salah', email: 'ahmed.bensalah@mail.com', phone: '98123456', nationalId: '09876543', address: 'Sousse', createdAt: '2026-10-02' },
  { id: 2, firstName: 'Sarra', lastName: 'Trabelsi', email: 'sarra.trabelsi@mail.com', phone: '97234567', nationalId: '08765432', address: 'Tunis', createdAt: '2026-10-05' },
  { id: 3, firstName: 'Karim', lastName: 'Jebali', email: 'karim.jebali@mail.com', phone: '96345678', nationalId: '07654321', address: 'Sfax', createdAt: '2026-10-11' },
  { id: 4, firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@mail.fr', phone: '+33612345678', nationalId: 'FR123456', address: 'Lyon, France', createdAt: '2026-10-20' },
  { id: 5, firstName: 'Nour', lastName: 'Hamdi', email: 'nour.hamdi@mail.com', phone: '95456789', nationalId: '06543210', address: 'Monastir', createdAt: '2026-11-01' },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function readCustomers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // données corrompues : on repart des données de départ
  }
  writeCustomers(SEED_CUSTOMERS)
  return [...SEED_CUSTOMERS]
}

function writeCustomers(customers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
}

const normalizeEmail = (email) => email.trim().toLowerCase()

export async function getCustomers() {
  await delay(300)
  return readCustomers()
}

export async function getCustomerById(id) {
  await delay(200)
  const customer = readCustomers().find((c) => c.id === Number(id))
  if (!customer) throw new Error('Client introuvable')
  return customer
}

export async function createCustomer(data) {
  await delay(300)
  const customers = readCustomers()

  if (customers.some((c) => normalizeEmail(c.email) === normalizeEmail(data.email))) {
    throw new Error('Un client avec cet email existe déjà')
  }

  const newCustomer = {
    ...data,
    id: Math.max(0, ...customers.map((c) => c.id)) + 1,
    createdAt: new Date().toISOString(),
  }
  writeCustomers([...customers, newCustomer])
  return newCustomer
}

export async function updateCustomer(id, data) {
  await delay(300)
  const customers = readCustomers()
  const customerId = Number(id)

  if (customers.some((c) => normalizeEmail(c.email) === normalizeEmail(data.email) && c.id !== customerId)) {
    throw new Error('Un client avec cet email existe déjà')
  }

  const index = customers.findIndex((c) => c.id === customerId)
  if (index === -1) throw new Error('Client introuvable')

  // on garde id et createdAt d'origine
  customers[index] = { ...customers[index], ...data, id: customerId, createdAt: customers[index].createdAt }
  writeCustomers(customers)
  return customers[index]
}

export async function deleteCustomer(id) {
  await delay(300)
  const customers = readCustomers()
  if (!customers.some((c) => c.id === Number(id))) throw new Error('Client introuvable')

  // RÈGLE À AJOUTER avec les réservations : interdire la suppression si le client a des réservations
  writeCustomers(customers.filter((c) => c.id !== Number(id)))
}