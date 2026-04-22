import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../api/admin.service'

/**
 * FEATURE 6 — Fetch a single misassignment report by ID.
 * Returns { data, isLoading, error, refetch }
 */
export function useMisassignmentDetail(reportId) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(() => {
    if (!reportId) return
    setIsLoading(true)
    setError(null)
    adminService
      .getMisassignmentDetail(reportId)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [reportId])

  useEffect(() => { fetch() }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}
