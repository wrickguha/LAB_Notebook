import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Copy,
  Check,
  Users,
  Globe,
  Lock,
  ShieldCheck,
  Mail,
  Send,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ShareModal({
  isOpen,
  onClose,
  project,
}) {
  const { user, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [accessScope, setAccessScope] = useState('org'); // 'org' | 'restricted'
  const [collaborators, setCollaborators] = useState([
    {
      id: 'owner',
      name: user?.name || 'Dr. Pratik Guha',
      email: user?.email || 'p.guha@inveniq.org',
      role: 'Owner',
      isCurrentUser: true,
    },
  ]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Reset copied state on close
  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast?.('Project link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast?.('Failed to copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: `${project?.name || 'Research Notebook'} — InveniqLab`,
          text: `Review research documentation for ${project?.name || 'Project'} (${project?.code || 'Doc'}) on InveniqLab.`,
          url: currentUrl,
        });
        showToast?.('Shared successfully', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleInvite = (e) => {
    e.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;

    // Check if already invited
    if (collaborators.some((c) => c.email.toLowerCase() === trimmed.toLowerCase())) {
      showToast?.('This collaborator has already been invited', 'info');
      return;
    }

    const newCollab = {
      id: String(Date.now()),
      name: trimmed.includes('@') ? trimmed.split('@')[0] : trimmed,
      email: trimmed.includes('@') ? trimmed : `${trimmed.toLowerCase()}@lab.org`,
      role: inviteRole,
      isCurrentUser: false,
    };

    setCollaborators((prev) => [...prev, newCollab]);
    setInviteEmail('');
    showToast?.(`Invitation sent to ${newCollab.name} (${inviteRole})`, 'success');
  };

  const handleRemoveCollaborator = (id) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
    showToast?.('Collaborator access removed', 'info');
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="share-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="share-modal"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Share Research Notebook
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {project?.name || 'Project'} • <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">{project?.code || 'PRATIK123'}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5 overflow-y-auto">
                {/* 1. Direct Shareable Link */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Notebook Direct Link
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        readOnly
                        value={currentUrl}
                        className="w-full pl-3 pr-8 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none select-all truncate"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    {typeof navigator !== 'undefined' && navigator.share && (
                      <button
                        type="button"
                        onClick={handleNativeShare}
                        title="Share via device apps"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Access Scope */}
                <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-100/60 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      {accessScope === 'org' ? (
                        <Globe className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {accessScope === 'org'
                          ? 'Organization Access'
                          : 'Restricted Access'}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {accessScope === 'org'
                          ? 'Anyone in InveniqLab team can view with this link'
                          : 'Only invited lab collaborators can access'}
                      </div>
                    </div>
                  </div>

                  <select
                    value={accessScope}
                    onChange={(e) => {
                      setAccessScope(e.target.value);
                      showToast?.(
                        `Access scope updated to ${e.target.value === 'org' ? 'Organization' : 'Restricted'
                        }`,
                        'info'
                      );
                    }}
                    className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
                  >
                    <option value="org">Organization</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>

                {/* 3. Invite Collaborator */}
                <form onSubmit={handleInvite} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Invite Collaborators
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@institution.org or name..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Editor">Editor</option>
                    </select>

                    <button
                      type="submit"
                      disabled={!inviteEmail.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Invite</span>
                    </button>
                  </div>
                </form>

                {/* 4. Collaborator List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Collaborators with access</span>
                    <span className="font-mono font-semibold">{collaborators.length}</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {collaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                            {collab.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                              <span>{collab.name}</span>
                              {collab.isCurrentUser && (
                                <span className="text-[9px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.2 rounded-full border border-teal-200 dark:border-teal-800">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {collab.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${collab.role === 'Owner'
                              ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                              : collab.role === 'Editor'
                                ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800'
                                : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                              }`}
                          >
                            {collab.role}
                          </span>

                          {!collab.isCurrentUser && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCollaborator(collab.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                              title="Remove access"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium">
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
