/**
 * Mock data store — swap these functions for real axios calls to:
 * Base URL: http://localhost:8000/api/v1
 * Auth: Authorization: Bearer <access_token>
 *
 * To migrate: replace each function body with an axios call.
 * The shape of the returned data must remain identical.
 */

import { mockUsers } from './mockData';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  /**
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {{ access_token, refresh_token, token_type }}
   */
  async login({ email, password }) {
    await delay(800);
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw { status: 401, message: 'Identifiants incorrects.' };
    // Simulate a JWT payload (base64 role claim)
    const payload = btoa(JSON.stringify({ sub: user.id, role: user.role, name: user.name }));
    return {
      access_token: `mock.${payload}.signature`,
      refresh_token: `refresh.${payload}`,
      token_type: 'bearer',
    };
  },
};

// ─── Admin Stats ──────────────────────────────────────────────────────────────
export const adminStatsService = {
  /** GET /admin/stats */
  async getStats() {
    await delay();
    return {
      total_tickets: 147,
      open_tickets: 23,
      auto_resolved_tickets: 89,
      ai_resolved_percentage: 60.5,
      resolved_by_engineer_tickets: 35,
      engineer_resolved_percentage: 23.8,
      total_escalations: 41,
      total_misassignments: 8,
      avg_resolution_time_hours: 4.2,
      avg_ai_confidence: 0.83,
    };
  },
};

// ─── Admin Tickets ────────────────────────────────────────────────────────────
export const adminTicketsService = {
  /** GET /admin/tickets */
  async getTickets({ status = '', developer_id = '', engineer_id = '', skip = 0, limit = 10 } = {}) {
    await delay();
    const { mockTickets } = await import('./mockData');
    let filtered = [...mockTickets];
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (developer_id) filtered = filtered.filter((t) => String(t.developer_id) === String(developer_id));
    if (engineer_id) filtered = filtered.filter((t) => String(t.engineer_id) === String(engineer_id));
    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);
    return { items, total, skip, limit };
  },

  /** PATCH /admin/tickets/:id/assign */
  async assignEngineer(ticketId, engineerId) {
    await delay(500);
    return { success: true };
  },
};

// ─── Admin Users ──────────────────────────────────────────────────────────────
export const adminUsersService = {
  /** GET /admin/users */
  async getUsers({ skip = 0, limit = 10 } = {}) {
    await delay();
    const total = mockUsers.length;
    const items = mockUsers.slice(skip, skip + limit);
    return { items, total, skip, limit };
  },

  /** POST /admin/users/engineer */
  async createEngineer(data) {
    await delay(600);
    return { id: Date.now(), ...data, role: 'ENGINEER' };
  },

  /** POST /admin/users/developer */
  async createDeveloper(data) {
    await delay(600);
    return { id: Date.now(), ...data, role: 'DEVELOPER' };
  },

  /** POST /admin/users/admin */
  async createAdmin(data) {
    await delay(600);
    return { id: Date.now(), ...data, role: 'ADMIN' };
  },

  /** PATCH /admin/users/:id/engineer */
  async updateEngineer(id, data) {
    await delay(600);
    return { id, ...data };
  },

  /** PATCH /admin/users/:id/developer */
  async updateDeveloper(id, data) {
    await delay(600);
    return { id, ...data };
  },

  /** DELETE /admin/users/:id */
  async deleteUser(id) {
    await delay(500);
    return { success: true };
  },
};

// ─── Admin Misassignments (Signalements) ──────────────────────────────────────
export const adminMisassignmentsService = {
  /** GET /admin/misassignments */
  async getMisassignments({ skip = 0, limit = 10 } = {}) {
    await delay();
    const { mockMisassignments } = await import('./mockData');
    const total = mockMisassignments.length;
    const items = mockMisassignments.slice(skip, skip + limit);
    return { items, total, skip, limit };
  },

  /** GET /admin/misassignments/:id */
  async getMisassignment(id) {
    await delay(400);
    const { mockMisassignments } = await import('./mockData');
    return mockMisassignments.find((m) => m.id === id) || null;
  },

  /** PATCH /admin/misassignments/:id/reassign */
  async reassign(id, newEngineerId) {
    await delay(600);
    return { success: true };
  },
};

// ─── Admin Knowledge Base ─────────────────────────────────────────────────────
export const adminKbService = {
  /** GET /admin/kb */
  async getEntries({ skip = 0, limit = 10 } = {}) {
    await delay();
    const { mockKbEntries } = await import('./mockData');
    const total = mockKbEntries.length;
    const items = mockKbEntries.slice(skip, skip + limit);
    return { items, total, skip, limit };
  },
};

// ─── Admin AI Logs ────────────────────────────────────────────────────────────
export const adminAiLogsService = {
  /** GET /admin/logs/ai */
  async getLogs({ skip = 0, limit = 10 } = {}) {
    await delay();
    const { mockAiLogs } = await import('./mockData');
    const total = mockAiLogs.length;
    const items = mockAiLogs.slice(skip, skip + limit);
    return { items, total, skip, limit };
  },
};

// ─── Admin Audit Logs ─────────────────────────────────────────────────────────
export const adminAuditLogsService = {
  /** GET /admin/logs/audit */
  async getLogs({ actor_type = '', skip = 0, limit = 10 } = {}) {
    await delay();
    const { mockAuditLogs } = await import('./mockData');
    let filtered = [...mockAuditLogs];
    if (actor_type) filtered = filtered.filter((l) => l.actor_type === actor_type);
    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);
    return { items, total, skip, limit };
  },
};

// ─── Admin Profile ────────────────────────────────────────────────────────────
export const adminProfileService = {
  /** GET /admin/profile */
  async getProfile() {
    await delay(400);
    return {
      id: 1,
      name: 'Karim Benali',
      email: 'admin@at.dz',
      role: 'ADMIN',
      is_super_admin: true,
    };
  },

  /** PATCH /admin/profile */
  async updateProfile(data) {
    await delay(600);
    return { success: true, ...data };
  },
};

// ─── Admin Notifications ──────────────────────────────────────────────────────
export const adminNotificationsService = {
  /** GET /admin/notifications */
  async getNotifications() {
    await delay(400);
    const { mockNotifications } = await import('./mockData');
    return mockNotifications;
  },

  /** PATCH /admin/notifications/:id/read */
  async markRead(id) {
    await delay(300);
    return { success: true };
  },
};
