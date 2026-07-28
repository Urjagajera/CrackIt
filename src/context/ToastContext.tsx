import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 transform translate-y-0 animate-bounce-short ${
            toast.type === 'success'
              ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/30'
              : toast.type === 'error'
              ? 'bg-error-container text-on-error-container border-error/30'
              : 'bg-primary-fixed text-on-primary-fixed border-primary/30'
          }`}
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="material-symbols-outlined text-lg">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="hover:opacity-75 transition-opacity shrink-0"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
