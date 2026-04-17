import { useState, useEffect, useCallback } from 'react';

/**
 * Generic async data hook.
 * Usage: const { data, loading, error, refetch } = useAsync(myService.getItems, params);
 */
export function useAsync(asyncFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

/**
 * Paginated list hook.
 */
export function usePaginated(asyncFn, extraParams = {}, limit = 10) {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (pageNum = 0, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn({ ...params, skip: pageNum * limit, limit });
      setItems(result.items);
      setTotal(result.total);
      setPage(pageNum);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [asyncFn, limit]);

  useEffect(() => {
    fetch(0, extraParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = (p, params) => fetch(p, params || extraParams);

  const totalPages = Math.ceil(total / limit);

  return { items, total, loading, error, page, totalPages, limit, goToPage, refetch: (p) => fetch(p ?? page, extraParams) };
}
