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
}
