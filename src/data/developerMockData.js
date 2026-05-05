/**
 * Developer Module — Mock Data
 * Structured to match the FastAPI response schemas exactly.
 * When connecting to the real backend, only the service layer changes.
 */

// ── Developer Profile ─────────────────────────────────────────────
export const mockDeveloperProfile = {
  id: 2,
  name: 'Alice Martin',
  email: 'alice.martin@atsystem.com',
  role: 'DEVELOPER',
  created_at: '2025-10-01T09:00:00Z',
};

// ── Developer Tickets ─────────────────────────────────────────────
export const mockDeveloperTickets = [
  {
    id: 101,
    title: 'Critical latency in Auth-Service middleware during peak hours',
    category: 'API_GATEWAY',
    status: 'IN_PROGRESS',
    developer_id: 2,
    engineer_id: 4,
    engineer_name: 'Jean Dupont',
    created_at: '2026-04-27T10:15:00Z',
    updated_at: '2026-04-27T14:30:00Z',
    description:
      'Users are reporting timeouts exceeding 5000ms when attempting to authenticate between 09:00 and 11:00 CET. Initial logs suggest a bottleneck in the JWT validation handshake. This is impacting 15% of the total user base. No recent deployments have been flagged as the cause.',
    analysis: {
      categorie_detectee: 'API_GATEWAY',
      decision: 'ESCALATE_DIRECTLY',
      decision_reason: 'High-impact authentication failure affecting significant user percentage during business hours.',
      score_richesse: 0.72,
      score_similarite: 0.48,
    },
    clarification_session: {
      status: 'CLOSED',
      summary:
        'The issue is traced to a cache miss surge in the Redis layer, causing cascading failures in the auth service.',
      messages: [
        { id: 1, sender: 'BOT', content: 'What error codes are returned during the timeouts?', created_at: '2026-04-27T10:20:00Z' },
        { id: 2, sender: 'USER', content: '504 Gateway Timeout. The auth pods show 85% memory usage during spikes.', created_at: '2026-04-27T10:25:00Z' },
        { id: 3, sender: 'BOT', content: 'Is there a correlated spike in your Redis cache metrics?', created_at: '2026-04-27T10:28:00Z' },
        { id: 4, sender: 'USER', content: 'Yes, cache hit ratio drops from 95% to ~40% during those windows.', created_at: '2026-04-27T10:35:00Z' },
      ],
    },
    engineer_response: null,
    ai_response: null,
    attachments: [
      { id: 1, file_name: 'auth_service_logs.txt', file_type: 'text/plain', file_url: '/uploads/101/auth_service_logs.txt' },
      { id: 2, file_name: 'redis_metrics.png', file_type: 'image/png', file_url: '/uploads/101/redis_metrics.png' },
    ],
  },
  {
    id: 102,
    title: 'S3 Bucket Permission Mismatch in Production',
    category: 'STORAGE',
    status: 'IN_PROGRESS',
    developer_id: 2,
    engineer_id: 4,
    engineer_name: 'Jean Dupont',
    created_at: '2026-04-26T16:45:00Z',
    updated_at: '2026-04-27T09:12:00Z',
    description:
      'Production S3 bucket `at-prod-assets` returning 403 Forbidden for GET requests from the CDN distribution. IAM policy was updated 3 days ago during a routine security audit.',
    analysis: {
      categorie_detectee: 'STORAGE',
      decision: 'ESCALATE_DIRECTLY',
      decision_reason: 'Critical production storage access failure likely caused by recent IAM policy changes.',
      score_richesse: 0.85,
      score_similarite: 0.63,
    },
    clarification_session: null,
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
  {
    id: 103,
    title: 'OAuth2 Token Revocation Not Working',
    category: 'SECURITY',
    status: 'AWAITING_CLARIFICATION',
    developer_id: 2,
    engineer_id: null,
    engineer_name: null,
    created_at: '2026-04-25T14:00:00Z',
    updated_at: '2026-04-26T18:20:00Z',
    description:
      'Token revocation endpoint is not properly invalidating refresh tokens. Revoked tokens can still generate new access tokens for up to 30 minutes after revocation.',
    analysis: {
      categorie_detectee: 'SECURITY',
      decision: 'OPEN_CLARIFICATION',
      decision_reason: 'Need additional context on token storage mechanism and revocation list implementation.',
      score_richesse: 0.56,
      score_similarite: 0.34,
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
    id: 104,
    title: 'Stripe Webhook Endpoint Returning 500',
    category: 'API_GATEWAY',
    status: 'OPEN',
    developer_id: 2,
    engineer_id: null,
    engineer_name: null,
    created_at: '2026-04-24T09:30:00Z',
    updated_at: '2026-04-24T09:30:00Z',
    description:
      'The Stripe webhook handler at `/api/webhooks/stripe` is returning 500 for `invoice.payment_succeeded` events. All other event types process correctly. This started after the last deployment.',
    analysis: null,
    clarification_session: null,
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
  {
    id: 105,
    title: 'Database Connection Pool Exhaustion Under Load',
    category: 'DATABASE',
    status: 'RESOLVED',
    developer_id: 2,
    engineer_id: 4,
    engineer_name: 'Jean Dupont',
    created_at: '2026-04-20T08:00:00Z',
    updated_at: '2026-04-22T16:30:00Z',
    description:
      'PostgreSQL connection pool (max 20 connections) is being exhausted during peak traffic, causing cascade failures across all API endpoints.',
    analysis: {
      categorie_detectee: 'DATABASE',
      decision: 'ESCALATE_DIRECTLY',
      decision_reason: 'Critical infrastructure issue requiring immediate engineering attention.',
      score_richesse: 0.92,
      score_similarite: 0.74,
    },
    clarification_session: null,
    engineer_response: {
      response_text:
        'Increased connection pool size to 50 connections, implemented 30s connection timeout, and added PgBouncer as a connection pooler. Monitored for 48 hours — zero pool exhaustion events observed.',
      created_at: '2026-04-22T16:30:00Z',
    },
    ai_response: null,
    attachments: [],
  },
  {
    id: 106,
    title: 'Kubernetes Pod CrashLoop in Staging Environment',
    category: 'DEPLOYMENT',
    status: 'RESOLVED',
    developer_id: 2,
    engineer_id: 4,
    engineer_name: 'Jean Dupont',
    created_at: '2026-04-18T11:20:00Z',
    updated_at: '2026-04-19T14:00:00Z',
    description:
      'The `user-service` pod in staging is in CrashLoopBackOff. Logs show OOMKilled errors. The pod memory limit is set to 256Mi.',
    analysis: null,
    clarification_session: null,
    engineer_response: {
      response_text:
        'Increased memory limit to 512Mi and applied memory profiling. Root cause: a memory leak in the image processing module. Patch applied and deployed successfully.',
      created_at: '2026-04-19T14:00:00Z',
    },
    ai_response: null,
    attachments: [
      { id: 3, file_name: 'pod_crash_logs.txt', file_type: 'text/plain', file_url: '/uploads/106/pod_crash_logs.txt' },
    ],
  },
  {
    id: 107,
    title: 'SSL Certificate Renewal Failure on Load Balancer',
    category: 'NETWORK',
    status: 'OPEN',
    developer_id: 2,
    engineer_id: null,
    engineer_name: null,
    created_at: '2026-04-27T07:00:00Z',
    updated_at: '2026-04-27T07:00:00Z',
    description:
      "Let's Encrypt certificate auto-renewal failed for `api.atsystem.dz`. The cert expires in 5 days. Certbot logs show DNS validation errors.",
    analysis: null,
    clarification_session: null,
    engineer_response: null,
    ai_response: null,
    attachments: [],
  },
  {
    id: 108,
    title: 'Nginx Reverse Proxy Misconfiguration After Update',
    category: 'SERVER_OS',
    status: 'AUTO_RESOLVED',
    developer_id: 2,
    engineer_id: null,
    engineer_name: null,
    created_at: '2026-04-15T13:10:00Z',
    updated_at: '2026-04-15T13:45:00Z',
    description:
      'After upgrading Nginx from 1.24 to 1.25, `proxy_pass` directives for the microservices backend are returning 502 Bad Gateway intermittently.',
    analysis: {
      categorie_detectee: 'SERVER_OS',
      decision: 'AUTO_RESOLVE',
      decision_reason: 'High similarity to a known Nginx 1.25 upstream configuration pattern — automated fix applied.',
      score_richesse: 0.78,
      score_similarite: 0.92,
    },
    clarification_session: null,
    engineer_response: null,
    ai_response: {
      content:
        "This matches a known Nginx 1.25 issue. The `proxy_pass` directive now requires explicit trailing slashes in upstream definitions. Update your nginx.conf: change `proxy_pass http://backend` to `proxy_pass http://backend/`, then reload with `nginx -s reload`.",
      created_at: '2026-04-15T13:45:00Z',
    },
    attachments: [],
  },
];

// ── Notifications ─────────────────────────────────────────────────
export const mockDeveloperNotifications = [
  { id: 1, message: 'Votre ticket #103 est en attente de clarification — répondez aux questions du bot', is_read: false, created_at: '2026-04-26T18:20:00Z' },
  { id: 2, message: 'Votre ticket #101 a été assigné à Jean Dupont (ingénieur)', is_read: false, created_at: '2026-04-27T10:16:00Z' },
  { id: 3, message: 'Ticket #105 résolu par Jean Dupont — consultez la solution proposée', is_read: true, created_at: '2026-04-22T16:35:00Z' },
  { id: 4, message: 'Ticket #106 résolu par Jean Dupont — consultez la solution proposée', is_read: true, created_at: '2026-04-19T14:05:00Z' },
  { id: 5, message: "Ticket #108 résolu automatiquement par l'IA", is_read: true, created_at: '2026-04-15T13:46:00Z' },
];
