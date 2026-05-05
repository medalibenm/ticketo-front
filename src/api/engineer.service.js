import { api } from './axios'

/**
 * Engineer service — all engineer API calls.
 * Add new endpoints here as features are implemented.
 */
export const engineerService = {

  // ─── FEATURE 13: Profile ───────────────────────────────────────────────────

  /** GET /engineer/profile */
  getProfile: () =>
    api.get('/engineer/profile').then((r) => r.data),

  /** PATCH /engineer/profile */
  updateProfile: (body) =>
    api.patch('/engineer/profile', body).then((r) => r.data),

  // ─── FEATURE 13: Notifications ────────────────────────────────────────────

  /** GET /engineer/notifications */
  getNotifications: () =>
    api.get('/engineer/notifications').then((r) => r.data),

  /** PATCH /engineer/notifications/:id/read */
  markNotificationRead: (id) =>
    api.patch(`/engineer/notifications/${id}/read`).then((r) => r.data),

  // ─── FEATURE 14: Assigned tickets ─────────────────────────────────────────

  /** GET /engineer/tickets?skip=&limit= */
  getAssignedTickets: (params) =>
    api.get('/engineer/tickets', { params }).then((r) => r.data),

  /** GET /engineer/tickets/:ticketId */
  getTicketDetail: (ticketId) =>
    api.get(`/engineer/tickets/${ticketId}`).then((r) => r.data),

  /** POST /engineer/tickets/:ticketId/response  body: { content } */
  writeResponse: (ticketId, body) =>
    api.post(`/engineer/tickets/${ticketId}/response`, body).then((r) => r.data),

  /** PUT /engineer/tickets/:ticketId/response  body: { content } */
  editResponse: (ticketId, body) =>
    api.put(`/engineer/tickets/${ticketId}/response`, body).then((r) => r.data),

  /** PATCH /engineer/tickets/:ticketId/resolve */
  resolveTicket: (ticketId) =>
    api.patch(`/engineer/tickets/${ticketId}/resolve`).then((r) => r.data),

  /** POST /engineer/tickets/:ticketId/request-context */
  requestContext: (ticketId, body) =>
    api.post(`/engineer/tickets/${ticketId}/request-context`, body).then((r) => r.data),

  /** POST /engineer/tickets/:ticketId/misassignment  body: { reason } */
  signalMisassignment: (ticketId, body) =>
    api.post(`/engineer/tickets/${ticketId}/misassignment`, body).then((r) => r.data),
}
