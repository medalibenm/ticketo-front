import axios from 'axios'

export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ')
  }
  return "Une erreur inattendue s'est produite."
}
