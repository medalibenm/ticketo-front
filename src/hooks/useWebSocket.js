import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/auth.store'

export function useWebSocket(onNotification) {
  const { userId, accessToken } = useAuthStore()
  const wsRef = useRef(null)
  const retryRef = useRef(null)

  useEffect(() => {
    if (!userId || !accessToken) return

    const connect = () => {
      const ws = new WebSocket(
        `${import.meta.env.VITE_WS_BASE_URL}/ws/${userId}?token=${accessToken}`
      )

      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data)
          onNotification(notification)
        } catch {}
      }

      ws.onclose = () => {
        retryRef.current = setTimeout(connect, 5000)
      }

      ws.onerror = () => ws.close()
      wsRef.current = ws
    }

    connect()

    return () => {
      clearTimeout(retryRef.current)
      wsRef.current?.close()
    }
  }, [userId, accessToken])
}
