import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      role: null,

      setTokens: (access, refresh) => {
        const payload = jwtDecode(access)
        set({
          accessToken: access,
          refreshToken: refresh,
          userId: Number(payload.sub),
          role: payload.role,
        })
      },

      clearTokens: () =>
        set({ accessToken: null, refreshToken: null, userId: null, role: null }),
    }),
    {
      name: 'at-auth',
      // Only persist refreshToken — accessToken stays in memory only
      partialize: (state) => ({ refreshToken: state.refreshToken }),
    }
  )
)
