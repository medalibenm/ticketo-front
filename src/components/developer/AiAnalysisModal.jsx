import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicketDetail } from '../../hooks/developer/useTicketDetail';
import {
  Bot, CheckCircle2, Clock, Sparkles, Loader2,
  MessageSquare, UserCheck, Zap, ArrowRight,
} from 'lucide-react';

// ── AI processing steps (visual timeline) ────────────────────────────────────
const STEPS = [
  {
    id: 'coherence',
    label: 'Vérification de la cohérence',
    sublabel: 'Analyse du titre et de la description',
  },
  {
    id: 'knowledge',
    label: 'Recherche base de connaissances',
    sublabel: 'Correspondance avec les cas similaires',
  },
  {
    id: 'decision',
    label: 'Décision finale',
    sublabel: 'Détermination du traitement optimal',
  },
];

// Cumulative delay (ms) before each step becomes "active"
const STEP_TIMINGS = [1000, 2600, 4400];

// Backend poll interval
const POLL_MS = 2000;

// Statuses that mean the AI pipeline has finished
const TERMINAL = ['IN_PROGRESS', 'AWAITING_CLARIFICATION', 'RESOLVED', 'AUTO_RESOLVED'];

// ── Per-outcome config ────────────────────────────────────────────────────────
const OUTCOME = {
  AWAITING_CLARIFICATION: {
    icon: MessageSquare,
    color: '#D97706',        // amber
    bg: '#FFFBEB',
    ring: '#FEF3C7',
    barColor: 'from-amber-400 to-yellow-300',
    badge: 'Clarification requise',
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    title: 'Informations supplémentaires requises',
    body: "L'IA a besoin de plus de détails pour traiter votre ticket. Vous allez être redirigé vers la session de clarification.",
    delay: 2800,
  },
  IN_PROGRESS: {
    icon: UserCheck,
    color: '#0056B3',        // primary blue
    bg: '#EEF4FF',
    ring: '#DBEAFE',
    barColor: 'from-primary to-blue-400',
    badge: 'Assigné à un ingénieur',
    badgeBg: '#EEF4FF',
    badgeColor: '#1D4ED8',
    title: 'Ticket escaladé avec succès',
    body: "Votre ticket a été analysé et assigné à l'ingénieur le plus qualifié. Vous serez notifié dès qu'une réponse sera disponible.",
    delay: 2400,
  },
  AUTO_RESOLVED: {
    icon: Zap,
    color: '#059669',        // green
    bg: '#F0FDF4',
    ring: '#D1FAE5',
    barColor: 'from-green-500 to-emerald-400',
    badge: 'Résolu par l\'IA',
    badgeBg: '#D1FAE5',
    badgeColor: '#065F46',
    title: 'Résolu automatiquement par l\'IA',
    body: "L'IA a trouvé une solution dans la base de connaissances et a résolu votre ticket automatiquement. Consultez la réponse ci-dessous.",
    delay: 2200,
  },
  RESOLVED: {
    icon: CheckCircle2,
    color: '#059669',
    bg: '#F0FDF4',
    ring: '#D1FAE5',
    barColor: 'from-green-500 to-emerald-400',
    badge: 'Résolu',
    badgeBg: '#D1FAE5',
    badgeColor: '#065F46',
    title: 'Ticket résolu',
    body: 'Votre ticket a été résolu.',
    delay: 1800,
  },
};

const DEFAULT_OUTCOME = OUTCOME.IN_PROGRESS;

const hasAnalysisResult = (ticket) =>
  !!(ticket?.analysis || ticket?.analysis_data || ticket?.ai_response);

const getCompletionStatus = (ticket) => {
  if (!ticket) return null;
  if (ticket.status === 'OPEN_CLARIFICATION') return 'AWAITING_CLARIFICATION';
  if (ticket.status && OUTCOME[ticket.status]) return ticket.status;
  if (ticket.status === 'AWAITING_CLARIFICATION') return ticket.status;
  if (ticket.clarification_session?.status === 'OPEN' || (ticket.clarification_session?.messages || []).length > 0) {
    return 'AWAITING_CLARIFICATION';
  }
  if (hasAnalysisResult(ticket)) return 'IN_PROGRESS';
  return null;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AiAnalysisModal({ open, ticketId, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [finalStatus, setFinalStatus] = useState(null); // set when AI finishes
  const animFrameRef = useRef(null);
  const timerRefs = useRef([]);

  const isDone = !!finalStatus;
  const outcome = finalStatus ? (OUTCOME[finalStatus] || DEFAULT_OUTCOME) : null;

  const handleGoToTicketDetail = () => {
    if (!ticketId) return;
    navigate(`/developer/tickets/${ticketId}`);
    onClose();
  };

  // ── Poll the ticket ─────────────────────────────────────────────────────────
  const { data: ticket } = useTicketDetail(ticketId, {
    enabled: !!ticketId && open,
    refetchInterval: open && !isDone ? POLL_MS : false,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  // ── Reset on open ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && ticketId) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setProgress(0);
      setFinalStatus(null);
      timerRefs.current.forEach(clearTimeout);
      cancelAnimationFrame(animFrameRef.current);
    }
  }, [open, ticketId]);

  // ── Animate steps ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || isDone) return;

    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    STEP_TIMINGS.forEach((delay, idx) => {
      const t = setTimeout(() => {
        if (idx > 0) setCompletedSteps((prev) => [...prev, STEPS[idx - 1].id]);
        setCurrentStep(idx);
      }, delay);
      timerRefs.current.push(t);
    });

    return () => timerRefs.current.forEach(clearTimeout);
  }, [open, ticketId, isDone]);

  // ── Animate progress bar ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    let start = null;
    const DURATION = 6500;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const cap = isDone ? 100 : 88;
      const next = Math.min((elapsed / DURATION) * 100, cap);
      setProgress(next);
      if (next < cap) animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [open, ticketId, isDone]);

  // ── Detect AI completion ────────────────────────────────────────────────────
  useEffect(() => {
    if (!ticket || isDone) return;

    const completionStatus = getCompletionStatus(ticket);
    if (!completionStatus) return;

    // Mark all steps done and reveal the outcome card
    setCompletedSteps(STEPS.map((s) => s.id));
    setCurrentStep(STEPS.length);
    setProgress(100);
    setFinalStatus(completionStatus);

  }, [ticket, isDone, ticketId, navigate, onClose]);

  if (!open) return null;

  const OutcomeIcon = outcome?.icon || CheckCircle2;
  const barClass = isDone
    ? `bg-gradient-to-r ${outcome?.barColor || 'from-primary to-blue-400'}`
    : 'bg-gradient-to-r from-primary to-blue-400';

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[460px] overflow-hidden"
          style={{ animation: 'modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          {/* Progress bar */}
          <div className="h-1 bg-surface-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barClass}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-8">
            {/* Header icon area */}
            <div className="flex flex-col items-center mb-7">
              <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500"
                style={{
                  background: isDone
                    ? `linear-gradient(135deg, ${outcome.ring} 0%, ${outcome.bg} 100%)`
                    : 'linear-gradient(135deg, #EEF4FF 0%, #dbeafe 100%)',
                }}
              >
                {isDone ? (
                  <OutcomeIcon
                    size={34}
                    style={{ color: outcome.color, animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
                  />
                ) : (
                  <>
                    <Bot size={34} className="text-primary" style={{ animation: 'botPulse 2s ease-in-out infinite' }} />
                    <span
                      className="absolute inset-0 rounded-full border-2 border-primary/25"
                      style={{ animation: 'pingRing 1.8s ease-out infinite' }}
                    />
                  </>
                )}
              </div>

              {isDone ? (
                <>
                  {/* Outcome badge */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-2"
                    style={{
                      backgroundColor: outcome.badgeBg,
                      color: outcome.badgeColor,
                      animation: 'fadeIn 0.3s ease-out both',
                    }}
                  >
                    <OutcomeIcon size={11} />
                    {outcome.badge}
                  </span>
                  <h2 className="text-[17px] font-bold text-text-primary text-center leading-snug">
                    {outcome.title}
                  </h2>
                  <p className="text-sm text-text-muted text-center mt-1.5 leading-relaxed px-2">
                    {outcome.body}
                  </p>
                  <button
                    type="button"
                    onClick={handleGoToTicketDetail}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-btn text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Voir le detail du ticket
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-text-primary text-center">
                    Analyse IA en cours…
                  </h2>
                  <p className="text-sm text-text-muted text-center mt-1">
                    Votre ticket est en cours de traitement par notre système IA.
                  </p>
                </>
              )}
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {STEPS.map((step, idx) => {
                const done = completedSteps.includes(step.id);
                const active = currentStep === idx && !isDone;

                return (
                  <div
                    key={step.id}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: done
                        ? (isDone ? (outcome?.bg || '#f0fdf4') : '#f0fdf4')
                        : active ? '#EEF4FF' : 'transparent',
                    }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                      {done ? (
                        <CheckCircle2
                          size={18}
                          style={{
                            color: isDone ? (outcome?.color || '#059669') : '#059669',
                            animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                          }}
                        />
                      ) : active ? (
                        <Loader2 size={16} className="text-primary animate-spin" />
                      ) : (
                        <Clock size={16} className="text-text-muted opacity-30" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: done
                            ? (isDone ? outcome?.color || '#166534' : '#166534')
                            : active ? '#002D72' : '#CBD5E1',
                        }}
                      >
                        {step.label}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{
                          color: done
                            ? (isDone ? outcome?.color + '99' : '#4ADE80') // slightly transparent
                            : active ? '#0056B3' : '#E2E8F0',
                        }}
                      >
                        {step.sublabel}
                      </p>
                    </div>

                    {done && (
                      <span
                        className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isDone ? outcome?.ring || '#D1FAE5' : '#D1FAE5',
                          color: isDone ? outcome?.color || '#059669' : '#059669',
                          animation: 'fadeIn 0.2s ease-out both',
                        }}
                      >
                        ✓
                      </span>
                    )}
                    {active && !done && (
                      <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary animate-pulse">
                        En cours
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-divider flex items-center justify-center gap-2 text-xs text-text-muted">
              <Sparkles size={12} className="text-primary" />
              <span>Powered by AT Intelligence IA — Analyse automatique</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes botPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.1); }
        }
        @keyframes pingRing {
          0%   { transform: scale(1);    opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes popIn {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
