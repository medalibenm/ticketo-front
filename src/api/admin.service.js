import { api } from './axios'

export const adminService = {
  getProfile: () =>
    api.get('/admin/profile').then((r) => r.data),

  updateProfile: (body) =>
    api.patch('/admin/profile', body).then((r) => r.data),

  getMisassignments: (params) =>
    api.get('/admin/misassignments', { params }).then((r) => r.data),

  getMisassignmentDetail: (reportId) =>
    api.get(`/admin/misassignments/${reportId}`).then((r) => r.data),

  reassignTicket: (reportId, body) =>
    api.patch(`/admin/misassignments/${reportId}/reassign`, body).then((r) => r.data),

  getNotifications: () =>
    api.get('/admin/notifications').then((r) => r.data),

  markNotificationRead: (id) =>
    api.patch(`/admin/notifications/${id}/read`).then((r) => r.data),

  getAllUsers: (params) =>
    api.get('/admin/users', { params }).then((r) => r.data),

  createEngineer: (body) =>
    api.post('/admin/users/engineer', body).then((r) => r.data),

  createDeveloper: (body) =>
    api.post('/admin/users/developer', body).then((r) => r.data),

  createAdmin: (body) =>
    api.post('/admin/users/admin', body).then((r) => r.data),

  deleteUser: (userId) =>
    api.delete(`/admin/users/${userId}`).then((r) => r.data),

  updateDeveloper: (userId, body) =>
    api.patch(`/admin/users/${userId}/developer`, body).then((r) => r.data),

  updateEngineer: (userId, body) =>
    api.patch(`/admin/users/${userId}/engineer`, body).then((r) => r.data),

  getAllTickets: (params) =>
    api.get('/admin/tickets', { params }).then((r) => r.data),

  assignTicket: (ticketId, body) =>
    api.patch(`/admin/tickets/${ticketId}/assign`, body).then((r) => r.data),

  getStats: () =>
    api.get('/admin/stats').then((r) => r.data),

  getEngineerStats: (engineerId) =>
    api.get(`/admin/stats/engineers/${engineerId}`).then((r) => r.data),

  getKnowledgeBase: (params) =>
    api.get('/admin/kb', { params }).then((r) => r.data),

  getAILogs: async (params) => {
    const r = await api.get('/admin/logs/ai', { params: { limit: 1000 } });
    const allData = r.data;
    const items = Array.isArray(allData) ? allData : (allData.items || []);
    // sort or filter if needed, paginate manually
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    return {
      items: items.slice(skip, skip + limit),
      total: items.length
    };
  },

  getAuditLogs: async (params) => {
    const r = await api.get('/admin/logs/audit', { params: { limit: 1000, actor_type: params?.actor_type } });
    const allData = r.data;
    let items = Array.isArray(allData) ? allData : (allData.items || []);
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    return {
      items: items.slice(skip, skip + limit),
      total: items.length
    };
  },
}
