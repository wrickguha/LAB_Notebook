import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
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
} from "lucide-react";

export default function ProjectsPage() {
  const { projects, setProjects, addProject, updateProject, deleteProject } =
    useApp();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list' | 'timeline'
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name, code }
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (proj, e) => {
    e.stopPropagation();
    setDeleteTarget({ id: proj.id, name: proj.name, code: proj.code });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.id, deleteTarget.name);
      setDeleteTarget(null);
    } catch (_) {
      // error already shown via toast
    } finally {
      setIsDeleting(false);
    }
  };

  // Create Project Form States
  const [projName, setProjName] = useState("");
  const [projCode, setProjCode] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projStatus, setProjStatus] = useState("Active");
  const [projMilestones, setProjMilestones] = useState("");
  const [projBanner, setProjBanner] = useState(
    "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800",
  );

  const banners = [
    {
      name: "Genomics Teal",
      url: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800",
    },
    {
      name: "Microscopy Emerald",
      url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
    },
    {
      name: "Bioprocess Indigo",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    },
    {
      name: "Molecular Violet",
      url: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=800",
    },
  ];

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projName.trim() || !projCode.trim()) return;

    const milestonesList = projMilestones
      .split(",")
      .map((m, idx) => ({
        id: `custom-m-${Date.now()}-${idx}`,
        name: m.trim(),
        completed: false,
      }))
      .filter((m) => m.name !== "");

    addProject({
      name: projName.trim(),
      code: projCode.trim().toUpperCase(),
      description: projDesc.trim(),
      status: projStatus,
      milestones: milestonesList,
      banner: projBanner,
      progress: 0,
    });

    setProjName("");
    setProjCode("");
    setProjDesc("");
    setProjStatus("Active");
    setProjMilestones("");
    setCreateModalOpen(false);
  };

  const handleOpenNotebook = (project) => {
    window.open(
        `/lab-notebook/${project.id}`,
        '_blank',
        'noopener,noreferrer'
    );
};

  const handleSaveProjectEdit = async (payload) => {
    if (!editingProject) return;
    await updateProject(editingProject.id, payload);
  };

  const toggleMilestone = (projectID, milestoneID) => {
    setProjects(
      projects.map((p) => {
        if (p.id === projectID) {
          const updatedMilestones = p.milestones.map((m) => {
            if (m.id === milestoneID) {
              return { ...m, completed: !m.completed };
            }
            return m;
          });

          const completedCount = updatedMilestones.filter(
            (m) => m.completed,
          ).length;
          const totalCount = updatedMilestones.length;
          const newProgress =
            totalCount > 0
              ? Math.round((completedCount / totalCount) * 100)
              : 0;

          return {
            ...p,
            milestones: updatedMilestones,
            progress: newProgress,
            lastActivity: new Date().toISOString(),
          };
        }
        return p;
      }),
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "Planning":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "Completed":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "On Hold":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up font-sans">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-xs">
        {/* Layout View Toggles */}
        <div className="inline-flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {[
            { mode: "grid", label: "Grid", icon: Grid },
            { mode: "list", label: "List", icon: List },
            { mode: "timeline", label: "Timeline", icon: Calendar },
          ].map((btn) => (
            <button
              key={btn.mode}
              type="button"
              onClick={() => setViewMode(btn.mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 focus-ring cursor-pointer ${
                viewMode === btn.mode
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <btn.icon className="w-3.5 h-3.5" />
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Add Project CTA */}
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white px-4 py-2.5 shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all focus-ring cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Initialize Project</span>
        </button>
      </div>

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(projects || []).map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                {/* Banner & Floating Actions */}
                <div className="h-36 relative overflow-hidden bg-slate-900">
                  <img
                    src={proj.banner}
                    alt={proj.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                  {/* Project Code Badge */}
                  <span className="absolute bottom-3 left-4 text-[9px] font-mono font-bold text-white tracking-widest uppercase bg-teal-600/90 backdrop-blur px-2.5 py-1 rounded-md shadow-sm">
                    {proj.code}
                  </span>

                  {/* Edit + Delete Buttons on Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
    type="button"
    onClick={() => handleOpenNotebook(proj)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold backdrop-blur shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
>
    <Edit3 className="w-3.5 h-3.5 text-teal-600" />
    <span>Open Notebook</span>
</button>
                  </div>
                </div>

                {/* Scope and Details */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-teal-700 transition-colors">
                      {proj.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold shrink-0 ${getStatusColor(proj.status)}`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500">
                      <span>COMPLETION VELOCITY</span>
                      <span className="text-teal-700 font-mono font-black">
                        {proj.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${proj.progress}%` }}
                        className="bg-teal-600 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Interactive Milestones Checklist */}
                  {proj.milestones && proj.milestones.length > 0 && (
                    <div className="border-t border-slate-100 pt-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                          BENCH CHECKPOINTS (
                          {proj.milestones.filter((m) => m.completed).length}/
                          {proj.milestones.length})
                        </span>
                        <span className="text-[9px] text-teal-600 font-bold">
                          Toggle to update ledger
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                        {proj.milestones.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => toggleMilestone(proj.id, m.id)}
                            className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-xs text-slate-700 focus-ring cursor-pointer"
                            aria-label={`Toggle milestone ${m.name}`}
                          >
                            <input
                              type="checkbox"
                              checked={m.completed}
                              readOnly
                              className="mt-0.5 h-3.5 w-3.5 text-teal-600 border-slate-300 rounded pointer-events-none focus:ring-0"
                            />
                            <span
                              className={
                                m.completed
                                  ? "text-slate-400 line-through"
                                  : "font-semibold text-slate-800"
                              }
                            >
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
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium font-mono">
                    <Clock className="w-3 h-3" />
                    {proj.lastActivity
                      ? new Date(proj.lastActivity).toLocaleDateString()
                      : "Active"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-500 uppercase tracking-widest text-[9px] font-mono">
                <th className="p-4 pl-6 w-28">Code</th>
                <th className="p-4">Project Title</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-48">Progress</th>
                <th className="p-4 w-32 text-center">Milestones</th>
                <th className="p-4 w-32">Last Activity</th>
                <th className="p-4 w-24 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {(projects || []).map((proj) => (
                <tr
                  key={proj.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                >
                  <td className="p-4 pl-6 font-mono font-black text-teal-700">
                    {proj.code}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-xs">
                      {proj.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                      {proj.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold ${getStatusColor(proj.status)}`}
                    >
                      {proj.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${proj.progress}%` }}
                          className="bg-teal-600 h-full rounded-full"
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-700 text-[11px]">
                        {proj.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-slate-600 font-mono text-[11px]">
                    {(proj.milestones || []).filter((m) => m.completed).length}{" "}
                    / {(proj.milestones || []).length}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {proj.lastActivity
                      ? new Date(proj.lastActivity).toLocaleDateString()
                      : "Active"}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(proj)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(proj, e)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TIMELINE SCHEDULER VIEW */}
      {viewMode === "timeline" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-slate-900 text-sm">
                Gantt Milestone Roadmap
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Sequential timeline of active research pipelines and bench
                targets
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
              {(projects || []).length} Pipelines Tracked
            </span>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-150">
            {(projects || []).map((proj) => (
              <div
                key={proj.id}
                className="grid grid-cols-12 items-center gap-4 text-xs p-3 rounded-2xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="col-span-4 sm:col-span-3">
                  <p className="font-bold text-slate-900 truncate text-xs">
                    {proj.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    {proj.code} • {proj.status}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(proj, e)}
                    className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    Delete
                  </button>
                </div>
                <div className="col-span-8 sm:col-span-9 relative py-2">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(proj.progress || 0, 5)}%` }}
                      className="bg-gradient-to-r from-teal-600 to-teal-500 h-full rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-1">
                    <span>Q1 Kickoff</span>
                    <span>Q2 Assay Trials</span>
                    <span>Q3 Sign-off</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {createPortal(
        <AnimatePresence>
          {createModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCreateModalOpen(false)}
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative z-10 my-auto w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-xs shadow-2xl sm:p-8 no-scrollbar"
              >
                <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-6">
                  <div>
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Plus className="w-5 h-5 text-teal-600" />
                      Initialize New Research Project
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Register a new scientific project ledger into the
                      laboratory cluster.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Project Name *
                      </label>
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
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Project Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PRJ-CRISPR-01"
                        value={projCode}
                        onChange={(e) => setProjCode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Scope & Objective
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe targets, vector sequences, or formulations."
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </label>
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
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Banner Theme
                      </label>
                      <select
                        value={projBanner}
                        onChange={(e) => setProjBanner(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                      >
                        {banners.map((b, i) => (
                          <option key={i} value={b.url}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Milestones (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Design vectors, Transfection run, Sequence validation"
                      value={projMilestones}
                      onChange={(e) => setProjMilestones(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                    />
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
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all focus-ring cursor-pointer"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        itemName={deleteTarget?.name}
        itemSub={deleteTarget?.code}
        isDeleting={isDeleting}
      />
    </div>
  );
}
