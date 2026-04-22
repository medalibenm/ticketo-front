import { useState } from 'react'
import { adminService } from '../../api/admin.service'

/** DELETE /admin/users/:userId */
export function useDeleteUser({ onSuccess } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (userId) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await adminService.deleteUser(userId)
      if (onSuccess) onSuccess(data, userId)
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
