import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(2px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '540px', 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          position: 'relative',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header-flex" style={{ marginBottom: '1.25rem' }}>
          <h2 className="card-title" style={{ fontSize: '1.25rem' }}>{title}</h2>
          <button 
            className="icon-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
