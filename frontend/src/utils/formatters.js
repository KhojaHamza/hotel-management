export function formatPrice(value) {
  return `${Number(value).toFixed(2)} DT`
}
export function formatDate(value) {
  return new Date(value).toLocaleDateString('fr-FR')
}
