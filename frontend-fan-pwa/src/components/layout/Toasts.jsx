import React from 'react';

export default function Toasts({ toasts, dismiss }) {
  return (
    <div className="toast-container" aria-live="polite" role="status">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon">
            <span className="ms" aria-hidden="true">
              {t.type === 'critical' ? 'warning' : t.type === 'success' ? 'check_circle' : 'info'}
            </span>
          </div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.msg}</div>
          </div>
          <button className="toast-close" onClick={() => dismiss(t.id)} aria-label={`Dismiss ${t.title} notification`}>
            <span className="ms" aria-hidden="true">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
