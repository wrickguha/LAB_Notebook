import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  List,
  Calendar,
  Plus,
  X,
  CheckSquare,
  Users,
  Clock,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

export default function ProjectsPage() {
  const { projects, setProjects, addProject } = useApp();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'timeline'
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [projName, setProjName] = useState('');
  const [projCode, setProjCode] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStatus, setProjStatus] = useState('Active');
  const [projMilestones, setProjMilestones] = useState('');
  const [projBanner, setProjBanner] = useState('https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800');

  const banners = [
    { name: 'Biotech Blue', url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800' },
    { name: 'Microscopy Emerald', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800' },
    { name: 'Diagnostics Purple', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800' },
    { name: 'Neural Violet', url: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=800' }
  ];

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projName || !projCode) return;

    const milestonesList = projMilestones
      .split(',')
      .map((m, idx) => ({
        id: `custom-m-${Date.now()}-${idx}`,
        name: m.trim(),
        completed: false
      }))
      .filter(m => m.name !== '');

    addProject({
      name: projName,
      code: projCode,
      description: projDesc,
      status: projStatus,
      milestones: milestonesList,
      banner: projBanner,
      progress: 0
    });

    setProjName('');
    setProjCode('');
    setProjDesc('');
    setProjStatus('Active');
    setProjMilestones('');
    setModalOpen(false);
  };

  const toggleMilestone = (projectID, milestoneID) => {
    setProjects(projects.map(p => {
      if (p.id === projectID) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.id === milestoneID) {
            return { ...m, completed: !m.completed };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const totalCount = updatedMilestones.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          ...p,
          milestones: updatedMilestones,
          progress: newProgress,
          lastActivity: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case 'Planning': return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'On Hold': return 'bg-amber-50 text-amber-700 border-amber-150';
      default: return 'bg-slate-50 text-slate-650';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
        
        {/* Layout View Toggles */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          {[
            { mode: 'grid', label: 'Grid', icon: Grid },
            { mode: 'list', label: 'List', icon: List },
            { mode: 'timeline', label: 'Timeline', icon: Calendar }
          ].map((btn) => (
            <button
              key={btn.mode}
              onClick={() => setViewMode(btn.mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-ring ${
                viewMode === btn.mode ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              <btn.icon className="w-3.5 h-3.5" />
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-2.5 shadow hover:scale-[1.01] active:scale-[0.99] transition-all focus-ring"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Project
        </button>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm flex flex-col justify-between transition-all duration-300"
            >
              <div>
                {/* Banner */}
                <div className="h-28 relative overflow-hidden group">
                  <img src={proj.banner} alt={proj.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[9px] font-black text-white tracking-widest uppercase bg-blue-600/75 backdrop-blur px-2.5 py-0.5 rounded-md">
                    {proj.code}
                  </span>
                </div>

                {/* Scope and Info */}
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{proj.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-extrabold ${getStatusColor(proj.status)}`}>
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed truncate-2-lines">{proj.description}</p>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-455">
                      <span>Research Progress</span>
                      <span className="text-blue-600">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${proj.progress}%` }} className="bg-blue-600 h-full rounded-full transition-all duration-300" />
                    </div>
                  </div>

                  {/* Checkable Milestones */}
                  {proj.milestones.length > 0 && (
                    <div className="border-t border-slate-100 pt-3.5 space-y-2">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Activity Checklist (Click items)</span>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
                        {proj.milestones.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => toggleMilestone(proj.id, m.id)}
                            className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all text-xs text-slate-655 focus-ring"
                            aria-label={`Toggle milestone ${m.name}`}
                          >
                            <input
                              type="checkbox"
                              checked={m.completed}
                              readOnly
                              className="mt-0.5 h-3.5 w-3.5 text-blue-600 border-slate-300 rounded pointer-events-none focus:ring-0"
                            />
                            <span className={m.completed ? 'text-slate-400 line-through' : 'font-semibold text-slate-700'}>
                              {m.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {proj.members.map((mem, i) => (
                      <img
                        key={i}
                        src={mem.avatar}
                        alt={mem.name}
                        title={`${mem.name} (${mem.role})`}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">{proj.members.length} team members</span>
                </div>
                
                <span className="text-[9px] text-slate-450 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" />
                  {new Date(proj.lastActivity).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-x-auto animate-fade-in-up">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-550 uppercase tracking-widest text-[9px]">
                <th className="p-4 w-28">Code</th>
                <th className="p-4">Project Title</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-40">Progress</th>
                <th className="p-4 w-32 text-center">Milestones</th>
                <th className="p-4 w-32">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} className="border-b border-slate-150 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-black text-blue-650">{proj.code}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{proj.name}</div>
                    <div className="text-[10px] text-slate-450 mt-0.5 truncate max-w-sm">{proj.description}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full border text-[8px] font-extrabold ${getStatusColor(proj.status)}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: `${proj.progress}%` }} className="bg-blue-605 h-full rounded-full" />
                      </div>
                      <span className="font-bold text-slate-700">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-slate-500 font-semibold">
                    {proj.milestones.filter(m => m.completed).length} / {proj.milestones.length}
                  </td>
                  <td className="p-4 text-slate-450 font-semibold">
                    {new Date(proj.lastActivity).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TIMELINE SCHEDULER VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 space-y-6 animate-fade-in-up">
          <div>
            <h3 className="font-bold text-slate-850 text-xs">Gantt Milestone Schedule</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Chronological sequencing of active pipelines</p>
          </div>
          
          <div className="space-y-6 pt-4 border-t border-slate-150">
            {projects.map((proj, idx) => (
              <div key={proj.id} className="grid grid-cols-12 items-center gap-4 text-xs">
                <div className="col-span-3 font-bold text-slate-700 truncate">{proj.name.split(':')[0]}</div>
                <div className="col-span-9 relative py-2">
                  <div className="w-full bg-slate-100 h-6 rounded-lg relative overflow-hidden flex items-center px-3 shadow-inner">
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{
                        opacity: 1,
                        width: `${Math.max(100 - idx * 25, 30)}%`,
                        marginLeft: `${idx * 12}%`
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-y-1 bg-blue-500/20 border-l-4 border-blue-600 rounded flex items-center justify-between px-2.5 text-[9px] font-black text-blue-750 shadow-sm"
                    >
                      <span className="truncate">{proj.code} Run</span>
                      <span>{proj.progress}%</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PROJECT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl relative w-full max-w-lg overflow-hidden p-6 z-10"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Initialize Research Pipeline</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-ring"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 text-xs text-slate-750">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Project Artemis"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">Project Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PA-CRISPR"
                      value={projCode}
                      onChange={(e) => setProjCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">Scope & Objective</label>
                  <textarea
                    rows={3}
                    placeholder="Describe targets, vector sequences, or polymer formulations."
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">Status</label>
                    <select
                      value={projStatus}
                      onChange={(e) => setProjStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    >
                      <option value="Active">Active</option>
                      <option value="Planning">Planning</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">Select Banner</label>
                    <select
                      value={projBanner}
                      onChange={(e) => setProjBanner(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    >
                      {banners.map((b, i) => (
                        <option key={i} value={b.url}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">
                    Activity Milestones (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="sgRNA design, Transfection efficiency, Electrophoresis verification"
                    value={projMilestones}
                    onChange={(e) => setProjMilestones(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">Separate milestones with a comma to add multiple checklist points.</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-lg focus-ring"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow focus-ring"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
