import { developerService as api } from '../api/developer.service';

const normalizeClarificationSession = (session) => {
  if (!session) return null;
  return session.clarification_session ?? session.session ?? session;
};

const toTicketList = (data) => {
  const items = data?.items ?? (Array.isArray(data) ? data : []);
  const sortedItems = [...items].sort((left, right) => {
    const leftCreated = new Date(left?.created_at || 0).getTime();
    const rightCreated = new Date(right?.created_at || 0).getTime();
    return rightCreated - leftCreated;
  });

  return {
    ...data,
    items: sortedItems,
    total: data?.total ?? sortedItems.length,
    skip: data?.skip ?? 0,
    limit: data?.limit ?? sortedItems.length,
  };
};

export const developerService = {
  // ── Profile ───────────────────────────────────────────────────
  getProfile: () => api.getProfile(),

  updateProfile: (body) => api.updateProfile(body),

  // ── Notifications ─────────────────────────────────────────────
  getNotifications: () => api.getNotifications(),

  markNotificationRead: (id) => api.markNotificationRead(id),

  // ── Tickets ───────────────────────────────────────────────────
  getMyTickets: ({ skip = 0, limit = 10, status } = {}) =>
    api.getMyTickets({ skip, limit, ...(status ? { status } : {}) }).then(toTicketList),

  createTicket: (body) => api.createTicket(body),

  getTicketDetail: async (ticketId) => {
    const ticket = await api.getTicketDetail(ticketId);
    let clarificationSession = null;

    try {
      clarificationSession = normalizeClarificationSession(await api.getClarificationSession(ticketId));
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

    if (ticket?.analysis_data && !ticket.analysis) {
      ticket.analysis = ticket.analysis_data;
    }

    if (ticket?.ai_response) {
      ticket.ai_response.content =
        ticket.ai_response.content ?? ticket.ai_response.response_text ?? ticket.ai_response.message;
    }

    if (ticket?.engineer_response) {
      ticket.engineer_response.response_text =
        ticket.engineer_response.response_text ?? ticket.engineer_response.content;
    }

    return ticket;
  },

  // ── Attachments ───────────────────────────────────────────────
  uploadAttachment: (ticketId, file) => api.uploadAttachment(ticketId, file),

  // ── Clarification ─────────────────────────────────────────────
  getClarificationSession: (ticketId) => api.getClarificationSession(ticketId),

  answerClarification: (ticketId, payload) =>
    api.answerClarification(ticketId, payload),

  // ── Refill ────────────────────────────────────────────────────
  refillTicket: (ticketId, body) => api.refillTicket(ticketId, body),

  // ── Legacy alias ──────────────────────────────────────────────
  replyClarification: (ticketId, { message }) =>
    api.answerClarification(ticketId, { content: message }),
};
