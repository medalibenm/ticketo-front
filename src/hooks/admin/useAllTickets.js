import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../api/admin.service'

/**
 * FEATURE 5 — Paginated list of all tickets with optional filters.
 * @param {object} filters  { status, developer_id, engineer_id }
 * @param {number} limit
 * Returns { items, total, loading, error, page, totalPages, limit, goToPage, refetch }
 */
export function useAllTickets(filters = {}, limit = 10) {
  const [page, setPage]   = useState(0)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchPage = useCallback(async (pageNum = 0, overrideFilters) => {
    setLoading(true)
    setError(null)
    try {
      const params = { ...(overrideFilters ?? filters), skip: pageNum * limit, limit }
      const result = await adminService.getAllTickets(params)
      setItems(result.items)
      setTotal(result.total)
      setPage(pageNum)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit])

  useEffect(() => { fetchPage(0) }, [fetchPage])

  return {
    items,
    total,
    loading,
    error,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
    goToPage: (p, f) => fetchPage(p, f),
    refetch: () => fetchPage(page),
  }
}
