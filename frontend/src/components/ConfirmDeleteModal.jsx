import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * ConfirmDeleteModal - A premium warning confirmation dialog.
 *
 * Props:
 *   isOpen     {boolean}  - Controls visibility
 *   onClose    {function} - Called when user cancels or closes
 *   onConfirm  {function} - Called when user confirms deletion (async-safe)
 *   title      {string}   - Modal heading, e.g. "Delete Project?"
 *   itemName   {string}   - Name of the item being deleted (shown prominently)
 *   itemSub    {string}   - Optional sub-label (e.g. project code)
 *   description {string}  - Optional override for warning body text
 *   isDeleting {boolean}  - When true, shows loading spinner on confirm button
 */
export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item?',
  itemName = '',
  itemSub = '',
  description,
  isDeleting = false,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const warningText =
    description ||
    'This action is permanent and cannot be undone. The record will be immediately removed from the database.';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top danger gradient bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-500" />

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-7 space-y-5">
                {/* Warning Icon Badge */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center shadow-sm">
                      <Trash2 className="w-7 h-7 text-rose-500" />
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow">
                      <AlertTriangle className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
                  {itemName && (
                    <div className="mt-2 space-y-0.5">
                      <p className="text-sm font-bold text-slate-700 line-clamp-2 px-2">
                        "{itemName}"
                      </p>
                      {itemSub && (
                        <p className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">
                          {itemSub}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Warning Body */}
                <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3.5 flex gap-3 items-start">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 leading-relaxed">{warningText}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-sm font-black shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
