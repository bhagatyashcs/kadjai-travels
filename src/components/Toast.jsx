import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const styles = {
    success: 'border-emerald-200 bg-white shadow-emerald-100 text-slate-800',
    error: 'border-rose-200 bg-white shadow-rose-100 text-slate-800',
    warning: 'border-amber-200 bg-white shadow-amber-100 text-slate-800',
    info: 'border-blue-200 bg-white shadow-blue-100 text-slate-800',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${styles[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 min-w-0 mr-1">
          {toast.title && <h4 className="text-sm font-bold text-slate-900 mb-0.5">{toast.title}</h4>}
          <p className="text-xs text-slate-600 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
