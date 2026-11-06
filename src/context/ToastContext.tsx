import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container floating bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-[#25201C] text-[#FAF7F2] rounded-lg shadow-xl border border-[#4A3B31] transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="w-2 h-2 rounded-full bg-[#BFA069] mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#FAF7F2] leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[#D4C6B7] mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A69888] hover:text-[#FAF7F2] text-xs transition-colors shrink-0 ml-2"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
