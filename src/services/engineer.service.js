import { engineerService as api } from '../api/engineer.service';

const toItems = (data) =>
  data?.items ?? (Array.isArray(data) ? data : []);

const normalizeClarificationSession = (session) => {
  if (!session) return null;
  return session.clarification_session ?? session.session ?? session;
};

export const engineerService = {
  // ── Stats (computed from tickets) ─────────────────────────────
  getStats: () =>
    api.getAssignedTickets({ limit: 1000 }).then((data) => {
      const items = toItems(data);
      const resolved = items.filter(
        (t) => t.status === 'RESOLVED' || t.status === 'AUTO_RESOLVED'
      ).length;
      const autoResolved = items.filter((t) => t.status === 'AUTO_RESOLVED').length;
      return {
        total_assigned: data?.total ?? items.length,
        resolved,
        misassigned: items.filter(
          (t) => t.status === 'MISASSIGNED' || t.status === 'REASSIGNED'
        ).length,
        awaiting_clarification: items.filter(
          (t) => t.status === 'AWAITING_CLARIFICATION'
        ).length,
        ai_precision: resolved > 0 ? Math.round((autoResolved / resolved) * 100) : 0,
      };
    }),

  // ── Tickets (paginated + client-side status filter) ───────────
  getTickets: async ({ skip = 0, limit = 10, status } = {}) => {
    if (status) {
      const data = await api.getAssignedTickets({ limit: 1000 });
      const items = toItems(data);
      const filtered = items.filter((t) => t.status === status);
      return { items: filtered.slice(skip, skip + limit), total: filtered.length, skip, limit };
    }
    return api.getAssignedTickets({ skip, limit });
  },

  // ── Ticket Detail ─────────────────────────────────────────────
  getTicketDetail: async (id) => {
    const ticket = await api.getTicketDetail(id);
    let clarificationSession = null;

    try {
      clarificationSession = normalizeClarificationSession(await api.getClarificationSession?.(id));
    } catch {
      clarificationSession = null;
    }

    if (clarificationSession) {
      const existingMessages = ticket?.clarification_session?.messages || [];
      const incomingMessages = clarificationSession.messages || [];
      const shouldReplaceSession = !ticket.clarification_session || existingMessages.length === 0;

      if (shouldReplaceSession) {
        ticket.clarification_session = {
          ...(ticket.clarification_session || {}),
          ...clarificationSession,
          messages: incomingMessages.length > 0 ? incomingMessages : existingMessages,
        };
      }
    }

    if (ticket?.engineer_response) {
      ticket.engineer_response.response_text =
        ticket.engineer_response.response_text ?? ticket.engineer_response.content;
    }
    return ticket;
  },

  // ── Submit Response (POST — new) ──────────────────────────────
  submitResponse: (ticketId, { response_text }) =>
    api.writeResponse(ticketId, { response_text }),

  // ── Update Response (PUT — edit) ──────────────────────────────
  updateResponse: (ticketId, { response_text }) =>
    api.editResponse(ticketId, { response_text }),

  // ── Resolve Ticket ────────────────────────────────────────────
  resolveTicket: (ticketId) => api.resolveTicket(ticketId),

  // ── Request Context ──────────────────────────────────────────
  requestContext: (ticketId, { message }) =>
    api.requestContext(ticketId, {
      message,
      content: message,
    }),

  // ── Report Misassignment ──────────────────────────────────────
  reportMisassignment: (ticketId, { reason }) =>
    api.signalMisassignment(ticketId, { reason }),

  // ── Notifications ─────────────────────────────────────────────
  getNotifications: () => api.getNotifications(),

  markNotificationRead: (id) => api.markNotificationRead(id),

  // ── Profile ───────────────────────────────────────────────────
  getProfile: () => api.getProfile(),

  updateProfile: (body) => api.updateProfile(body),
};
