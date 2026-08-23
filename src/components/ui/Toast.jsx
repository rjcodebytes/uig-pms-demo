'use client';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`alert alert-${type}`}
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        zIndex: 999, minWidth: '280px', maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.2s ease',
      }}
    >
      {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}
      >×</button>
    </div>
  );
}
