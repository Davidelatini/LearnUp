import { useEffect } from 'react';

export default function EditModal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dash-modal-header">
          <span className="dash-modal-title">{title}</span>
          <button className="dash-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="dash-modal-body">{children}</div>
      </div>
    </div>
  );
}
