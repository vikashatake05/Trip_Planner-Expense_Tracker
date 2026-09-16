import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        backgroundColor: isSuccess ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)',
        color: isSuccess ? 'var(--accent-success)' : 'var(--accent-danger)',
        border: `1px solid ${isSuccess ? '#A7F3D0' : '#FCA5A5'}`,
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'currentColor',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '0.5rem',
          display: 'flex'
        }}
        aria-label="Close Toast"
      >
        <X size={16} />
      </button>
    </div>
  );
}
