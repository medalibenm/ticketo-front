import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEngineerTicketDetail } from '../../hooks/engineer/useEngineerTicketDetail';
import { useEngineerSubmitResponse } from '../../hooks/engineer/useEngineerSubmitResponse';
import { useEngineerEditResponse } from '../../hooks/engineer/useEngineerEditResponse';
import { useEngineerResolveTicket } from '../../hooks/engineer/useEngineerResolveTicket';
import { useEngineerRequestContext } from '../../hooks/engineer/useEngineerRequestContext';
import { useEngineerReportMisassignment } from '../../hooks/engineer/useEngineerReportMisassignment';
import { useEngineerTickets } from '../../hooks/engineer/useEngineerTickets';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import MisassignmentModal from '../../components/engineer/MisassignmentModal';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft, Clock, Calendar,
  FileText, CheckCircle2, MessageSquare, AlertTriangle,
  Bot, User, PanelRightOpen, PanelRightClose,
  Paperclip, Download, HourglassIcon, Sparkles, UserCheck,
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
function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function ClarificationMessage({ message }) {
  const sender = message.sender || 'USER';
  const isBot = sender === 'BOT';
  const isEngineer = sender === 'ENGINEER';
  const isRightAligned = sender === 'USER' || sender === 'ENGINEER';
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

export default function EngineerTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: ticket, isLoading } = useEngineerTicketDetail(id);
  const { data: allTicketsData } = useEngineerTickets({ skip: 0, limit: 50 });
  const submitResponse = useEngineerSubmitResponse();
  const editResponse = useEngineerEditResponse();
  const resolveTicket = useEngineerResolveTicket();
  const requestContext = useEngineerRequestContext();
  const reportMisassignment = useEngineerReportMisassignment();

  const [responseText, setResponseText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [showMisassignmentModal, setShowMisassignmentModal] = useState(false);
  const [showRequestContextModal, setShowRequestContextModal] = useState(false);
  const [contextMessage, setContextMessage] = useState('');
  const [showClarificationConversation, setShowClarificationConversation] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Other assigned tickets for the sidebar
  const otherTickets = (allTicketsData?.items || []).filter(
    (t) => t.id !== Number(id) && t.status !== 'RESOLVED' && t.status !== 'AUTO_RESOLVED'
  );

  // ── Handlers ──────────────────────────────────────────────────
  const handleResolve = async () => {
    try {
      if (responseText.trim()) {
        if (isEditing) {
          await editResponse.mutateAsync({ ticketId: id, response_text: responseText.trim() });
        } else if (!ticket?.engineer_response) {
          await submitResponse.mutateAsync({ ticketId: id, response_text: responseText.trim() });
        }
      }
      await resolveTicket.mutateAsync(id);
      toast.success('Ticket résolu — base de connaissances mise à jour ✓');
      navigate('/engineer/tickets');
    } catch {
      toast.error('Erreur lors de la résolution.');
    }
    setShowResolveConfirm(false);
  };

  const handleRequestContext = async () => {
    if (!contextMessage.trim()) return;
    try {
      await requestContext.mutateAsync({ ticketId: id, message: contextMessage.trim() });
      toast.success('Demande envoyée au développeur par email et notification ✓');
      setShowRequestContextModal(false);
      setContextMessage('');
    } catch {
      toast.error('Erreur lors de l\'envoi.');
    }
  };

  const handleMisassignment = async (reason) => {
    try {
      await reportMisassignment.mutateAsync({ ticketId: id, reason });
      toast.success('Signalement envoyé — l\'administrateur a été notifié.');
      setShowMisassignmentModal(false);
      navigate('/engineer/tickets');
    } catch {
      toast.error('Erreur lors du signalement.');
    }
  };

  // ── Loading state ─────────────────────────────────────────────
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
        <Link to="/engineer/tickets" className="text-primary text-sm mt-2 hover:underline">← Retour</Link>
      </div>
    );
  }

  const hasResponse = ticket.engineer_response !== null;
  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'AUTO_RESOLVED';
  const clarificationMessages = ticket.clarification_session?.messages || [];
  const clarificationSummary = ticket.clarification_session?.summary || null;
  const hasClarification = clarificationMessages.length > 0 || !!clarificationSummary;
  // Normalise analysis — backend may use either field name
  const analysis = ticket.analysis ?? ticket.analysis_data ?? null;

  // Detect if developer has sent the latest reply that the engineer hasn't actioned yet
  const isSessionOpen = ticket.status === 'OPEN_CLARIFICATION' || ticket.status === 'AWAITING_CLARIFICATION';
  const lastClarificationMessage = clarificationMessages[clarificationMessages.length - 1] ?? null;
  const developerReplied =
    isSessionOpen &&
    lastClarificationMessage &&
    (lastClarificationMessage.sender || '').toUpperCase() === 'USER';

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className={clsx('flex-1 min-w-0 space-y-6 transition-all duration-300', sidebarOpen && 'lg:mr-0')}>
        {/* Back + Sidebar toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/engineer/tickets')}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Retour aux tickets
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors lg:flex hidden"
            title={sidebarOpen ? 'Fermer la liste' : 'Voir les tickets assignés'}
          >
            {sidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            <span className="text-xs">{sidebarOpen ? 'Fermer' : 'Tickets assignés'}</span>
          </button>
        </div>

        {/* ── Ticket Header Card ─────────────────────────────────── */}
        <div className="bg-white border border-border rounded-card p-6 shadow-card animate-fade-in">
          <h1 className="text-xl font-bold text-text-primary leading-snug mb-3">
            {ticket.title}
          </h1>
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
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> Créé le {formatDate(ticket.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> Mis à jour {formatDate(ticket.updated_at)}
            </span>
            {ticket.developer_name && (
              <span className="flex items-center gap-1.5">
                <User size={13} /> Développeur : {ticket.developer_name}
              </span>
            )}
          </div>
        </div>

        {/* ── Description Card ───────────────────────────────────── */}
        <div className="bg-white border border-border rounded-card p-6 shadow-card" style={{ animation: 'slideUp 0.35s ease-out 0.08s both' }}>
          <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <FileText size={15} className="text-text-muted" />
            Description du problème
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* ── AI Analysis Card ───────────────────────────────────── */}
        {analysis && (
          <div className="bg-white border border-border rounded-card p-6 shadow-card" style={{ animation: 'slideUp 0.35s ease-out 0.16s both' }}>
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Bot size={15} className="text-primary" />
              Analyse IA
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
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(analysis.score_richesse ?? analysis.richesse_score ?? analysis.richness_score ?? analysis.richesse ?? 0) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-text-secondary w-10 text-right">{Math.round((analysis.score_richesse ?? analysis.richesse_score ?? analysis.richness_score ?? analysis.richesse ?? 0) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">Score de similarité</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(analysis.score_similarite ?? analysis.similarite_score ?? analysis.similarity_score ?? analysis.similarite ?? 0) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-text-secondary w-10 text-right">{Math.round((analysis.score_similarite ?? analysis.similarite_score ?? analysis.similarity_score ?? analysis.similarite ?? 0) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AI Clarification Summary ───────────────────────────── */}
        {clarificationSummary && (
          <div className="bg-white border border-violet-200 rounded-card shadow-card overflow-hidden animate-fade-in">
            <div className="border-l-4 border-l-violet-500 p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Sparkles size={15} className="text-violet-600" />
                Résumé IA de la clarification
                <span className="ml-auto text-[10px] font-normal text-text-muted">Généré automatiquement</span>
              </h2>
              <div className="bg-violet-50/60 border border-violet-100 rounded-btn p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {clarificationSummary}
              </div>
            </div>
          </div>
        )}

        {/* ── Clarification thread ─────────────────────────────── */}
        {hasClarification && (
          <div className="bg-white border border-border rounded-card shadow-card overflow-hidden animate-fade-in">
            <div className="border-l-4 border-l-primary p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <MessageSquare size={15} className="text-primary" />
                  Échange de clarification
                </h2>
                <div className="flex items-center gap-3">
                  {ticket.status === 'AWAITING_CLARIFICATION' || ticket.status === 'OPEN_CLARIFICATION' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      <HourglassIcon size={11} /> En attente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
                      <CheckCircle2 size={11} /> Session terminée
                    </span>
                  )}
                  {clarificationMessages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowClarificationConversation((value) => !value)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {showClarificationConversation ? 'Masquer la conversation' : 'Afficher la conversation'}
                    </button>
                  )}
                </div>
              </div>

              {showClarificationConversation && clarificationMessages.length > 0 && (
                <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3">
                  {clarificationMessages.map((msg) => <ClarificationMessage key={msg.id} message={msg} />)}
                </div>
              )}
              {clarificationMessages.length === 0 && (
                <p className="text-sm text-text-muted">Aucun message de clarification pour le moment.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Developer reply notification ───────────────────────── */}
        {developerReplied && (
          <div className="bg-white border border-green-200 rounded-card shadow-card overflow-hidden animate-fade-in">
            <div className="border-l-4 border-l-green-500 p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <UserCheck size={15} className="text-green-600" />
                Réponse du développeur
                <span className="ml-auto text-[10px] font-normal text-text-muted">
                  {lastClarificationMessage?.created_at ? formatDate(lastClarificationMessage.created_at) : ''}
                </span>
              </h2>
              <div className="bg-green-50/70 border border-green-100 rounded-btn p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {lastClarificationMessage?.content}
              </div>
              <p className="text-xs text-text-muted mt-3">
                Le développeur a répondu à votre demande de clarification. Vous pouvez maintenant continuer le traitement du ticket.
              </p>
            </div>
          </div>
        )}

        {/* ── Attachments ────────────────────────────────────────── */}
        {ticket.attachments?.length > 0 && (
          <div className="bg-white border border-border rounded-card p-6 shadow-card animate-fade-in">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Paperclip size={15} className="text-text-muted" />
              Pièces jointes ({ticket.attachments.length})
            </h2>
            <ul className="space-y-2">
              {ticket.attachments.map(att => (
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
                    <Download size={13} />
                    Télécharger
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Engineering Solution Card ──────────────────────────── */}
        <div className="bg-white border border-border rounded-card p-6 shadow-card" style={{ animation: 'slideUp 0.35s ease-out 0.24s both' }}>
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <MessageSquare size={15} className="text-text-muted" />
            Solution de l'ingénieur
          </h2>

          {isResolved && hasResponse ? (
            /* Submitted & resolved — read-only green card */
            <div className="border-l-4 border-l-green-500 bg-green-50/50 rounded-btn p-4">
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {ticket.engineer_response.response_text}
              </p>
              <p className="text-xs text-text-muted mt-3">
                Résolu le {formatDate(ticket.engineer_response.created_at)}
              </p>
            </div>
          ) : hasResponse && !isEditing ? (
            /* Submitted but not resolved — show with edit */
            <div>
              <div className="border-l-4 border-l-green-500 bg-green-50/50 rounded-btn p-4 mb-3">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {ticket.engineer_response.response_text}
                </p>
                <p className="text-xs text-text-muted mt-3">
                  Soumis le {formatDate(ticket.engineer_response.created_at)}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setResponseText(ticket.engineer_response.response_text);
                  setIsEditing(true);
                }}
              >
                Modifier la réponse
              </Button>
            </div>
          ) : (
            /* No response or editing */
            <div className="space-y-3">
              <textarea
                className="w-full bg-input-bg border border-input-border rounded-btn px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] resize-none"
                rows={6}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Rédigez votre solution ici..."
                disabled={isResolved}
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowResolveConfirm(true)}
                  loading={submitResponse.isPending || editResponse.isPending || resolveTicket.isPending}
                  disabled={!responseText.trim() || isResolved}
                  className="!bg-green-600 hover:!bg-green-700"
                >
                  <CheckCircle2 size={14} />
                  {isEditing ? 'Mettre à jour et résoudre' : 'Soumettre et résoudre'}
                </Button>
                {isEditing && (
                  <Button variant="secondary" onClick={() => { setIsEditing(false); setResponseText(''); }}>
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Action Bar ─────────────────────────────────────────── */}
        {!isResolved && (
          <div className="bg-white border border-border rounded-card p-4 shadow-card flex flex-wrap items-center gap-3" style={{ animation: 'slideUp 0.35s ease-out 0.32s both' }}>
            <Button
              variant="accent"
              onClick={() => setShowRequestContextModal(true)}
            >
              <MessageSquare size={15} />
              Demander plus de contexte
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowMisassignmentModal(true)}
              className="!text-danger hover:!bg-red-50 !border !border-red-200"
            >
              <AlertTriangle size={15} />
              Signaler une mauvaise assignation
            </Button>
          </div>
        )}
      </div>

      {/* ── Right Sidebar (toggleable) ───────────────────────────── */}
      <div
        className={clsx(
          'hidden lg:flex flex-col w-[300px] flex-shrink-0 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 w-0 overflow-hidden'
        )}
      >
        <div className="bg-white border border-border rounded-card shadow-card sticky top-[76px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-divider">
            <h3 className="text-sm font-semibold text-text-primary">Tickets assignés</h3>
            <span className="text-xs text-text-muted">{otherTickets.length} en cours</span>
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto divide-y divide-divider">
            {otherTickets.length === 0 ? (
              <p className="px-5 py-8 text-sm text-text-muted text-center">Aucun autre ticket actif.</p>
            ) : (
              otherTickets.map((t) => (
                <Link
                  key={t.id}
                  to={`/engineer/tickets/${t.id}`}
                  className={clsx(
                    'block px-5 py-3.5 hover:bg-surface-muted transition-colors',
                    t.id === Number(id) && 'bg-primary-light'
                  )}
                >
                  <p className="text-sm font-medium text-text-primary truncate leading-snug">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={t.status} />
                    <span className="text-[10px] text-text-muted">{formatShortDate(t.created_at)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────── */}
      <ConfirmDialog
        open={showResolveConfirm}
        onClose={() => setShowResolveConfirm(false)}
        onConfirm={handleResolve}
        title="Résoudre ce ticket ?"
        message="La réponse sera soumise et une entrée sera ajoutée à la base de connaissances. Cette action est définitive."
        confirmLabel="Soumettre et Résoudre"
        loading={resolveTicket.isPending || submitResponse.isPending}
      />

      <MisassignmentModal
        open={showMisassignmentModal}
        onClose={() => setShowMisassignmentModal(false)}
        onSubmit={handleMisassignment}
        loading={reportMisassignment.isPending}
      />

      <Modal
        open={showRequestContextModal}
        onClose={() => setShowRequestContextModal(false)}
        title="Demander une clarification au développeur"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowRequestContextModal(false)}>Annuler</Button>
            <Button 
              variant="primary" 
              onClick={handleRequestContext} 
              loading={requestContext.isPending}
              disabled={!contextMessage.trim()}
            >
              Envoyer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Formulez votre question ou demande de contexte pour aider à la résolution du ticket. Le développeur recevra une notification.
          </p>
          <textarea
            className="w-full bg-input-bg border border-input-border rounded-btn px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] resize-none"
            rows={5}
            value={contextMessage}
            onChange={(e) => setContextMessage(e.target.value)}
            placeholder="Ex: Pouvez-vous fournir les logs d'erreur exacts observés lors du crash ?"
          />
        </div>
      </Modal>
    </div>
  );
}
