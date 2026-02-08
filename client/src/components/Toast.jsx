import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import useToastStore from '../stores/toastStore';
import './Toast.css';

const icons = {
  success: <CheckCircle size={18} color="var(--neon-green)" />,
  error: <AlertCircle size={18} color="var(--neon-pink)" />,
  info: <Info size={18} color="var(--neon-cyan)" />,
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {icons[t.type] || icons.info}
          <span>{t.message}</span>
          <button className="toast__close" onClick={() => removeToast(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
