export const dummyAsync = async () => [];
export const dummyPaginated = async () => ({ items: [], total: 0 });

export const adminAuditLogsService = { getLogs: dummyPaginated };
export const adminAiLogsService = { getLogs: dummyPaginated };
export const adminKbService = { getEntries: dummyPaginated };
export const adminStatsService = { getStats: dummyAsync };
export const adminMisassignmentsService = { getReports: dummyPaginated };
export const adminTicketsService = { getAllTickets: dummyPaginated, getTickets: dummyPaginated };
export const adminUsersService = { getAllUsers: dummyPaginated, getDashboardStats: dummyAsync, getUsers: dummyPaginated };
export const adminNotificationsService = { getNotifications: dummyAsync, markNotificationRead: dummyAsync, markAsRead: dummyAsync };
export const adminProfileService = { getProfile: dummyAsync, updateProfile: dummyAsync };
export const authService = { };
export const mockData = { };
