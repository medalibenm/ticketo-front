import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (type !== 'error' || duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration || 4000);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, d) => addToast(msg, 'success', d),
    error: (msg, d) => addToast(msg, 'error', d || 0),
    info: (msg, d) => addToast(msg, 'info', d),
    warning: (msg, d) => addToast(msg, 'warning', d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const borderColors = {
  success: '#2F855A',
  error: '#C53030',
  info: '#0056B3',
  warning: '#B7791F',
};

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 min-w-[300px] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-white rounded-btn shadow-toast flex items-start gap-3 p-4 animate-slide-up"
          style={{ borderLeft: `4px solid ${borderColors[t.type]}` }}
        >
          <span className="text-sm font-semibold mt-0.5" style={{ color: borderColors[t.type] }}>
            {icons[t.type]}
          </span>
          <p className="flex-1 text-sm text-text-secondary leading-snug">{t.message}</p>
          <button
            onClick={() => onRemove(t.id)}
            className="text-text-muted hover:text-text-secondary transition-colors text-xs mt-0.5"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
