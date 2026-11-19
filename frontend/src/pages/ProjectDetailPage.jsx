import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  NotebookPen,
  FlaskConical,
  FolderOpen,
  Users,
  LayoutDashboard,
  Plus,
  Search,
  MoreHorizontal,
  Upload,
  UserPlus,
  X,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  CheckSquare,
  Dna,
} from "lucide-react";
import { resolveImageUrl } from "../utils/imageUrl";
import { useApp } from "../context/AppContext";
import ShareModal from "../components/ShareModal";

// ─── helpers ────────────────────────────────────────────────────────────────

const statusDot = {
  Active: "bg-teal-500",
  Planning: "bg-sky-500",
  Completed: "bg-purple-500",
  "On Hold": "bg-amber-500",
};

const statusPill = {
  Active: "bg-teal-50 text-teal-800 border-teal-200",
  Planning: "bg-sky-50 text-sky-800 border-sky-200",
  Completed: "bg-purple-50 text-purple-800 border-purple-200",
  "On Hold": "bg-amber-50 text-amber-800 border-amber-200",
};

function InfoRow({ label, value, children }) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="w-40 shrink-0 text-xs text-slate-400 font-medium">{label}</span>
      <span className="flex-1 text-xs text-slate-800 font-semibold">
        {children ?? value ?? <span className="text-slate-300 italic">Not set</span>}
      </span>
    </div>
  );
}

function fileIcon(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["xls", "xlsx", "csv"].includes(ext)) return { Icon: FileSpreadsheet, color: "bg-green-100 text-green-700" };
  if (["pdf"].includes(ext)) return { Icon: FileText, color: "bg-rose-100 text-rose-600" };
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return { Icon: ImageIcon, color: "bg-blue-100 text-blue-600" };
  return { Icon: File, color: "bg-slate-100 text-slate-500" };
}

// ── Tabs config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "experiments", label: "Experiments", Icon: FlaskConical },
  { id: "files", label: "Files", Icon: FolderOpen },
  { id: "team", label: "Team", Icon: Users },
];

// ─── Main component ─────────────────────────────────────────────────────────

export default function ProjectDetailPage({ project, onBack }) {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  // ── local mock/editable state (replace with real API later) ──
  const [experiments, setExperiments] = useState(
    (project.milestones || []).map((m, i) => ({
      id: m.id || `exp-${i}`,
      name: m.name,
      expId: `EXP-${String(i + 1).padStart(3, "0")}`,
      date: project.startDate
        ? new Date(new Date(project.startDate).getTime() + i * 7 * 86400000)
            .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "—",
      notes: m.completed ? "Completed successfully." : "In progress.",
      completed: m.completed,
    }))
  );

  const [files, setFiles] = useState([]);
  const [team, setTeam] = useState(() => {
    const owner = user?.name || "You";
    return [
      {
        id: "owner",
        name: owner,
        email: user?.email || "owner@lab.com",
        role: "Owner",
        status: "Active",
        initials: owner.slice(0, 2).toUpperCase(),
      },
    ];
  });

  // ── experiment state ──
  const [expSearch, setExpSearch] = useState("");
  const [expFilter, setExpFilter] = useState("All");
  const [addExpOpen, setAddExpOpen] = useState(false);
  const [newExp, setNewExp] = useState({ name: "", notes: "" });

  // ── files state ──
  const [fileSearch, setFileSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("All Types");

  // ── team / invite state ──
  const [inviteOpen, setInviteOpen] = useState(false);

  // ─── handlers ───────────────────────────────────────────────────────────────

  const handleAddExperiment = (e) => {
    e.preventDefault();
    if (!newExp.name.trim()) return;
    setExperiments((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        name: newExp.name.trim(),
        expId: `EXP-${String(prev.length + 1).padStart(3, "0")}`,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        notes: newExp.notes.trim() || "—",
        completed: false,
      },
    ]);
    setNewExp({ name: "", notes: "" });
    setAddExpOpen(false);
  };

  useEffect(() => {
    if (!addExpOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setAddExpOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [addExpOpen]);

  const handleFileUpload = (e) => {
    const fileList = Array.from(e.target.files || []);
    setFiles((prev) => [
      ...prev,
      ...fileList.map((f) => ({
        id: `file-${Date.now()}-${f.name}`,
        name: f.name,
        type: f.type || "Other",
        uploadedBy: user?.name || "You",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        size: f.size,
      })),
    ]);
  };

  const handleInviteCollaborator = (collaborator) => {
    const name = collaborator.name;
    setTeam((prev) => [
      ...prev,
      {
        id: collaborator.id,
        name,
        email: collaborator.email,
        role: collaborator.role,
        status: "Invited",
        initials: name.slice(0, 2).toUpperCase(),
      },
    ]);
  };

  const handleRemoveCollaborator = (id) => {
    setTeam((prev) => prev.filter((member) => member.id !== id || member.id === "owner"));
  };

  // ─── derived ────────────────────────────────────────────────────────────────

  const filteredExps = experiments.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(expSearch.toLowerCase());
    const matchesFilter =
      expFilter === "All" ||
      (expFilter === "Completed" && e.completed) ||
      (expFilter === "In Progress" && !e.completed);
    return matchesSearch && matchesFilter;
  });

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(fileSearch.toLowerCase());
    const matchesType =
      fileTypeFilter === "All Types" ||
      f.name.toLowerCase().endsWith(fileTypeFilter.toLowerCase()) ||
      (fileTypeFilter === "PDF" && f.name.toLowerCase().endsWith(".pdf")) ||
      (fileTypeFilter === "Image" && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f.name)) ||
      (fileTypeFilter === "Excel" && /\.(xls|xlsx|csv)$/i.test(f.name));
    return matchesSearch && matchesType;
  });

  const completedMilestones = (project.milestones || []).filter((m) => m.completed).length;
  const totalMilestones = (project.milestones || []).length;

  // ─── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-0 animate-fade-in-up font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-black text-slate-900 text-lg leading-tight truncate">
                {project.name}
              </h1>
              <span className="font-mono text-xs text-slate-400 font-bold">{project.code}</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                  statusPill[project.status] || "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    statusDot[project.status] || "bg-slate-400"
                  }`}
                />
                {project.status}
              </span>
            </div>
            {project.description && (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{project.description}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            window.open(`/lab-notebook/${project.id}`, "_blank", "noopener,noreferrer")
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          <NotebookPen className="w-4 h-4" />
          Open Notebook
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer -mb-px ${
              activeTab === id
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.14 }}
        >
          {/* ════════════ OVERVIEW ════════════ */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left: Banner + Project Info */}
              <div className="lg:col-span-3 space-y-5">
                {/* Banner */}
                <div className="h-44 relative rounded-2xl overflow-hidden bg-slate-900 shadow-sm">
                  <img
                    src={resolveImageUrl(project.banner)}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=1200";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[9px] font-mono font-bold text-white tracking-widest uppercase bg-teal-600/90 backdrop-blur px-2.5 py-1 rounded-md shadow-sm">
                    {project.code}
                  </span>
                </div>

                {/* Project Information Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                  <h3 className="font-black text-slate-900 text-sm mb-3">Project Information</h3>
                  <div className="divide-y divide-slate-100">
                    <InfoRow label="Research Area" value={project.researchArea} />
                    <InfoRow label="Objective">
                      {project.description || (
                        <span className="text-slate-300 italic">Not set</span>
                      )}
                    </InfoRow>
                    <InfoRow label="Start Date">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : <span className="text-slate-300 italic">Not set</span>}
                    </InfoRow>
                    <InfoRow label="Expected Completion">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : <span className="text-slate-300 italic">Not set</span>}
                    </InfoRow>
                    <InfoRow label="Status">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                          statusPill[project.status] || "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            statusDot[project.status] || "bg-slate-400"
                          }`}
                        />
                        {project.status}
                      </span>
                    </InfoRow>
                  </div>
                </div>
              </div>

              {/* Right: Summary + Milestones */}
              <div className="lg:col-span-2 space-y-5">
                {/* Summary Cards */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                  <h3 className="font-black text-slate-900 text-sm mb-4">Summary</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-center">
                      <FlaskConical className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                      <div className="text-lg font-black text-slate-900">{experiments.length}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        Experiments
                      </div>
                    </div>
                    <div className="rounded-xl bg-teal-50 border border-teal-100 p-3 text-center">
                      <FolderOpen className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                      <div className="text-lg font-black text-slate-900">{files.length}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        Files
                      </div>
                    </div>
                    <div className="rounded-xl bg-sky-50 border border-sky-100 p-3 text-center">
                      <Users className="w-5 h-5 text-sky-500 mx-auto mb-1" />
                      <div className="text-lg font-black text-slate-900">{team.length}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        Team
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-900 text-sm">Progress</h3>
                    <span className="text-sm font-black text-teal-700 font-mono">
                      {project.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${project.progress || 0}%` }}
                      className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                  {totalMilestones > 0 && (
                    <p className="text-[10px] text-slate-400 mt-2 font-mono">
                      {completedMilestones}/{totalMilestones} milestones completed
                    </p>
                  )}
                </div>

                {/* Project Theme */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                  <h3 className="font-black text-slate-900 text-sm mb-3">Project Theme</h3>
                  <div className="relative h-20 rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={resolveImageUrl(project.banner)}
                      alt="theme"
                      className="w-full h-full object-cover opacity-80"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent flex items-center px-3 gap-2">
                      <Dna className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-white text-xs font-bold">
                        {project.bannerName || "Scientific Theme"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestones quick view */}
                {totalMilestones > 0 && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <h3 className="font-black text-slate-900 text-sm mb-3">
                      Bench Checkpoints
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                      {(project.milestones || []).map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-2.5 text-xs"
                        >
                          <CheckSquare
                            className={`w-3.5 h-3.5 shrink-0 ${
                              m.completed ? "text-teal-600" : "text-slate-300"
                            }`}
                          />
                          <span
                            className={
                              m.completed
                                ? "text-slate-400 line-through"
                                : "text-slate-700 font-semibold"
                            }
                          >
                            {m.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════ EXPERIMENTS ════════════ */}
          {activeTab === "experiments" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search experiments..."
                    value={expSearch}
                    onChange={(e) => setExpSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-800"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={expFilter}
                    onChange={(e) => setExpFilter(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option>All</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setAddExpOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New Experiment
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-4 pl-5">Experiment Name</th>
                      <th className="p-4 w-28">ID</th>
                      <th className="p-4 w-32">Date</th>
                      <th className="p-4">Notes</th>
                      <th className="p-4 w-20 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExps.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-400 text-xs">
                          No experiments yet.{" "}
                          <button
                            type="button"
                            onClick={() => setAddExpOpen(true)}
                            className="text-teal-600 font-bold hover:underline cursor-pointer"
                          >
                            Add one
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredExps.map((exp) => (
                        <tr
                          key={exp.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="p-4 pl-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                <FlaskConical className="w-3.5 h-3.5" />
                              </div>
                              <span className={`font-bold ${exp.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
                                {exp.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-teal-700 font-bold text-[11px]">{exp.expId}</td>
                          <td className="p-4 text-slate-500 font-mono text-[11px]">{exp.date}</td>
                          <td className="p-4 text-slate-500 max-w-xs truncate">{exp.notes}</td>
                          <td className="p-4 text-right pr-5">
                            <button
                              type="button"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ════════════ FILES ════════════ */}
          {activeTab === "files" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-800"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={fileTypeFilter}
                    onChange={(e) => setFileTypeFilter(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option>All Types</option>
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>Image</option>
                  </select>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload File
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-4 pl-5">File Name</th>
                      <th className="p-4 w-24">Type</th>
                      <th className="p-4 w-28">Uploaded By</th>
                      <th className="p-4 w-28">Date</th>
                      <th className="p-4 w-20 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-400 text-xs">
                          No files uploaded yet.{" "}
                          <label className="text-teal-600 font-bold hover:underline cursor-pointer">
                            Upload one
                            <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                          </label>
                        </td>
                      </tr>
                    ) : (
                      filteredFiles.map((f) => {
                        const { Icon, color } = fileIcon(f.name);
                        const ext = f.name.split(".").pop()?.toUpperCase() || "FILE";
                        return (
                          <tr
                            key={f.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="p-4 pl-5">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-bold text-slate-800 truncate max-w-[180px]">{f.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-slate-500">{ext}</td>
                            <td className="p-4 text-slate-500">{f.uploadedBy}</td>
                            <td className="p-4 text-slate-500 font-mono text-[11px]">{f.date}</td>
                            <td className="p-4 text-right pr-5">
                              <button type="button" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ TEAM ════════════ */}
          {activeTab === "team" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Project Team</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage who can access and collaborate on this project.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              {/* Team Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-4 pl-5">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4 w-24">Role</th>
                      <th className="p-4 w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="p-4 pl-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                              {member.initials}
                            </div>
                            <span className="font-bold text-slate-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">{member.email}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-100 text-slate-600">
                            {member.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                              member.status === "Active"
                                ? "bg-teal-50 text-teal-700 border border-teal-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <ShareModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        project={project}
        title="Share Project"
        shareUrl={`${window.location.origin}/lab-notebook/${project.id}`}
        initialCollaborators={team}
        onInvite={handleInviteCollaborator}
        onRemove={handleRemoveCollaborator}
        forceDark
      />

      {createPortal(
        <AnimatePresence>
          {addExpOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 bg-slate-950/55 backdrop-blur-[3px]"
                onClick={() => setAddExpOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="new-experiment-title"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="relative z-10 my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_70px_-18px_rgba(15,23,42,0.38)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-600">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 id="new-experiment-title" className="text-base font-black tracking-tight text-slate-900">
                        New Experiment
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">Add a record to this project's experiments.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Close new experiment dialog"
                    onClick={() => setAddExpOpen(false)}
                    className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleAddExperiment}>
                  <div className="space-y-5 px-5 py-5 sm:px-6">
                    <div className="space-y-2">
                      <label htmlFor="experiment-name" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Experiment name <span className="text-teal-600">*</span>
                      </label>
                      <input
                        id="experiment-name"
                        required
                        autoFocus
                        type="text"
                        value={newExp.name}
                        onChange={(e) => setNewExp((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. sgRNA Design"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="experiment-notes" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Notes
                      </label>
                      <textarea
                        id="experiment-notes"
                        rows={4}
                        value={newExp.notes}
                        onChange={(e) => setNewExp((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="Brief description of this experiment..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm font-medium leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                      type="button"
                      onClick={() => setAddExpOpen(false)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-xs font-black text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-[0.98] cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add Experiment
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
