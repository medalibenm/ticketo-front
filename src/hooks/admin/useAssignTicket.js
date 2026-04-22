import { useState } from 'react'
import { adminService } from '../../api/admin.service'

/**
 * FEATURE 5 — Assign a ticket to an engineer.
 * PATCH /admin/tickets/:ticketId/assign  body: { engineer_id }
 */
export function useAssignTicket({ onSuccess } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (ticketId, body) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await adminService.assignTicket(ticketId, body)
      if (onSuccess) onSuccess(data)
      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading, error }
}
