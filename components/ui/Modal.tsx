'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const maxWidthMap: Record<NonNullable<ModalProps['maxWidth']>, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export function Modal({ open, onClose, title, children, maxWidth = '3xl' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        aria-label="Sluit dialoog"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm animate-[modalFadeIn_0.25s_ease-out]"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidthMap[maxWidth]} max-h-[90vh] overflow-y-auto sm:rounded-lg border border-white/[0.08] backdrop-blur-xl shadow-[0_2px_4px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.25),0_24px_48px_rgba(0,0,0,0.3),0_48px_96px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] outline-none animate-[modalSlideUp_0.3s_ease-out]`}
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(202,202,170,0.04) 100%), rgba(4,7,17,0.88)',
        }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-4 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 py-4"
          style={{ background: 'rgba(4,7,17,0.6)' }}
        >
          <h3 id="modal-title" className="text-h3 font-bold text-cornsilk">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-md text-dry-sage/80 hover:text-cornsilk border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 sm:py-8">{children}</div>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
