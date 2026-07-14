import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

const toastStyles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300',
    error: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300',
    info: 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
};

const ToastItem = ({ toast, onDismiss }) => (
    <div className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${toastStyles[toast.type]}`} role="status" aria-live="polite">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-sm opacity-90">{toast.message}</p> : null}
            </div>
            <button type="button" onClick={() => onDismiss(toast.id)} className="rounded-full p-1 text-sm transition hover:opacity-80">✕</button>
        </div>
    </div>
);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismissToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const pushToast = useCallback((title, message, type = 'info', duration = 3200) => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const toast = { id, title, message, type };
        setToasts((current) => [toast, ...current].slice(0, 4));
        window.setTimeout(() => dismissToast(id), duration);
    }, [dismissToast]);

    const value = useMemo(() => ({
        success: (title, message, duration) => pushToast(title, message, 'success', duration),
        error: (title, message, duration) => pushToast(title, message, 'error', duration),
        info: (title, message, duration) => pushToast(title, message, 'info', duration),
    }), [pushToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-2">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
