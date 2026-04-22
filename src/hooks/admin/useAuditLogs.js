import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../api/admin.service'

/**
 * FEATURE 8 — Paginated audit logs, filterable by actor_type.
 * @param {string} actorType  '' | 'ADMIN' | 'ENGINEER' | 'DEVELOPER'
 * Returns { items, total, loading, error, page, totalPages, limit, goToPage, refetch }
 */
export function useAuditLogs(actorType = '', limit = 10) {
  const [page, setPage]   = useState(0)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchPage = useCallback(async (pageNum = 0) => {
    setLoading(true)
    setError(null)
    try {
      const params = { skip: pageNum * limit, limit }
      if (actorType) params.actor_type = actorType
      const result = await adminService.getAuditLogs(params)
      setItems(result.items)
      setTotal(result.total)
      setPage(pageNum)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  // Re-fetch from page 0 whenever actorType changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actorType, limit])

  useEffect(() => { fetchPage(0) }, [fetchPage])

  return {
    items,
    total,
    loading,
    error,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
    goToPage: (p) => fetchPage(p),
    refetch: () => fetchPage(page),
  }
}
