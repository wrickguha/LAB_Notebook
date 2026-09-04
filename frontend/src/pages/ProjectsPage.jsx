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
  Image as ImageIcon,
  Edit3,
  Trash2,
  Check,
  Percent,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProjectsPage() {
  const { projects, setProjects, addProject, updateProject } = useApp();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'timeline'
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Create Project Form States
  const [projName, setProjName] = useState('');
  const [projCode, setProjCode] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStatus, setProjStatus] = useState('Active');
  const [projMilestones, setProjMilestones] = useState('');
  const [projBanner, setProjBanner] = useState('https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800');

  // Edit Project Form States
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState('Active');
  const [editBanner, setEditBanner] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editMilestonesList, setEditMilestonesList] = useState([]);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const banners = [
    { name: 'Biotech Blue', url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800' },
    { name: 'Microscopy Emerald', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800' },
    { name: 'Diagnostics Purple', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800' },
    { name: 'Neural Violet', url: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=800' }
  ];

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projName.trim() || !projCode.trim()) return;

    const milestonesList = projMilestones
      .split(',')
      .map((m, idx) => ({
        id: `custom-m-${Date.now()}-${idx}`,
        name: m.trim(),
        completed: false
      }))
      .filter(m => m.name !== '');

    addProject({
      name: projName.trim(),
      code: projCode.trim().toUpperCase(),
      description: projDesc.trim(),
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
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = (project) => {
    setSelectedProject(project);
    setEditName(project.name || '');
    setEditCode(project.code || '');
    setEditDesc(project.description || '');
    setEditStatus(project.status || 'Active');
    setEditBanner(project.banner || banners[0].url);
    setEditProgress(project.progress ?? 0);
    setEditMilestonesList(
      (project.milestones || []).map(m => ({
        id: m.id,
        name: m.name,
        completed: Boolean(m.completed)
      }))
    );
    setNewMilestoneInput('');
    setEditModalOpen(true);
  };

  const handleAddMilestoneToEdit = () => {
    if (!newMilestoneInput.trim()) return;
    setEditMilestonesList([
      ...editMilestonesList,
      {
        id: `m-new-${Date.now()}`,
        name: newMilestoneInput.trim(),
        completed: false
      }
    ]);
    setNewMilestoneInput('');
  };

  const handleToggleEditMilestone = (index) => {
    const updated = [...editMilestonesList];
    updated[index].completed = !updated[index].completed;
    setEditMilestonesList(updated);

    // Recalculate suggested progress
    const completedCount = updated.filter(m => m.completed).length;
    const totalCount = updated.length;
    if (totalCount > 0) {
      setEditProgress(Math.round((completedCount / totalCount) * 100));
    }
  };

  const handleRemoveEditMilestone = (index) => {
    const updated = editMilestonesList.filter((_, idx) => idx !== index);
    setEditMilestonesList(updated);
  };

  const handleUpdateEditMilestoneName = (index, newName) => {
    const updated = [...editMilestonesList];
    updated[index].name = newName;
    setEditMilestonesList(updated);
  };

  const handleSaveProjectEdit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !editName.trim() || !editCode.trim()) return;

    setIsSubmittingEdit(true);
    try {
      await updateProject(selectedProject.id, {
        name: editName.trim(),
        code: editCode.trim().toUpperCase(),
        description: editDesc.trim(),
        status: editStatus,
        banner: editBanner,
        progress: Number(editProgress),
        milestones: editMilestonesList,
        members: selectedProject.members
      });

      setEditModalOpen(false);
      setSelectedProject(null);
    } catch (err) {
      console.error('Error saving project edits:', err);
    } finally {
      setIsSubmittingEdit(false);
    }
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
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Planning': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'On Hold': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-650 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-sm">
        
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-ring cursor-pointer ${
                viewMode === btn.mode ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <btn.icon className="w-3.5 h-3.5" />
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-2.5 shadow-md shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all focus-ring cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                {/* Banner & Floating Actions */}
                <div className="h-32 relative overflow-hidden bg-slate-900">
                  <img
                    src={proj.banner}
                    alt={proj.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Project Code Badge */}
                  <span className="absolute bottom-3 left-4 text-[9px] font-black text-white tracking-widest uppercase bg-blue-600/90 backdrop-blur px-2.5 py-1 rounded-md shadow-sm">
                    {proj.code}
                  </span>

                  {/* Edit Button on Top Right of Banner */}
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-slate-800 text-[10px] font-bold backdrop-blur shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit3 className="w-3 h-3 text-blue-600" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Scope and Info */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                      {proj.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold shrink-0 ${getStatusColor(proj.status)}`}>
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{proj.description}</p>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500">
                      <span>Research Progress</span>
                      <span className="text-blue-600 font-black">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${proj.progress}%` }}
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Checkable Milestones */}
                  {proj.milestones && proj.milestones.length > 0 && (
                    <div className="border-t border-slate-100 pt-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                          Activity Checklist ({proj.milestones.filter(m => m.completed).length}/{proj.milestones.length})
                        </span>
                        <span className="text-[9px] text-blue-600 font-semibold">Click to toggle</span>
                      </div>
                      
                      <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                        {proj.milestones.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => toggleMilestone(proj.id, m.id)}
                            className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-xs text-slate-650 focus-ring cursor-pointer"
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
              <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {(proj.members || []).map((mem, i) => (
                      <img
                        key={i}
                        src={mem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={mem.name}
                        title={`${mem.name} (${mem.role})`}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-white shadow-xs"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{(proj.members || []).length} members</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {proj.lastActivity ? new Date(proj.lastActivity).toLocaleDateString() : 'Active'}
                  </span>
                  
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="text-blue-600 hover:text-blue-700 font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-500 uppercase tracking-widest text-[9px]">
                <th className="p-4 pl-6 w-28">Code</th>
                <th className="p-4">Project Title</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-44">Progress</th>
                <th className="p-4 w-32 text-center">Milestones</th>
                <th className="p-4 w-32">Last Activity</th>
                <th className="p-4 w-24 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} className="border-b border-slate-150 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 pl-6 font-black text-blue-600">{proj.code}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-xs">{proj.name}</div>
                    <div className="text-[10px] text-slate-450 mt-0.5 line-clamp-1 max-w-sm">{proj.description}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-extrabold ${getStatusColor(proj.status)}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${proj.progress}%` }} className="bg-blue-600 h-full rounded-full" />
                      </div>
                      <span className="font-extrabold text-slate-700 text-[11px]">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-slate-500 font-semibold text-[11px]">
                    {(proj.milestones || []).filter(m => m.completed).length} / {(proj.milestones || []).length}
                  </td>
                  <td className="p-4 text-slate-450 font-medium text-[11px]">
                    {proj.lastActivity ? new Date(proj.lastActivity).toLocaleDateString() : 'Active'}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={() => handleOpenEditModal(proj)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TIMELINE SCHEDULER VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Gantt Milestone Schedule</h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Chronological sequencing of active research pipelines</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {projects.length} Pipelines Tracked
            </span>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-slate-150">
            {projects.map((proj, idx) => (
              <div key={proj.id} className="grid grid-cols-12 items-center gap-4 text-xs p-2 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <div className="col-span-4 sm:col-span-3">
                  <p className="font-bold text-slate-800 truncate text-xs">{proj.name}</p>
                  <p className="text-[10px] text-slate-400">{proj.code} • {proj.status}</p>
                </div>
                <div className="col-span-8 sm:col-span-9 relative py-2">
                  <div className="w-full bg-slate-100 h-8 rounded-xl relative overflow-hidden flex items-center px-3 shadow-inner">
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{
                        opacity: 1,
                        width: `${Math.max(proj.progress, 15)}%`,
                        marginLeft: `${idx * 8}%`
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-y-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/30 border-l-4 border-blue-600 rounded-lg flex items-center justify-between px-3 text-[10px] font-black text-blue-800 shadow-sm"
                    >
                      <span className="truncate">{proj.code}</span>
                      <span>{proj.progress}%</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative w-full max-w-lg p-6 sm:p-8 z-10 text-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-6">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Initialize Research Pipeline</h3>
                  <p className="text-[10px] text-slate-450 mt-0.5">Create a structured tracking workspace for experimental milestones.</p>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-ring cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 text-slate-750">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CRISPR Genome Editing"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CRISPR-01"
                      value={projCode}
                      onChange={(e) => setProjCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scope & Objective</label>
                  <textarea
                    rows={3}
                    placeholder="Describe targets, vector sequences, or polymer formulations."
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select
                      value={projStatus}
                      onChange={(e) => setProjStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Planning">Planning</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Banner Theme</label>
                    <select
                      value={projBanner}
                      onChange={(e) => setProjBanner(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                    >
                      {banners.map((b, i) => (
                        <option key={i} value={b.url}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Activity Milestones (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Vector design review, Cell transfection calibration, Sequencing validation"
                    value={projMilestones}
                    onChange={(e) => setProjMilestones(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                  />
                  <span className="text-[10px] text-slate-400">Separate items with commas to add multiple milestones at once.</span>
                </div>

                <div className="pt-4 border-t border-slate-150 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl focus-ring cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all focus-ring cursor-pointer"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PROJECT MODAL */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 z-10 text-xs no-scrollbar"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-6">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    Edit Project: {selectedProject?.name}
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-0.5">Modify project details, scope, status, progress, and milestones.</p>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-ring cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProjectEdit} className="space-y-5 text-slate-750">
                
                {/* Project Name & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Code *</label>
                    <input
                      type="text"
                      required
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                    />
                  </div>
                </div>

                {/* Scope / Description */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scope & Objectives</label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                  />
                </div>

                {/* Status & Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Planning">Planning</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Banner Visual</label>
                    <select
                      value={editBanner}
                      onChange={(e) => setEditBanner(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                    >
                      {banners.map((b, i) => (
                        <option key={i} value={b.url}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Research Progress Slider */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Research Progress</label>
                    <span className="font-black text-blue-600 text-sm">{editProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={editProgress}
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Milestones Management */}
                <div className="space-y-3 pt-2 border-t border-slate-150">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Milestones Checklist ({editMilestonesList.length})
                  </label>

                  {/* Add Milestone Inline */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add milestone step..."
                      value={newMilestoneInput}
                      onChange={(e) => setNewMilestoneInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestoneToEdit();
                        }
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus-ring"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestoneToEdit}
                      className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                    {editMilestonesList.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-2">No milestones defined yet.</p>
                    ) : (
                      editMilestonesList.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={m.completed}
                              onChange={() => handleToggleEditMilestone(idx)}
                              className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-0 cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => handleUpdateEditMilestoneName(idx, e.target.value)}
                              className={`w-full bg-transparent border-none p-0 text-xs font-semibold focus:ring-0 ${
                                m.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                              }`}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveEditMilestone(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                            title="Delete Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-4 border-t border-slate-150 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl focus-ring cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEdit}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all focus-ring disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingEdit ? 'Saving Changes...' : 'Save Project Changes'}
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
