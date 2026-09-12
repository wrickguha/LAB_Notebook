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
  const { projects } = useApp();
  const [timeRange, setTimeRange] = useState('Quarter'); // Month | Quarter | Year
  const [selectedProject, setSelectedProject] = useState('All');

  // Chart Data: Lab Workload Hours spent (Weekly)
  const workloadWeekly = [
    { week: 'Wk 1', CRISPR: 45, Polymers: 24, Diagnostic: 12 },
    { week: 'Wk 2', CRISPR: 50, Polymers: 30, Diagnostic: 18 },
    { week: 'Wk 3', CRISPR: 62, Polymers: 28, Diagnostic: 22 },
    { week: 'Wk 4', CRISPR: 55, Polymers: 35, Diagnostic: 15 },
    { week: 'Wk 5', CRISPR: 70, Polymers: 42, Diagnostic: 30 },
    { week: 'Wk 6', CRISPR: 68, Polymers: 45, Diagnostic: 28 },
  ];

  // Chart Data: Resource Usage (Centrifuge/HPLC hours)
  const resourceAllocation = [
    { name: 'Ultracentrifuge X-80', Hours: 142, Cost: 2400 },
    { name: 'HPLC Mass Spec', Hours: 98, Cost: 4800 },
    { name: 'Confocal Microscope', Hours: 110, Cost: 5500 },
    { name: 'Biosafety Cabinet B2', Hours: 180, Cost: 1200 },
    { name: 'PCR Thermal Cycler', Hours: 220, Cost: 1100 }
  ];

  // Chart Data: Publication Pipelines stages count
  const pipelineStats = [
    { name: 'CRISPR Gene Edit', Drafts: 3, Reviews: 1, Signed: 2 },
    { name: 'Scaffold Hydrogels', Drafts: 1, Reviews: 2, Signed: 1 },
    { name: 'PCR Assay Panel', Drafts: 4, Reviews: 0, Signed: 0 },
    { name: 'Microglial Clearing', Drafts: 0, Reviews: 0, Signed: 4 }
  ];

  const totalBenchHours = workloadWeekly.reduce((acc, row) => acc + row.CRISPR + row.Polymers + row.Diagnostic, 0);

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
              Real-time resource utilization, scientific workload allocation, and publication velocity across all active research programs.
            </p>
          </div>

          {/* Time range & Project filters */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Range Toggle */}
            <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/10 backdrop-blur-md">
              {['Month', 'Quarter', 'Year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === range
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {range === 'Month' ? '30 Days' : range === 'Quarter' ? 'Quarter' : 'Annual'}
                </button>
              ))}
            </div>

            {/* Project Filter */}
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
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Bench Hours</div>
            <div className="text-2xl font-black text-slate-900 font-mono">{totalBenchHours} hrs</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.8% vs previous period
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Equipment Utilization</div>
            <div className="text-2xl font-black text-slate-900 font-mono">91.4%</div>
            <div className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Peak operational band
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Part 11 Integrity</div>
            <div className="text-2xl font-black text-slate-900 font-mono">100%</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Cryptographically verified
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Publication Pipelines</div>
            <div className="text-2xl font-black text-slate-900 font-mono">13 Protocols</div>
            <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> 7 digital signatures
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
                Weekly R&D Bench Allocations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated weekly log hours spent across core laboratory lines ({timeRange})
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> CRISPR
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Polymers
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Diagnostic
              </span>
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
                  dataKey="CRISPR"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCRISPR)"
                />
                <Area
                  type="monotone"
                  dataKey="Polymers"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPolymers)"
                />
                <Area
                  type="monotone"
                  dataKey="Diagnostic"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDiagnostic)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Allocation Costs (Bar Chart) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              Equipment Usage Hours
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reservation booking hours across shared instrumentation
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
                <Bar dataKey="Hours" radius={[0, 6, 6, 0]}>
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
            <span>Billing cycle: Monthly</span>
            <span className="font-mono font-bold text-teal-600">Calibration Current</span>
          </div>
        </div>
      </div>

      {/* Stacked Pipeline Stages Chart */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Publication & Report Regulatory Stages
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of experiment logs per research project (Drafts, Reviews, and Part 11 Certified Signatures)
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Drafts
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> In Review
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Signed & Certified
            </span>
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
