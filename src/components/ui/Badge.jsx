import clsx from 'clsx';

const STATUS_MAP = {
  OPEN: { label: 'Ouvert', bg: '#EEF4FF', color: '#0056B3' },
  IN_PROGRESS: { label: 'En cours', bg: '#EEF4FF', color: '#2B6CB0' },
  AWAITING_CLARIFICATION: { label: 'En attente', bg: '#FFFBEE', color: '#6B4800' },
  AUTO_RESOLVED: { label: 'Résolu (IA)', bg: '#F0FFF8', color: '#276749' },
  RESOLVED: { label: 'Résolu', bg: '#F0FFF8', color: '#2F855A' },
  PENDING: { label: 'En attente', bg: '#FFFBEE', color: '#6B4800' },
  REVIEWED: { label: 'Examiné', bg: '#EEF4FF', color: '#2B6CB0' },
  REASSIGNED: { label: 'Réassigné', bg: '#F0FFF8', color: '#2F855A' },
};

const ROLE_MAP = {
  ADMIN: { label: 'Admin', bg: '#EEF4FF', color: '#0056B3' },
  ENGINEER: { label: 'Ingénieur', bg: '#F0FFF8', color: '#2F855A' },
  DEVELOPER: { label: 'Développeur', bg: '#FFFBEE', color: '#6B4800' },
};

const DECISION_MAP = {
  AUTO_RESOLVE: { label: 'AUTO_RESOLVE', bg: '#F0FFF8', color: '#276749' },
  OPEN_CLARIFICATION: { label: 'CLARIFICATION', bg: '#FFFBEE', color: '#6B4800' },
  ESCALATE_DIRECTLY: { label: 'ESCALADE', bg: '#FFF5F5', color: '#C53030' },
};

export function StatusBadge({ status, className }) {
  const cfg = STATUS_MAP[status] || { label: status, bg: '#F5F5F5', color: '#555555' };
  return (
    <span
      className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide', className)}
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export function RoleBadge({ role, className }) {
  const cfg = ROLE_MAP[role] || { label: role, bg: '#F5F5F5', color: '#555555' };
  return (
    <span
      className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide', className)}
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export function DecisionBadge({ decision, className }) {
  const cfg = DECISION_MAP[decision] || { label: decision, bg: '#F5F5F5', color: '#555555' };
  return (
    <span
      className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide', className)}
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}
