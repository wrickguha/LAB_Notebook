import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";
import {
  Beaker,
  Layers,
  Users,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  FileText,
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  Plus,
  Sparkles,
  TrendingUp,
  Cpu,
  Quote,
  RefreshCw,
} from "lucide-react";

export default function DashboardOverview({ setActiveTab }) {
  const {
    user,
    projects,
    notebookEntries,
    sharedResources,
    auditLogs,
    dailyQuote,
    getNewQuote,
  } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const activeProjectsList = (projects || []).filter(
    (p) => p.status !== "Completed",
  );
  const completedProjectsCount = (projects || []).filter(
    (p) => p.status === "Completed",
  ).length;
  const inReviewNotesCount = (notebookEntries || []).filter(
    (n) => n.status === "In Review",
  ).length;

  const productivityData = [
    { day: "Mon", "Lab Hours": 8.5, "Data Entries": 4 },
    { day: "Tue", "Lab Hours": 11.0, "Data Entries": 8 },
    { day: "Wed", "Lab Hours": 9.5, "Data Entries": 6 },
    { day: "Thu", "Lab Hours": 13.5, "Data Entries": 10 },
    { day: "Fri", "Lab Hours": 10.0, "Data Entries": 5 },
    { day: "Sat", "Lab Hours": 4.5, "Data Entries": 3 },
    { day: "Sun", "Lab Hours": 2.0, "Data Entries": 1 },
  ];

  const allocationData = (projects || []).map((p) => ({
    name: p.code,
    Progress: p.progress || 0,
    Milestones: (p.milestones || []).length,
  }));

  const calendarItems = [
    {
      date: "Today",
      event: "CRISPR Transfection Plate Review",
      time: "10:00 AM",
      lab: "Genomics Wing",
      tag: "High Priority",
    },
    {
      date: "Tomorrow",
      event: "Centrifuge Yield Spectrometry",
      time: "02:30 PM",
      lab: "Biochem Core",
      tag: "Scheduled",
    },
    {
      date: "Jun 18",
      event: "Project Artemis Peer Audit Check",
      time: "11:00 AM",
      lab: "Conference Room B",
      tag: "Regulatory",
    },
    {
      date: "Jun 20",
      event: "Annual FDA 21 CFR Part 11 Inspection",
      time: "09:00 AM",
      lab: "Central R&D HQ",
      tag: "Inspection",
    },
  ];

  // Custom Glassmorphic Dark Tooltip
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-800 text-white rounded-xl p-3 shadow-xl text-xs space-y-1 backdrop-blur-xl">
          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            {label}
          </p>
          {payload.map((pld, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-6 font-semibold"
              style={{ color: pld.color }}
            >
              <span className="text-slate-300">{pld.name}:</span>
              <span className="font-mono font-bold text-white">
                {pld.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Banner Skeleton */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 h-32 flex flex-col justify-between">
          <div className="shimmer-skeleton h-6 w-1/3 rounded-lg" />
          <div className="shimmer-skeleton h-4 w-1/2 rounded-md" />
        </div>

        {/* KPI Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 p-5 rounded-2xl h-28 flex justify-between"
            >
              <div className="space-y-3 w-2/3">
                <div className="shimmer-skeleton h-3 w-1/2 rounded" />
                <div className="shimmer-skeleton h-6 w-2/3 rounded-lg" />
              </div>
              <div className="shimmer-skeleton h-10 w-10 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 h-80 flex flex-col justify-between">
            <div className="shimmer-skeleton h-4 w-1/4 rounded" />
            <div className="shimmer-skeleton h-56 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 h-80 flex flex-col justify-between">
            <div className="shimmer-skeleton h-4 w-1/3 rounded" />
            <div className="shimmer-skeleton h-56 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up font-sans">
      {/* Contextual Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome back, {user?.name || "Dr. Thorne"}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your laboratory cluster is operating normally. All cryptographic
            signature verification checks passed without exceptions.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("notebook")}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white px-4 py-2.5 shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Lab Log</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-white px-4 py-2.5 backdrop-blur transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Projects Ledger</span>
          </button>
        </div>
      </div>

      {dailyQuote && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-white via-white to-teal-50/60 border border-teal-100/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* decorative giant quote mark */}
          <span className="pointer-events-none absolute -top-2 right-6 text-8xl font-serif text-teal-100/70 select-none leading-none">
            "
          </span>

          <div className="relative flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-500/30">
              <Quote className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-bold text-teal-700/90 uppercase tracking-[0.15em]">
                Motivation
              </div>

              <blockquote className="text-[15px] font-semibold text-slate-800 mt-2 leading-relaxed">
                {dailyQuote.quote}
              </blockquote>

              <div className="flex items-center justify-between mt-4">
                <p className="text-[12px] font-medium text-slate-500">
                  – {dailyQuote.author}
                </p>

                <button
                  type="button"
                  onClick={getNewQuote}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer group shrink-0"
                >
                  <RefreshCw className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180" />
                  New Quote
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Projects */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex justify-between items-start hover:border-teal-500/40 transition-colors group">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
              {activeProjectsList.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
              <span className="text-teal-700 font-bold">
                ✓ {completedProjectsCount} completed
              </span>
              this semester
            </div>
          </div>
          <div className="bg-teal-50 text-teal-600 p-2.5 rounded-xl border border-teal-150 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Notebook Logs */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex justify-between items-start hover:border-teal-500/40 transition-colors group">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Notebook Entries
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
              {(notebookEntries || []).length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[9px] font-bold">
                {inReviewNotesCount} In Review
              </span>
              <span className="text-slate-400 text-[10px]">
                Signed:{" "}
                {
                  (notebookEntries || []).filter((n) => n.status === "Signed")
                    .length
                }
              </span>
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl border border-indigo-150 group-hover:scale-105 transition-transform">
            <Beaker className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Shared Resources */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex justify-between items-start hover:border-teal-500/40 transition-colors group">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Shared Assets
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
              {(sharedResources || []).length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
              <span className="text-teal-700 font-bold">
                ✓ Multi-node access
              </span>
              calibrated
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-150 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart: Productivity */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Weekly Bench Output & Digital Logging
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tracking investigator bench hours vs digital notebook
                submissions
              </p>
            </div>
            <span className="text-[10px] font-mono bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 font-bold text-slate-600">
              LAST 7 DAYS
            </span>
          </div>

          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={productivityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                />
                <Area
                  type="monotone"
                  name="Lab Hours"
                  dataKey="Lab Hours"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tealGrad)"
                />
                <Area
                  type="monotone"
                  name="Data Entries"
                  dataKey="Data Entries"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#blueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Progress */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Project Completion Indexes
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Progress percentages against assigned milestones
            </p>
          </div>

          <div className="h-48 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData} margin={{ left: -25, right: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 9, fill: "#64748B" }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  name="Progress %"
                  dataKey="Progress"
                  fill="#0D9488"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
            <span>Real-time milestone syncing</span>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className="text-teal-600 font-bold hover:underline cursor-pointer"
            >
              View Projects →
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Lower Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Research Calendar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-teal-600" /> Research
              Calendar
            </h3>
            <span className="text-[9px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              4 Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {calendarItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start border-b border-slate-100 last:border-0 pb-3 last:pb-0 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {item.event}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.lab}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded block">
                    {item.date}
                  </span>
                  <span className="text-[8px] font-mono text-slate-400 mt-1 block">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Resource Allocations */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Resource Allocations
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab("resources")}
              className="text-[10px] text-teal-600 font-bold flex items-center hover:underline cursor-pointer"
            >
              Manage <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {(sharedResources || []).slice(0, 4).map((res) => (
              <div
                key={res.id}
                className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 truncate">
                    {res.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Owner:{" "}
                    {res.owner ? res.owner.split(" ")[1] || res.owner : "PI"}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border ${
                    res.permission === "Owner"
                      ? "bg-teal-50 text-teal-700 border-teal-200"
                      : res.permission === "Editor"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {res.permission}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
