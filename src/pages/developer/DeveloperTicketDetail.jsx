import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicketDetail } from '../../hooks/developer/useTicketDetail';
import { useAnswerClarification } from '../../hooks/developer/useAnswerClarification';
import { useUploadAttachment } from '../../hooks/developer/useUploadAttachment';
import { useRefillTicket } from '../../hooks/developer/useRefillTicket';
import { useWebSocket } from '../../hooks/useWebSocket';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Calendar, Clock, User, FileText, Bot,
  CheckCircle2, MessageSquare, ChevronDown, ChevronUp,
  Paperclip, Download, Send, HourglassIcon, Sparkles, Loader2,
  RefreshCw, Upload,
} from 'lucide-react';
import clsx from 'clsx';

const CATEGORY_LABELS = {
  NETWORK: 'Réseau', DATABASE: 'Base de données', SERVER_OS: 'Serveur / OS',
  DEPLOYMENT: 'Déploiement', SECURITY: 'Sécurité', API_GATEWAY: 'API Gateway',
  STORAGE: 'Stockage', OTHER: 'Autre',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function getAnalysisScore(analysis, keys) {
  for (const key of keys) {
    const value = analysis?.[key];
    if (value !== undefined && value !== null) return value;
  }
  return 0;
}

function ClarificationMessage({ message }) {
  const sender = message.sender || 'USER';
  const isBot = sender === 'BOT';
  const isEngineer = sender === 'ENGINEER';
  const isRightAligned = !isBot;
  const bubbleClass = isBot
    ? 'bg-surface-muted text-text-secondary'
    : isEngineer
      ? 'bg-blue-500 text-white'
      : 'bg-green-500 text-white';

  return (
    <div className={clsx('flex gap-3 max-w-[85%]', isRightAligned ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
      <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0', isBot ? 'bg-primary-light text-primary' : isEngineer ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}>
        {isBot ? <Bot size={14} /> : <User size={14} />}
      </div>
      <div className={clsx('rounded-card px-4 py-2.5 text-sm', bubbleClass)}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={clsx('text-[10px] mt-1', isBot ? 'text-text-muted' : 'text-white/70')}>
          {formatDate(message.created_at)}
        </p>
      </div>
    </div>
  );
}

function ClarificationTypingIndicator() {
  return (
    <div className="flex gap-3 mr-auto max-w-[85%] animate-fade-in">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-light text-primary">
        <Bot size={14} />
      </div>
      <div className="rounded-card px-4 py-2.5 text-sm bg-surface-muted text-text-secondary flex items-center gap-2">
        <Loader2 size={14} className="animate-spin text-primary" />
        <span>L'IA génère une réponse...</span>
      </div>
    </div>
  );
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'text/plain', 'text/csv', 'application/json'];
const CLARIFICATION_OPEN_STATUSES = ['AWAITING_CLARIFICATION', 'OPEN_CLARIFICATION'];

export default function DeveloperTicketDetail() {
  const { id } = useParams();
  const ticketId = Number(id);
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isAiProcessingReply, setIsAiProcessingReply] = useState(false);

  const { data: ticket, isLoading } = useTicketDetail(id, {
    refetchInterval: isAiProcessingReply ? 2000 : false,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });
  const answerClarification = useAnswerClarification();
  const uploadAttachment = useUploadAttachment();
  const refillTicket = useRefillTicket();

  const [clarificationText, setClarificationText] = useState('');
  const [showActiveClarification, setShowActiveClarification] = useState(true);
  const [showClosedClarification, setShowClosedClarification] = useState(false);
  const [showRefill, setShowRefill] = useState(false);
  const [refillText, setRefillText] = useState('');

  const extractTicketIdFromWsPayload = (payload) => {
    const source = payload?.data ? payload.data : payload;
    const fromFields =
      source?.ticket_id ??
      source?.ticketId ??
      source?.ticket?.id ??
      source?.metadata?.ticket_id ??
      source?.metadata?.ticketId;

    if (fromFields !== undefined && fromFields !== null && !Number.isNaN(Number(fromFields))) {
      return Number(fromFields);
    }

    const text = `${source?.title || ''} ${source?.message || source?.content || source?.text || ''}`;
    const match = text.match(/(?:#|numéro\s*|ticket\s*)(\d+)/i);
    return match?.[1] ? Number(match[1]) : null;
  };

  useWebSocket((payload) => {
    const incomingTicketId = extractTicketIdFromWsPayload(payload);
    if (!incomingTicketId || incomingTicketId !== ticketId) return;

    // Live-refresh the opened ticket detail when AI/engineer clarification notifications arrive.
    queryClient.invalidateQueries({ queryKey: ['developer', 'tickets', ticketId] });
  });

  useEffect(() => {
    if (!isAiProcessingReply || !ticket) return;

    const messages = ticket.clarification_session?.messages || [];
    const lastMessage = messages[messages.length - 1];
    const hasAiReply = lastMessage?.sender === 'BOT';
    const sessionClosed = !CLARIFICATION_OPEN_STATUSES.includes(ticket.status) || ticket.clarification_session?.status === 'CLOSED' || ticket.clarification_session?.summary;

    if (hasAiReply || sessionClosed || ticket.ai_response) {
      setIsAiProcessingReply(false);
    }
  }, [isAiProcessingReply, ticket]);

  // ── Clarification answer ───────────────────────────────────────
  const handleAnswerClarification = async () => {
    if (!clarificationText.trim()) return;
    try {
      await answerClarification.mutateAsync({ ticketId: id, content: clarificationText.trim() });
      setIsAiProcessingReply(true);
      toast.success('Réponse envoyée à l\'IA.');
      setClarificationText('');
    } catch {
      setIsAiProcessingReply(false);
      toast.error('Erreur lors de l\'envoi.');
    }
  };

  // ── File upload ────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Type de fichier non autorisé.');
      e.target.value = '';
      return;
    }
    if ((ticket?.attachments?.length || 0) >= 5) {
      toast.error('Limite de 5 pièces jointes atteinte.');
      e.target.value = '';
      return;
    }
    try {
      await uploadAttachment.mutateAsync({ ticketId: id, file });
      toast.success(`${file.name} ajouté avec succès.`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Erreur lors de l\'upload.');
    }
    e.target.value = '';
  };

  // ── Refill ticket ──────────────────────────────────────────────
  const handleRefill = async () => {
    if (!refillText.trim() || refillText.trim().length < 20) {
      toast.error('La description doit contenir au moins 20 caractères.');
      return;
    }
    try {
      await refillTicket.mutateAsync({ ticketId: id, description: refillText.trim() });
      toast.success('Ticket mis à jour avec succès.');
      setShowRefill(false);
      setRefillText('');
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  // ── Loading / not found ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64 rounded" />
        <div className="skeleton h-40 rounded-card" />
        <div className="skeleton h-60 rounded-card" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-muted">Ticket introuvable.</p>
        <Link to="/developer/tickets" className="text-primary text-sm mt-2 hover:underline">← Retour</Link>
      </div>
    );
  }

  const analysis = ticket.analysis ?? ticket.analysis_data ?? null;
  const aiResponse = ticket.ai_response ?? ticket.ai_analysis_response ?? null;
  const aiResponseContent = aiResponse?.content ?? aiResponse?.response_text ?? aiResponse?.message ?? '';
  const aiResponseCreatedAt = aiResponse?.created_at ?? aiResponse?.createdAt ?? ticket.updated_at;
  const richnessScore = getAnalysisScore(analysis, ['score_richesse', 'richesse_score', 'richness_score', 'richesse']);
  const similarityScore = getAnalysisScore(analysis, ['score_similarite', 'similarite_score', 'similarity_score', 'similarite']);

  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'AUTO_RESOLVED';
  const isAwaiting = CLARIFICATION_OPEN_STATUSES.includes(ticket.status) || ticket.clarification_session?.status === 'OPEN';
  const clarificationMessages = ticket.clarification_session?.messages || [];
  const isClarificationClosed = ticket.clarification_session?.status === 'CLOSED' || Boolean(ticket.clarification_session?.summary);
  const isClarificationOpen = isAwaiting && !isClarificationClosed;
  const hasClarificationContent =
    isClarificationOpen ||
    isClarificationClosed ||
    clarificationMessages.length > 0 ||
    Boolean(ticket.clarification_session?.summary);
  const assignedEngineerName = ticket.engineer_name?.trim();
  const hasEngineerAssignment = Boolean(
    assignedEngineerName ||
      ticket.engineer_id ||
      ticket.status === 'IN_PROGRESS' ||
      CLARIFICATION_OPEN_STATUSES.includes(ticket.status)
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/developer/tickets')}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors animate-fade-in"
      >
        <ArrowLeft size={16} /> Retour aux tickets
      </button>

      {/* ── Ticket Header ──────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-card p-6 shadow-card animate-fade-in">
        <h1 className="text-xl font-bold text-text-primary leading-snug mb-3">{ticket.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-surface-muted text-text-muted">
            #{ticket.id}
          </span>
          <StatusBadge status={ticket.status} />
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-text-secondary">
            {CATEGORY_LABELS[ticket.category] || ticket.category}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted">
          <span className="flex items-center gap-1.5"><Calendar size={13} /> Créé le {formatDate(ticket.created_at)}</span>
          <span className="flex items-center gap-1.5"><Clock size={13} /> Mis à jour {formatDate(ticket.updated_at)}</span>
          {ticket.engineer_name && (
            <span className="flex items-center gap-1.5">
              <User size={13} /> Assigné à <span className="font-medium text-text-secondary ml-1">{ticket.engineer_name}</span>
            </span>
          )}
        </div>

        {hasEngineerAssignment && (
          <div className="mt-4 rounded-card border border-blue-200 bg-blue-50 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm text-blue-900">
              <CheckCircle2 size={15} className="mt-0.5 text-blue-600 flex-shrink-0" />
              <p>
                Ce ticket a été assigné à{' '}
                <span className="font-semibold">{assignedEngineerName || 'un ingénieur'}</span>.
                {ticket.status === 'IN_PROGRESS' ? ' L’ingénieur travaille actuellement sur votre demande.' : ' La prise en charge est en cours.'}
              </p>
            </div>
            {ticket.engineer_response ? (
              <a
                href="#engineer-response"
                className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
              >
                Voir la réponse de l’ingénieur
              </a>
            ) : (
              <span className="text-xs font-medium text-blue-700 self-start sm:self-auto">
                Attente de la réponse de l’ingénieur
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Description ────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-card p-6 shadow-card" style={{ animation: 'slideUp 0.35s ease-out 0.08s both' }}>
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <FileText size={15} className="text-text-muted" /> Description du problème
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{ticket.description}</p>

        {/* Refill toggle */}
        {!isResolved && (
          <div className="mt-4 pt-4 border-t border-divider">
            {showRefill ? (
              <div className="space-y-3">
                <p className="text-xs text-text-muted">Ajoutez du contexte supplémentaire pour aider l'ingénieur.</p>
                <textarea
                  className="w-full bg-input-bg border border-input-border rounded-btn px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] resize-none"
                  rows={4}
                  value={refillText}
                  onChange={(e) => setRefillText(e.target.value)}
                  placeholder="Ajoutez des informations complémentaires..."
                />
                <div className="flex items-center gap-3">
                  <Button onClick={handleRefill} loading={refillTicket.isPending} disabled={refillText.trim().length < 20}>
                    <RefreshCw size={14} /> Mettre à jour
                  </Button>
                  <Button variant="secondary" onClick={() => { setShowRefill(false); setRefillText(''); }}>Annuler</Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowRefill(true)}
                className="text-xs text-primary hover:underline font-medium flex items-center gap-1.5"
              >
                <RefreshCw size={12} /> Ajouter plus de contexte
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── AI Analysis ────────────────────────────────────────────── */}
      {analysis && (
        <div className="bg-white border border-border rounded-card p-6 shadow-card" style={{ animation: 'slideUp 0.35s ease-out 0.16s both' }}>
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bot size={15} className="text-primary" /> Analyse IA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1">Catégorie détectée</p>
                <p className="text-sm text-text-secondary">{CATEGORY_LABELS[analysis.categorie_detectee] || analysis.categorie_detectee}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1">Décision</p>
                <StatusBadge status={analysis.decision} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1">Raison</p>
                <p className="text-sm text-text-secondary leading-relaxed">{analysis.decision_reason}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">Score de richesse</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${richnessScore * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-text-secondary w-10 text-right">
                    {Math.round(richnessScore * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">Score de similarité</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${similarityScore * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-text-secondary w-10 text-right">
                    {Math.round(similarityScore * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Awaiting clarification banner + chat ───────────────────── */}
      {isClarificationOpen && (
        <div className="bg-white border border-amber-200 rounded-card shadow-card overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out 0.22s both' }}>
          <div className="border-l-4 border-l-amber-400 p-6 flex flex-col gap-4">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <HourglassIcon size={15} className="text-amber-600" />
                  Clarification requise
                </h2>
                <button
                  type="button"
                  onClick={() => setShowActiveClarification((value) => !value)}
                  className="text-xs font-medium text-primary hover:underline shrink-0"
                >
                  {showActiveClarification ? 'Masquer la conversation' : 'Afficher la conversation'}
                </button>
              </div>
              <p className="text-sm text-text-secondary">
                L'IA a besoin de plus d'informations pour analyser votre ticket. Répondez directement dans le fil ci-dessous.
              </p>
            </div>

            {showActiveClarification && (
              <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3">
                {clarificationMessages.length > 0 ? (
                  clarificationMessages.map((msg) => <ClarificationMessage key={msg.id} message={msg} />)
                ) : (
                  <p className="text-sm text-text-muted">Aucun message pour le moment.</p>
                )}

                {isAiProcessingReply && <ClarificationTypingIndicator />}
              </div>
            )}

            <div className="border-t border-divider pt-4 mt-auto space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-text-muted">
                  {isAiProcessingReply
                    ? 'L\'IA rédige sa réponse, veuillez patienter.'
                    : 'Le message reste visible pendant toute la session.'}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50"
                  disabled={isAiProcessingReply}
                >
                  <Upload size={13} /> Joindre un fichier
                </button>
              </div>
              <textarea
                className="w-full bg-input-bg border border-input-border rounded-btn px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] resize-none"
                rows={3}
                value={clarificationText}
                onChange={(e) => setClarificationText(e.target.value)}
                placeholder="Votre réponse..."
                disabled={isAiProcessingReply}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.gif,.pdf,.txt,.csv,.json"
                onChange={handleFileChange}
              />
              <div className="flex items-center justify-between gap-3">
                <Button
                  onClick={handleAnswerClarification}
                  loading={answerClarification.isPending || isAiProcessingReply}
                  disabled={!clarificationText.trim() || isAiProcessingReply}
                >
                  <Send size={14} /> {isAiProcessingReply ? 'Traitement en cours...' : 'Envoyer la réponse'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Clarification ended ───────────────────────────────────── */}
      {isClarificationClosed && (
        <div className="bg-white border border-slate-200 rounded-card shadow-card overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out 0.22s both' }}>
          <div className="border-l-4 border-l-slate-400 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-slate-600" />
                  Session terminée
                </h2>
                <p className="text-sm text-text-secondary">
                  La clarification avec l'IA est terminée. Aucun nouveau message ne peut être envoyé.
                </p>
              </div>
              {clarificationMessages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowClosedClarification((value) => !value)}
                  className="text-xs font-medium text-primary hover:underline shrink-0"
                >
                  {showClosedClarification ? 'Masquer la conversation' : 'Afficher la conversation'}
                </button>
              )}
            </div>

            {clarificationMessages.length > 0 && showClosedClarification && (
              <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3">
                {clarificationMessages.map((msg) => <ClarificationMessage key={msg.id} message={msg} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Clarification not opened ─────────────────────────────── */}
      {!hasClarificationContent && (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out 0.22s both' }}>
          <div className="border-l-4 border-l-primary p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <MessageSquare size={15} className="text-primary" />
                  Clarification IA
                </h2>
                <p className="text-sm text-text-secondary">
                  Ce ticket a ete escalade directement a un ingenieur, sans ouverture de session de clarification.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                <CheckCircle2 size={11} /> Non ouverte
              </span>
            </div>

            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3 bg-surface-muted/60 border border-divider rounded-btn p-4">
              <p className="text-sm text-text-muted">Aucun message de clarification pour ce ticket.</p>
            </div>

            <div className="border-t border-divider pt-4 mt-auto space-y-3">
              <p className="text-xs text-text-muted">
                Aucun envoi de message n'est disponible tant que la session de clarification n'est pas ouverte.
              </p>
              <textarea
                className="w-full bg-input-bg border border-input-border rounded-btn px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none resize-none"
                rows={3}
                value=""
                placeholder="La clarification n'est pas disponible pour ce ticket."
                disabled
                readOnly
              />
              <div className="flex items-center justify-between gap-3">
                <Button disabled>
                  <Send size={14} /> Envoyer la reponse
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Auto-response ────────────────────────────────────────── */}
      {aiResponse && (
        <div className="bg-white border border-green-200 rounded-card shadow-card overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out 0.28s both' }}>
          <div className="border-l-4 border-l-green-500 p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Sparkles size={15} className="text-green-600" />
              Résolution automatique IA
              <span className="text-[10px] text-text-muted font-normal ml-auto">{formatDate(aiResponseCreatedAt)}</span>
            </h2>
            <div className="bg-green-50/60 border border-green-100 rounded-btn p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {aiResponseContent}
            </div>
          </div>
        </div>
      )}

      {/* ── Engineer Response ───────────────────────────────────────── */}
      {ticket.engineer_response && (
        <div id="engineer-response" className="bg-white border border-green-200 rounded-card shadow-card overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out 0.32s both' }}>
          <div className="border-l-4 border-l-green-500 p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-green-600" />
              Solution de l'ingénieur
              {ticket.engineer_name && (
                <span className="text-[11px] font-normal text-text-muted ml-1">par {ticket.engineer_name}</span>
              )}
              <span className="text-[10px] text-text-muted font-normal ml-auto">
                {formatDate(ticket.engineer_response.created_at)}
              </span>
            </h2>
            <div className="bg-green-50/60 border border-green-100 rounded-btn p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {ticket.engineer_response.response_text}
            </div>
          </div>
        </div>
      )}

      {/* ── Attachments ────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-card p-6 shadow-card" style={{ animation: 'slideUp 0.35s ease-out 0.36s both' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Paperclip size={15} className="text-text-muted" />
            Pièces jointes ({ticket.attachments?.length || 0} / 5)
          </h2>
        </div>

        {!ticket.attachments?.length ? (
          <div className="text-center py-6 text-text-muted">
            <Paperclip size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune pièce jointe</p>
            {!isResolved && (
              <p className="text-xs mt-1">Ajoutez des logs, captures d'écran ou fichiers de configuration.</p>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {ticket.attachments.map((att) => (
              <li key={att.id} className="flex items-center gap-3 bg-surface-muted rounded-btn px-4 py-2.5">
                <FileText size={14} className="text-text-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{att.file_name}</p>
                  <p className="text-[10px] text-text-muted">{att.file_type}</p>
                </div>
                <a
                  href={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '')}${att.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  <Download size={13} /> Télécharger
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Status info for resolved tickets ───────────────────────── */}
      {isResolved && !ticket.engineer_response && !aiResponse && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-card px-5 py-3 animate-fade-in">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800 font-medium">Ce ticket a été résolu.</p>
        </div>
      )}

      {/* ── Pending message ────────────────────────────────────────── */}
      {!isResolved && !isAwaiting && !ticket.engineer_response && !aiResponse && (
        <div className="flex items-center gap-3 bg-surface-muted border border-border rounded-card px-5 py-3 animate-fade-in">
          <MessageSquare size={16} className="text-text-muted flex-shrink-0" />
          <p className="text-sm text-text-secondary">
            {ticket.engineer_name
              ? `L'ingénieur ${ticket.engineer_name} travaille sur ce ticket.`
              : "Votre ticket est en cours d'assignation — un ingénieur sera désigné prochainement."}
          </p>
        </div>
      )}
    </div>
  );
}
