import { api } from './axios'

export const authService = {
  login: (body) =>
    api.post('/auth/login', body).then((r) => r.data),

  refresh: (refresh_token) =>
    api.post('/auth/refresh', { refresh_token }).then((r) => r.data),
}
