import { useEffect } from 'react';
import { Button } from './Button';

export function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-[480px]' }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 animate-fade-in"
        onClick={onClose}
      />
      {/* Card */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-modal shadow-modal animate-slide-up flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider flex-shrink-0">
          <h2 className="font-semibold text-base text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-muted hover:text-text-secondary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-divider flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-text-secondary">{message}</p>
    </Modal>
  );
}
