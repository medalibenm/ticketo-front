import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../api/admin.service'

/**
 * FEATURE 7 — Fetch admin stats.
 * Returns { data, isLoading, error, refetch }
 */
export function useStats() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    adminService
      .getStats()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}
