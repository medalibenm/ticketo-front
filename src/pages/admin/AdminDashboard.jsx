import { useStats } from '../../hooks/admin/useStats';
import { SkeletonCard } from '../../components/ui/Skeleton';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Ticket, CheckCircle, Bot, UserCheck, AlertTriangle, Flag,
} from 'lucide-react';

function KpiCard({ label, value, sub, icon: Icon, iconBg = '#EEF2FF', iconColor = '#4F46E5' }) {
  return (
    <div className="bg-white border border-border rounded-card p-6 shadow-card flex items-start justify-between">
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider font-medium">{label}</p>
        <p className="text-[28px] font-semibold text-text-primary mt-1 leading-none">{value}</p>
        {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
        <Icon size={18} style={{ color: iconColor }} />
      </div>
    </div>
  );
}

function StatBar({ value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

const COLORS = ['#10B981', '#4F46E5', '#F59E0B'];
const PIE_GRADIENTS = [
  { id: 'grad-green', start: '#34D399', end: '#059669' },
  { id: 'grad-indigo', start: '#818CF8', end: '#4338CA' },
  { id: 'grad-amber', start: '#FBBF24', end: '#D97706' },
];

export default function AdminDashboard() {
  const { data: stats, isLoading: loading } = useStats();

  if (loading || !stats) {
    return (
      <div className="space-y-7">
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const aiConfidencePercent = stats.avg_ai_confidence_score <= 1
    ? stats.avg_ai_confidence_score * 100
    : stats.avg_ai_confidence_score;

  const kpis = [
    { label: 'Total Tickets', value: stats.total_tickets, icon: Ticket, sub: 'Tous statuts confondus' },
    { label: 'Tickets Ouverts', value: stats.open_tickets, icon: AlertTriangle, iconBg: '#FEF2F2', iconColor: '#EF4444', sub: 'Nécessitent attention' },
    { label: 'Résolus par l\'IA', value: stats.auto_resolved_tickets, icon: Bot, iconBg: '#D1FAE5', iconColor: '#059669', sub: `${stats.ai_resolved_percentage}% du total` },
    { label: 'Résolus par ingénieur', value: stats.resolved_by_engineer_tickets, icon: UserCheck, iconBg: '#E0E7FF', iconColor: '#4338CA', sub: `${stats.engineer_resolved_percentage}% du total` },
    { label: 'Total Escalades', value: stats.total_escalations, icon: CheckCircle, iconBg: '#FEF3C7', iconColor: '#D97706', sub: 'Tickets escaladés' },
    { label: 'Signalements', value: stats.total_misassignments, icon: Flag, iconBg: '#FEF2F2', iconColor: '#EF4444', sub: 'Mauvaises assignations' },
  ];

  const donutData = [
    { name: 'IA', value: stats.auto_resolved_tickets },
    { name: 'Ingénieur', value: stats.resolved_by_engineer_tickets },
    { name: 'Ouvert', value: stats.open_tickets },
  ];

  const barData = [
    { name: 'Ouverts', value: stats.open_tickets, gradStart: '#818CF8', gradEnd: '#4338CA' },
    { name: 'Résolus', value: stats.resolved_by_engineer_tickets, gradStart: '#34D399', gradEnd: '#059669' },
    { name: 'Auto-résolus', value: stats.auto_resolved_tickets, gradStart: '#6EE7B7', gradEnd: '#047857' },
    { name: 'Escalades', value: stats.total_escalations, gradStart: '#FBBF24', gradEnd: '#D97706' },
    { name: 'Signalements', value: stats.total_misassignments, gradStart: '#F87171', gradEnd: '#DC2626' },
  ];

  return (
    <div className="space-y-7">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-card p-6 shadow-card">
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">Temps moyen de résolution</p>
          <p className="text-[28px] font-semibold text-text-primary">{stats.avg_resolution_time} min</p>
          <p className="text-xs text-text-muted mb-4">Toutes catégories confondues</p>
          <StatBar value={stats.avg_resolution_time} max={180} color="#4F46E5" />
        </div>

        <div className="bg-white border border-border rounded-card p-6 shadow-card">
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">Score de confiance IA moyen</p>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="conf-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.91" fill="none"
                  stroke="url(#conf-grad)" strokeWidth="3"
                  strokeDasharray={`${aiConfidencePercent}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">
                {Math.round(aiConfidencePercent)}%
              </span>
            </div>
            <div>
              <p className="text-[28px] font-semibold text-text-primary leading-none">{aiConfidencePercent.toFixed(1)}%</p>
              <p className="text-xs text-text-muted mt-1">Précision des décisions IA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Donut */}
        <div className="bg-white border border-border rounded-card p-6 shadow-card">
          <p className="text-sm font-semibold text-text-primary mb-5">Répartition des résolutions</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <defs>
                  {PIE_GRADIENTS.map((g) => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.start} />
                      <stop offset="95%" stopColor={g.end} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} cornerRadius={6} dataKey="value" stroke="none">
                  {donutData.map((_, i) => <Cell key={i} fill={`url(#${PIE_GRADIENTS[i].id})`} />)}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [v, n]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2.5">
              {donutData.map((entry, i) => (
                <li key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-text-secondary">{entry.name}</span>
                  <span className="text-xs font-semibold text-text-primary ml-auto">{entry.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bar */}
        <div className="bg-white border border-border rounded-card p-6 shadow-card">
          <p className="text-sm font-semibold text-text-primary mb-5">Tickets par statut</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={32} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {barData.map((entry, i) => (
                  <linearGradient key={`bar-${i}`} id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.gradStart} />
                    <stop offset="100%" stopColor={entry.gradEnd} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: 'none', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 500 }}
                cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 6 }}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                {barData.map((entry, i) => <Cell key={i} fill={`url(#bar-${i})`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
