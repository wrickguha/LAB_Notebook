import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Clock,
  BookOpen,
  Users,
  Settings,
  RefreshCw,
  SlidersHorizontal,
  Activity,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

// Custom dark glassmorphic tooltip for Recharts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-3.5 py-2.5 shadow-2xl text-white text-xs">
        <div className="font-mono font-bold text-slate-300 text-[11px] mb-1.5 border-b border-slate-800 pb-1">
          {label}
        </div>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value} {typeof entry.value === 'number' && entry.name.toLowerCase().includes('hour') ? 'hrs' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const { projects = [], notebookEntries = [], sharedResources = [], researchPapers = [] } = useApp();
  const [selectedProject, setSelectedProject] = useState('All');

  const selectedProjectId = selectedProject === 'All'
    ? null
    : projects.find((project) => project.code === selectedProject)?.id;
  const filteredEntries = notebookEntries.filter((entry) =>
    !selectedProjectId || String(entry.projectId) === String(selectedProjectId)
  );
  const filteredProjects = projects.filter((project) =>
    !selectedProjectId || String(project.id) === String(selectedProjectId)
  );
  const signedEntries = filteredEntries.filter((entry) => ['Signed', 'Approved'].includes(entry.status));
  const verifiedSignatures = signedEntries.filter((entry) => entry.signatureValid === true).length;

  const workloadWeekly = Array.from({ length: 6 }, (_, index) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - ((5 - index) * 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const entryCount = filteredEntries.filter((entry) => {
      if (!entry.date) return false;
      const entryDate = new Date(`${entry.date}T00:00:00`);
      return entryDate >= start && entryDate < end;
    }).length;
    const projectUpdates = filteredProjects.filter((project) => {
      if (!project.lastActivity) return false;
      const updatedAt = new Date(project.lastActivity);
      return updatedAt >= start && updatedAt < end;
    }).length;

    return {
      week: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Entries: entryCount,
      'Projects Updated': projectUpdates,
    };
  });

  const resourceAllocation = Object.entries(sharedResources.reduce((counts, resource) => {
    const type = resource.type || 'Other';
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {})).map(([name, Assets]) => ({ name, Assets }));

  const pipelineStats = filteredProjects.map((project) => {
    const projectEntries = filteredEntries.filter((entry) => String(entry.projectId) === String(project.id));
    return {
      name: project.code,
      Drafts: projectEntries.filter((entry) => entry.status === 'Draft').length,
      Reviews: projectEntries.filter((entry) => entry.status === 'In Review').length,
      Signed: projectEntries.filter((entry) => ['Signed', 'Approved'].includes(entry.status)).length,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              OPERATIONAL INTELLIGENCE & TELEMETRY
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Laboratory Analytics & Metrics
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Notebook activity, project changes, shared resources, and signed-entry fingerprints for your account.
            </p>
          </div>

          {/* Project filter */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 text-white hover:border-teal-500/60 rounded-xl px-3 py-2 text-xs font-semibold backdrop-blur-md transition-all focus-ring cursor-pointer"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.code}>
                  {p.code} - {p.name?.slice(0, 20)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notebook Entries</div>
            <div className="text-2xl font-black text-slate-900 font-mono">{filteredEntries.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> User-scoped records
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Shared Resources</div>
            <div className="text-2xl font-black text-slate-900 font-mono">{sharedResources.length}</div>
            <div className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" /> Owned by your account
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Signed Entries</div>
            <div className="text-2xl font-black text-slate-900 font-mono">{signedEntries.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> {verifiedSignatures} fingerprints match
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Research Papers</div>
            <div className="text-2xl font-black text-slate-900 font-mono">{researchPapers.length}</div>
            <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Indexed references
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Workload allocation & Equipment stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workload hours (Area Chart) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Weekly Research Activity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Notebook entries and project updates over the last six weeks
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Entries</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Projects updated</span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workloadWeekly} margin={{ left: -20, right: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCRISPR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPolymers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDiagnostic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Entries"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCRISPR)"
                />
                <Area
                  type="monotone"
                Notebook entries and project updates over the last six weeks
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPolymers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shared Resource Counts */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              Shared Resources by Type
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current resources owned by your account
            </p>
          </div>

          <div className="h-56 my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceAllocation} layout="vertical" margin={{ left: -10, right: 15 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 9, fill: '#475569', fontWeight: 600 }}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Assets" radius={[0, 6, 6, 0]}>
                  {resourceAllocation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#0D9488' : index === 1 ? '#0EA5E9' : '#14B8A6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
            <span>{sharedResources.length} total resources</span>
            <span className="font-mono font-bold text-teal-600">Live account data</span>
          </div>
        </div>
      </div>

      {/* Stacked Pipeline Stages Chart */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Notebook Entry Status by Project
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Counts of saved notebook entries linked to each project
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Drafts
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> In Review
            </span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Signed</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineStats} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Drafts" stackId="a" fill="#CBD5E1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Reviews" stackId="a" fill="#06B6D4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Signed" stackId="a" fill="#0D9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
