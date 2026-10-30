import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs sm:text-sm font-medium ${
        toast.type === 'error'
          ? 'bg-error-container text-error border-error/20'
          : toast.type === 'info'
          ? 'bg-primary-container text-on-primary border-primary-container'
          : 'bg-primary text-on-primary border-primary/20'
      }`}>
        <span className="material-symbols-outlined text-[20px] text-secondary-fixed">
          {toast.type === 'error' ? 'error' : 'verified'}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
