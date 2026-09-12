import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Edit3,
  Trash2,
  Plus,
  Check,
  Image as ImageIcon,
  Target,
  CheckCircle2,
  Activity,
  Layers,
  AlertTriangle,
} from 'lucide-react';

const banners = [
  { name: 'Genomics Teal',       url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=1200' },
  { name: 'Microscopy Emerald',  url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200' },
  { name: 'Bioprocess Indigo',   url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200' },
  { name: 'Molecular Violet',    url: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=1200' },
  { name: 'Cell Culture Blue',   url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200' },
  { name: 'Proteomics Rose',     url: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=1200' },
];

const statusConfig = {
  Active:    { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400', pulse: true  },
  Planning:  { color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',            dot: 'bg-sky-400',     pulse: false },
  'On Hold': { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',      dot: 'bg-amber-400',   pulse: false },
  Completed: { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',   dot: 'bg-purple-400',  pulse: false },
};

function ProgressRing({ progress, size = 80 }) {
  const r    = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <defs>
        <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#pgGrad)" strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={off}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.55s cubic-bezier(.4,0,.2,1)' }}
      />
    </svg>
  );
}

export default function ProjectEditPage({ project, onSave, onCancel }) {
  const [editName,     setEditName]     = useState(project?.name        || '');
  const [editCode,     setEditCode]     = useState(project?.code        || '');
  const [editDesc,     setEditDesc]     = useState(project?.description || '');
  const [editStatus,   setEditStatus]   = useState(project?.status      || 'Active');
  const [editBanner,   setEditBanner]   = useState(project?.banner      || banners[0].url);
  const [editProgress, setEditProgress] = useState(project?.progress    ?? 0);
  const [milestones,   setMilestones]   = useState(
    (project?.milestones || []).map(m => ({ id: m.id, name: m.name, completed: Boolean(m.completed) }))
  );
  const [newMilestone,  setNewMilestone]  = useState('');
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [saveSuccess,   setSaveSuccess]   = useState(false);
  const [activeSection, setActiveSection] = useState('identity');
  const [unsaved,       setUnsaved]       = useState(false);
  const newMilestoneRef = useRef(null);

  useEffect(() => { setUnsaved(true); }, [editName, editCode, editDesc, editStatus, editBanner, editProgress, milestones]);

  const completedCount = milestones.filter(m => m.completed).length;

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) return;
    const updated = [...milestones, { id: `m-${Date.now()}`, name: newMilestone.trim(), completed: false }];
    setMilestones(updated);
    setNewMilestone('');
    setTimeout(() => newMilestoneRef.current?.focus(), 50);
  };

  const handleToggle = (idx) => {
    const upd = [...milestones];
    upd[idx] = { ...upd[idx], completed: !upd[idx].completed };
    setMilestones(upd);
    const done = upd.filter(m => m.completed).length;
    setEditProgress(upd.length > 0 ? Math.round((done / upd.length) * 100) : editProgress);
  };

  const handleRemove = (idx) => {
    const upd = milestones.filter((_, i) => i !== idx);
    setMilestones(upd);
    const done = upd.filter(m => m.completed).length;
    setEditProgress(upd.length > 0 ? Math.round((done / upd.length) * 100) : 0);
  };

  const handleUpdateName = (idx, val) => {
    const upd = [...milestones];
    upd[idx] = { ...upd[idx], name: val };
    setMilestones(upd);
  };

  const handleSubmit = async () => {
    if (!editName.trim() || !editCode.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        name:        editName.trim(),
        code:        editCode.trim().toUpperCase(),
        description: editDesc.trim(),
        status:      editStatus,
        banner:      editBanner,
        progress:    Number(editProgress),
        milestones,
        members:     project?.members,
      });
      setSaveSuccess(true);
      setUnsaved(false);
      setTimeout(() => { setSaveSuccess(false); onCancel(); }, 1100);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'identity',   label: 'Identity',   icon: Edit3     },
    { id: 'milestones', label: 'Milestones', icon: Target    },
    { id: 'visual',     label: 'Visual',     icon: ImageIcon },
  ];

  return (
    <motion.div
      key="project-edit-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
      style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="relative h-56 rounded-3xl overflow-hidden mb-0">
        <img
          src={editBanner}
          alt="Project banner"
          className="w-full h-full object-cover transition-all duration-700"
          style={{ filter: 'brightness(0.35) saturate(1.4)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent" />

        {/* Back */}
        <div className="absolute top-4 left-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Projects
          </button>
        </div>

        {/* Unsaved */}
        <AnimatePresence>
          {unsaved && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold backdrop-blur"
            >
              <AlertTriangle className="w-3 h-3" />
              Unsaved changes
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 flex items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono font-black tracking-[0.22em] text-teal-400 uppercase">
                {editCode || project?.code || 'PRJ-CODE'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold ${statusConfig[editStatus]?.color || ''}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[editStatus]?.dot || ''} ${statusConfig[editStatus]?.pulse ? 'animate-pulse' : ''}`} />
                {editStatus}
              </span>
            </div>
            <h1 className="text-xl font-black text-white leading-tight max-w-md">
              {editName || project?.name || 'Untitled Project'}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">EDITING PROJECT CONFIGURATION</p>
          </div>

          {/* Progress ring */}
          <div className="relative shrink-0 flex items-center justify-center">
            <ProgressRing progress={editProgress} size={72} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black text-white leading-none">{editProgress}%</span>
              <span className="text-[7px] text-slate-500 font-mono">DONE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div className="bg-slate-950 -mt-px rounded-b-3xl border border-slate-800/60 border-t-0">

        {/* Tabs */}
        <div className="flex items-center gap-0.5 px-6 pt-3 border-b border-slate-800/60">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold rounded-t-xl transition-all cursor-pointer border border-b-0 ${
                activeSection === tab.id
                  ? 'bg-slate-800 text-teal-400 border-slate-700'
                  : 'text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">

          {/* Identity */}
          {activeSection === 'identity' && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Project Title *</label>
                  <input
                    type="text" required value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="e.g. CRISPR Gene Therapy Pipeline"
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Project Code *</label>
                  <input
                    type="text" required value={editCode}
                    onChange={e => setEditCode(e.target.value.toUpperCase())}
                    placeholder="PRJ-CRISPR-01"
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-sm font-mono font-bold text-teal-400 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Status</label>
                  <select
                    value={editStatus} onChange={e => setEditStatus(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Planning">Planning</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Scope & Objectives</label>
                  <textarea
                    rows={4} value={editDesc} onChange={e => setEditDesc(e.target.value)}
                    placeholder="Describe targets, hypotheses, vector sequences, methodologies..."
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Progress */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Research Progress</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {milestones.length > 0 ? `Auto-synced: ${completedCount}/${milestones.length} milestones done` : 'Set manually — add milestones for auto-sync'}
                    </p>
                  </div>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">{editProgress}%</span>
                </div>
                <div className="relative h-2">
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-sky-500 rounded-full transition-all duration-500" style={{ width: `${editProgress}%` }} />
                  </div>
                  <input
                    type="range" min="0" max="100" step="1" value={editProgress}
                    onChange={e => setEditProgress(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-600">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Milestones */}
          {activeSection === 'milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-5"
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total',     value: milestones.length,                    icon: Layers,       color: 'text-slate-300' },
                  { label: 'Completed', value: completedCount,                       icon: CheckCircle2, color: 'text-emerald-400' },
                  { label: 'Remaining', value: milestones.length - completedCount,   icon: Activity,     color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
                    <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
                    <div>
                      <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  ref={newMilestoneRef}
                  type="text" placeholder="Add a milestone step… (Enter to add)"
                  value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddMilestone(); } }}
                  className="flex-1 bg-slate-800/60 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
                <button
                  type="button" onClick={handleAddMilestone}
                  className="px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                <AnimatePresence>
                  {milestones.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                      <Target className="w-10 h-10 text-slate-700 mb-3" />
                      <p className="text-sm text-slate-500 font-semibold">No milestones yet</p>
                      <p className="text-[11px] text-slate-600 mt-1">Add bench checkpoints to auto-track progress</p>
                    </motion.div>
                  ) : milestones.map((m, idx) => (
                    <motion.div
                      key={m.id || idx}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                      className={`group flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                        m.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600/80'
                      }`}
                    >
                      <button
                        type="button" onClick={() => handleToggle(idx)}
                        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                          m.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-teal-500'
                        }`}
                      >
                        {m.completed && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <input
                        type="text" value={m.name} onChange={e => handleUpdateName(idx, e.target.value)}
                        className={`flex-1 bg-transparent border-none p-0 text-sm font-semibold focus:outline-none focus:ring-0 transition-colors ${
                          m.completed ? 'text-slate-500 line-through' : 'text-white'
                        }`}
                      />
                      {m.completed && (
                        <span className="shrink-0 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">DONE</span>
                      )}
                      <button
                        type="button" onClick={() => handleRemove(idx)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Visual */}
          {activeSection === 'visual' && (
            <motion.div
              key="visual"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-5"
            >
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Cover Banner Theme</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {banners.map((b) => (
                    <button
                      key={b.url} type="button" onClick={() => setEditBanner(b.url)}
                      className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
                        editBanner === b.url ? 'border-teal-400 shadow-lg shadow-teal-500/25' : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <img src={b.url} alt={b.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.5)' }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                        {editBanner === b.url && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-900" />
                          </motion.div>
                        )}
                        <span className="text-[9px] font-mono font-bold text-white tracking-wider">{b.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Live Preview</p>
                <div className="relative h-40 rounded-2xl overflow-hidden border border-slate-700">
                  <img src={editBanner} alt="preview" className="w-full h-full object-cover" style={{ filter: 'brightness(0.38)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[9px] font-mono font-bold text-teal-400 tracking-widest block">{editCode || 'PRJ-CODE'}</span>
                    <p className="text-white font-black text-sm mt-0.5">{editName || 'Project Title'}</p>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusConfig[editStatus]?.color || ''}`}>{editStatus}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-t border-slate-800/60">
          <button
            type="button" onClick={onCancel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-sm font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Discard & Go Back
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[10px] font-mono text-slate-500">
              {completedCount}/{milestones.length} milestones · {editProgress}% complete
            </span>
            <button
              type="button" onClick={handleSubmit}
              disabled={isSubmitting || !editName.trim() || !editCode.trim()}
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                saveSuccess
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-teal-500/30 hover:scale-[1.03] active:scale-[0.97]'
              }`}
            >
              {saveSuccess ? (
                <><CheckCircle2 className="w-4 h-4" />Saved!</>
              ) : isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
              ) : (
                <><Save className="w-4 h-4" />Save Project</>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
