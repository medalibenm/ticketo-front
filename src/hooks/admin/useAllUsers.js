import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../api/admin.service'

/**
 * FEATURE 4 — Paginated list of all users.
 * Returns the same interface as usePaginated() so AdminUsers.jsx changes minimally.
 *   { items, total, loading, error, page, totalPages, limit, goToPage, refetch }
 */
export function useAllUsers(limit = 10) {
  const [page, setPage]   = useState(0)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchPage = useCallback(async (pageNum = 0) => {
    setLoading(true)
    setError(null)
    try {
      const result = await adminService.getAllUsers({ skip: pageNum * limit, limit })
      setItems(result.items)
      setTotal(result.total)
      setPage(pageNum)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPage(0)
  }, [fetchPage])

  const goToPage   = (p) => fetchPage(p)
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    total,
    loading,
    error,
    page,
    totalPages,
    limit,
    goToPage,
    refetch: () => fetchPage(page),
  }
}
