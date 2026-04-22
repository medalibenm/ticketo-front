import { useState } from 'react'
import { adminService } from '../../api/admin.service'

/** PATCH /admin/users/:userId/developer */
export function useUpdateDeveloper({ onSuccess } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (userId, body) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await adminService.updateDeveloper(userId, body)
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
