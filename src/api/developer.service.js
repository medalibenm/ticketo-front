import { api } from './axios'

/**
 * Developer service — all developer API calls.
 * Add new endpoints here as features are implemented.
 */
export const developerService = {

  // ─── FEATURE 9: Profile ────────────────────────────────────────────────────

  /** GET /developer/profile */
  getProfile: () =>
    api.get('/developer/profile').then((r) => r.data),

  /** PATCH /developer/profile */
  updateProfile: (body) =>
    api.patch('/developer/profile', body).then((r) => r.data),

  // ─── FEATURE 9: Notifications ─────────────────────────────────────────────

  /** GET /developer/notifications */
  getNotifications: () =>
    api.get('/developer/notifications').then((r) => r.data),

  /** PATCH /developer/notifications/:id/read */
  markNotificationRead: (id) =>
    api.patch(`/developer/notifications/${id}/read`).then((r) => r.data),

  // ─── FEATURE 10: Tickets ──────────────────────────────────────────────────

  /** GET /developer/tickets?status=&skip=&limit= */
  getMyTickets: (params) =>
    api.get('/developer/tickets', { params }).then((r) => r.data),

  /** POST /developer/tickets */
  createTicket: (body) =>
    api.post('/developer/tickets', body).then((r) => r.data),

  /** GET /developer/tickets/:ticketId */
  getTicketDetail: (ticketId) =>
    api.get(`/developer/tickets/${ticketId}`).then((r) => r.data),

  // ─── FEATURE 11: Attachments ──────────────────────────────────────────────

  /** POST /developer/tickets/:ticketId/attachments  (multipart/form-data) */
  uploadAttachment: (ticketId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(
      `/developer/tickets/${ticketId}/attachments`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then((r) => r.data)
  },

  // ─── FEATURE 12: Clarification + Refill ───────────────────────────────────

  /** GET /developer/tickets/:ticketId/clarification */
  getClarificationSession: (ticketId) =>
    api.get(`/developer/tickets/${ticketId}/clarification`).then((r) => r.data),

  /** POST /developer/tickets/:ticketId/clarification/messages */
  answerClarification: (ticketId, body) =>
    api.post(`/developer/tickets/${ticketId}/clarification/messages`, body).then((r) => r.data),

  /** PATCH /developer/tickets/:ticketId/refill */
  refillTicket: (ticketId, body) =>
    api.patch(`/developer/tickets/${ticketId}/refill`, body).then((r) => r.data),
}
