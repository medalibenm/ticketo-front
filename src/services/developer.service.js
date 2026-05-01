import { api } from '../api/axios';

export const developerService = {
  replyClarification: (ticketId, payload) => 
    api.post(`/developer/tickets/${ticketId}/reply-clarification`, payload).then(r => r.data),
};
