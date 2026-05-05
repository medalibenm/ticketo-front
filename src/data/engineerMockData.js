/**
 * Engineer Module — Mock Data
 * Structured to match the FastAPI response schemas exactly.
 * When connecting to the real backend, only the service layer changes.
 */

// ── Engineer Profile ──────────────────────────────────────────────
export const mockEngineerProfile = {
  id: 4,
  name: 'Jean Dupont',
  email: 'jean.dupont@atsystem.com',
  role: 'ENGINEER',
  specialite: 'Cloud Architecture',
  niveau: 'SENIOR',
  disponibilite: true,
  created_at: '2025-09-15T08:30:00Z',
};

// ── Engineer Stats ────────────────────────────────────────────────
export const mockEngineerStats = {
  total_assigned: 12,
  resolved: 8,
  misassigned: 1,
  awaiting_clarification: 3,
};

// ── Tickets ───────────────────────────────────────────────────────
export const mockEngineerTickets = [
  {
    id: 1,
    title: 'Critical latency in Auth-Service middleware during peak hours',
    category: 'API_GATEWAY',
    status: 'IN_PROGRESS',
    developer_id: 2,
    developer_name: 'Alice Martin',
    created_at: '2026-04-27T10:15:00Z',
    updated_at: '2026-04-27T14:30:00Z',
    description:
      'Users are reporting timeouts exceeding 5000ms when attempting to authenticate between 09:00 and 11:00 CET. Initial logs suggest a bottleneck in the JWT validation handshake. This is impacting 15% of the total user base. No recent deployments have been flagged as the cause.',
    analysis: {
      categorie_detectee: 'API_GATEWAY',
      decision: 'ESCALATE_DIRECTLY',
      decision_reason: 'High severity latency in authentication flow affecting significant user base percentage.',
      score_richesse: 0.68,
      score_similarite: 0.45,
    },
    clarification_session: {
      status: 'CLOSED',
      summary:
        'The engineering team confirmed that the bottleneck is likely at the Redis cache level where session states are stored. We need a thorough investigation of the cache hit ratio during these spikes.',
      messages: [
        { id: 1, sender: 'BOT', content: 'Could you specify the exact error codes returned during the latency spikes?', created_at: '2026-04-27T10:20:00Z' },
        { id: 2, sender: 'USER', content: 'The errors are 504 Gateway Timeout. The auth service pods show high memory usage around 85% during those windows.', created_at: '2026-04-27T10:25:00Z' },
        { id: 3, sender: 'BOT', content: 'Are there any correlated spikes in your Redis cache layer metrics?', created_at: '2026-04-27T10:28:00Z' },
        { id: 4, sender: 'USER', content: 'Yes, the cache hit ratio drops from 95% to around 40% during those time windows.', created_at: '2026-04-27T10:35:00Z' },
      ],
    },
    engineer_response: null,
    ai_response: null,
    attachments: [
      { id: 1, file_name: 'auth_service_logs.txt', file_type: 'text/plain', file_url: '/uploads/1/auth_service_logs.txt' },
      { id: 2, file_name: 'redis_metrics_screenshot.png', file_type: 'image/png', file_url: '/uploads/2/redis_metrics_screenshot.png' },
    ],
  },
  {
    id: 2,
    title: 'S3 Bucket Permission Mismatch - Production',
    category: 'STORAGE',
    status: 'IN_PROGRESS',
    developer_id: 3,
    developer_name: 'Omar Bensalah',
    created_at: '2026-04-26T16:45:00Z',
    updated_at: '2026-04-27T09:12:00Z',
    description:
      'Production S3 bucket `at-prod-assets` returning 403 Forbidden for GET requests from the CDN distribution. IAM policy was last updated 3 days ago during a routine security audit.',
    analysis: {
      categorie_detectee: 'STORAGE',
      decision: 'ESCALATE_DIRECTLY',
      decision_reason: 'S3 permission mismatch likely caused by recent IAM policy update.',
      score_richesse: 0.82,
      score_similarite: 0.61,
    },
    clarification_session: null,
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
  {
    id: 3,
    title: 'OAuth2 Token Revocation Failure',
    category: 'SECURITY',
    status: 'AWAITING_CLARIFICATION',
    developer_id: 5,
    developer_name: 'Yassine Khelifi',
    created_at: '2026-04-25T14:00:00Z',
    updated_at: '2026-04-26T18:20:00Z',
    description:
      'Token revocation endpoint not properly invalidating refresh tokens. Revoked tokens can still be used to generate new access tokens for up to 30 minutes.',
    analysis: {
      categorie_detectee: 'SECURITY',
      decision: 'OPEN_CLARIFICATION',
      decision_reason: 'Need more context on token storage mechanism and revocation list implementation.',
      score_richesse: 0.55,
      score_similarite: 0.33,
    },
    clarification_session: {
      status: 'OPEN',
      summary: null,
      messages: [
        { id: 1, sender: 'BOT', content: 'What token storage backend are you using? Redis, database, or in-memory?', created_at: '2026-04-25T14:05:00Z' },
      ],
    },
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
  {
    id: 4,
    title: 'Stripe Webhook Endpoint returning 500',
    category: 'API_GATEWAY',
    status: 'IN_PROGRESS',
    developer_id: 2,
    developer_name: 'Alice Martin',
    created_at: '2026-04-24T09:30:00Z',
    updated_at: '2026-04-26T11:45:00Z',
    description:
      'Stripe webhook handler at `/api/webhooks/stripe` returning 500 for `invoice.payment_succeeded` events. Other event types process correctly.',
    analysis: null,
    clarification_session: null,
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
  {
    id: 5,
    title: 'Database connection pool exhaustion under load',
    category: 'DATABASE',
    status: 'RESOLVED',
    developer_id: 7,
    developer_name: 'Fatima Zerhouni',
    created_at: '2026-04-20T08:00:00Z',
    updated_at: '2026-04-22T16:30:00Z',
    description:
      'PostgreSQL connection pool (max 20 connections) is being exhausted during peak traffic, causing cascade failures across all API endpoints.',
    analysis: {
      categorie_detectee: 'DATABASE',
      decision: 'ESCALATE_DIRECTLY',
      decision_reason: 'Critical infrastructure issue requiring immediate attention.',
      score_richesse: 0.91,
      score_similarite: 0.72,
    },
    clarification_session: null,
    engineer_response: {
      id: 1,
      response_text:
        'Increased connection pool size to 50, implemented connection timeout of 30s, and added PgBouncer as a connection pooler. Monitored for 48 hours with zero pool exhaustion events.',
      created_at: '2026-04-22T16:30:00Z',
    },
    ai_response: null,
    attachments: [],
  },
  {
    id: 6,
    title: 'Kubernetes pod crashloop in staging environment',
    category: 'DEPLOYMENT',
    status: 'RESOLVED',
    developer_id: 3,
    developer_name: 'Omar Bensalah',
    created_at: '2026-04-18T11:20:00Z',
    updated_at: '2026-04-19T14:00:00Z',
    description:
      'The `user-service` pod in staging is in CrashLoopBackOff. Logs show OOMKilled errors. The pod memory limit is set to 256Mi.',
    analysis: null,
    clarification_session: null,
    engineer_response: {
      id: 2,
      response_text:
        'Increased memory limit to 512Mi and added memory profiling. Root cause was a memory leak in the image processing module. Applied patch and deployed fix.',
      created_at: '2026-04-19T14:00:00Z',
    },
    ai_response: null,
    attachments: [],
  },
  {
    id: 7,
    title: 'SSL certificate renewal failure on load balancer',
    category: 'NETWORK',
    status: 'OPEN',
    developer_id: 8,
    developer_name: 'Karim Hadj',
    created_at: '2026-04-27T07:00:00Z',
    updated_at: '2026-04-27T07:00:00Z',
    description:
      'Let\'s Encrypt certificate auto-renewal failed for `api.atsystem.dz`. The cert expires in 5 days. Certbot logs show DNS validation errors.',
    analysis: null,
    clarification_session: null,
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
  {
    id: 8,
    title: 'Nginx reverse proxy misconfiguration after update',
    category: 'SERVER_OS',
    status: 'IN_PROGRESS',
    developer_id: 2,
    developer_name: 'Alice Martin',
    created_at: '2026-04-23T13:10:00Z',
    updated_at: '2026-04-25T10:00:00Z',
    description:
      'After upgrading Nginx from 1.24 to 1.25, the `proxy_pass` directives for the microservices backend are returning 502 Bad Gateway intermittently.',
    analysis: {
      categorie_detectee: 'SERVER_OS',
      decision: 'ESCALATE_DIRECTLY',
      decision_reason: 'Configuration-level issue post-upgrade requiring manual review.',
      score_richesse: 0.74,
      score_similarite: 0.58,
    },
    clarification_session: null,
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
];

// ── Notifications ─────────────────────────────────────────────────
export const mockEngineerNotifications = [
  { id: 1, message: 'Nouveau ticket assigné : "Critical latency in Auth-Service"', is_read: false, created_at: '2026-04-27T10:16:00Z' },
  { id: 2, message: 'Le développeur Alice Martin a mis à jour le ticket #4', is_read: false, created_at: '2026-04-26T11:50:00Z' },
  { id: 3, message: 'Ticket #5 résolu — entrée ajoutée à la base de connaissances', is_read: true, created_at: '2026-04-22T16:35:00Z' },
  { id: 4, message: 'Le développeur Yassine a répondu à la clarification du ticket #3', is_read: true, created_at: '2026-04-26T18:25:00Z' },
  { id: 5, message: 'Signalement du ticket #6 examiné par l\'administrateur', is_read: true, created_at: '2026-04-19T15:00:00Z' },
];
