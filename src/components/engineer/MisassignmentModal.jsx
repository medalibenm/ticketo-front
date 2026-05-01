import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function MisassignmentModal({ open, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('La raison du signalement est requise.');
      return;
    }
    setError('');
    onSubmit(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Signaler une mauvaise assignation"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            loading={loading}
          >
            Envoyer le signalement
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Veuillez fournir un contexte pour la réassignation de ce ticket.
        </p>

        {/* Reason textarea */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-medium text-text-secondary">
            Raison du signalement
          </label>
          <textarea
            className="w-full bg-input-bg border border-input-border rounded-btn px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,179,0.08)] resize-none"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Décrivez pourquoi ce ticket ne relève pas de votre domaine de compétence..."
          />
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 bg-accent-light rounded-btn p-3">
          <AlertTriangle size={16} className="text-accent-text flex-shrink-0 mt-0.5" />
          <p className="text-xs text-accent-text leading-relaxed">
            Un administrateur sera notifié et pourra réassigner ce ticket à un autre ingénieur.
          </p>
        </div>
      </div>
    </Modal>
  );
}
