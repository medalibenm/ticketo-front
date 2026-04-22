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
}
