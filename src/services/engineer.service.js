import { api } from '../api/axios';

export const engineerService = {
  // ── Stats ─────────────────────────────────────────────────────
  getStats: () => {
    // Calculate stats purely from tickets since a dedicated stats endpoint for engineers doesn't exist
    return api.get('/engineer/tickets', { params: { limit: 100 } }).then(r => {
      const tickets = r.data.items || [];
      const totalResolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'AUTO_RESOLVED').length;
      const autoResolved = tickets.filter(t => t.status === 'AUTO_RESOLVED').length;
      const precision = totalResolved > 0 ? (autoResolved / totalResolved) * 100 : 0;
      
      return {
        total_assigned: tickets.length,
        resolved: totalResolved,
        misassigned: tickets.filter(t => t.status === 'MISASSIGNED' || t.status === 'REASSIGNED').length,
        awaiting_clarification: tickets.filter(t => t.status === 'AWAITING_CLARIFICATION').length,
        ai_precision: Math.round(precision), // Added AI precision mapping dynamically for Engineer
      };
    });
  },

  // ── Tickets (paginated + filter) ──────────────────────────────
  getTickets: async ({ skip = 0, limit = 10, status } = {}) => {
    // Backend doesn't support status filtering natively for engineers.
    // Fetch a large pool, filter manually, then slice.
    const r = await api.get('/engineer/tickets', { params: { limit: 1000 } });
    const allItems = r.data.items || [];
    
    // Filter by status if provided
    const filtered = status ? allItems.filter(t => t.status === status) : allItems;
    
    // Paginate manually
    return {
      items: filtered.slice(skip, skip + limit),
      total: filtered.length,
      skip,
      limit
    };
  },

  // ── Ticket Detail ─────────────────────────────────────────────
  getTicketDetail: (id) => api.get(`/engineer/tickets/${id}`).then(r => r.data),

  // ── Submit Response ───────────────────────────────────────────
  submitResponse: (ticketId, { response_text }) => 
    api.post(`/engineer/tickets/${ticketId}/response`, { response_text }).then(r => r.data),

  // ── Update Response ───────────────────────────────────────────
  updateResponse: (ticketId, { response_text }) => 
    api.put(`/engineer/tickets/${ticketId}/response`, { content: response_text }).then(r => r.data),

  // ── Resolve Ticket ────────────────────────────────────────────
  resolveTicket: (ticketId) => api.patch(`/engineer/tickets/${ticketId}/resolve`).then(r => r.data),

  // ── Request Context ───────────────────────────────────────────
  requestContext: (ticketId, payload) => api.post(`/engineer/tickets/${ticketId}/request-context`, payload).then(r => r.data),

  // ── Report Misassignment ──────────────────────────────────────
  reportMisassignment: (ticketId, { reason }) => 
    api.post(`/engineer/tickets/${ticketId}/misassignment`, { reason }).then(r => r.data),

  // ── Notifications ─────────────────────────────────────────────
  getNotifications: () => api.get('/engineer/notifications').then(r => r.data),

  markNotificationRead: (notificationId) => 
    api.patch(`/engineer/notifications/${notificationId}/read`).then(r => r.data),

  // ── Profile ───────────────────────────────────────────────────
  getProfile: () => api.get('/engineer/profile').then(r => r.data),

  updateProfile: (body) => api.patch('/engineer/profile', body).then(r => r.data),
};
