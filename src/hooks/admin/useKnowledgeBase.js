import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../api/admin.service'

/**
 * FEATURE 8 — Paginated knowledge base entries.
 * Returns { items, total, loading, error, page, totalPages, limit, goToPage, refetch }
 */
export function useKnowledgeBase(limit = 10) {
  const [page, setPage]   = useState(0)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchPage = useCallback(async (pageNum = 0) => {
    setLoading(true)
    setError(null)
    try {
      const result = await adminService.getKnowledgeBase({ skip: pageNum * limit, limit })
      setItems(result.items)
      setTotal(result.total)
      setPage(pageNum)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
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
    goToPage: (p) => fetchPage(p),
    refetch: () => fetchPage(page),
  }
}
