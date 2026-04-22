import { useState } from 'react'
import { adminService } from '../../api/admin.service'

/** POST /admin/users/developer */
export function useCreateDeveloper({ onSuccess } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (body) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await adminService.createDeveloper(body)
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
