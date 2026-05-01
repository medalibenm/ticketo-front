import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/auth.store'

export function useWebSocket(onNotification) {
  const { userId, accessToken } = useAuthStore()
  const wsRef = useRef(null)
  const retryRef = useRef(null)

  useEffect(() => {
    if (!userId || !accessToken) return

    const connect = () => {
      // Safely derive WS URL if VITE_WS_BASE_URL is missing
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const wsBase = import.meta.env.VITE_WS_BASE_URL || apiBase.replace(/^http/, 'ws');
      
      // Sending both 'token' and 'access_token' in case the backend expects one or the other
      const wsUrl = `${wsBase}/ws/${userId}?token=${accessToken}&access_token=${accessToken}`;
      
      const ws = new WebSocket(wsUrl);

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
