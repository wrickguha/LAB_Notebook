import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
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
  Cell
} from 'recharts';
import {
  Beaker,
  Layers,
  Users,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  FileText,
  AlertCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function DashboardOverview({ setActiveTab }) {
  const { projects, notebookEntries, sharedResources, auditLogs } = useApp();
  const [loading, setLoading] = useState(true);

  // Simulate loading state on mount to show skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const activeProjectsList = projects.filter(p => p.status !== 'Completed');
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;

  const productivityData = [
    { day: 'Mon', 'Lab Hours': 8, 'Data Entries': 3 },
    { day: 'Tue', 'Lab Hours': 12, 'Data Entries': 7 },
    { day: 'Wed', 'Lab Hours': 10, 'Data Entries': 5 },
    { day: 'Thu', 'Lab Hours': 14, 'Data Entries': 9 },
    { day: 'Fri', 'Lab Hours': 9, 'Data Entries': 4 },
    { day: 'Sat', 'Lab Hours': 4, 'Data Entries': 2 },
    { day: 'Sun', 'Lab Hours': 2, 'Data Entries': 1 },
  ];

  const allocationData = projects.map(p => ({
    name: p.code,
    Progress: p.progress,
    Milestones: p.milestones.length,
  }));

  const calendarItems = [
    { date: 'June 5', event: 'Transfection plate review', time: '10:00 AM', lab: 'Genomics Lab' },
    { date: 'June 6', event: 'Tensile stress trial runs', time: '02:30 PM', lab: 'Materials Room' },
    { date: 'June 8', event: 'Project Artemis Peer review', time: '11:00 AM', lab: 'Conference Room B' },
    { date: 'June 9', event: 'Safety Board Audit check', time: '09:00 AM', lab: 'HQ Biotech' }
  ];

  // Custom tooltips matching Stripe/Vercel styling
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 text-white rounded-xl p-3 shadow-xl text-xs space-y-1">
          <p className="font-extrabold text-[10px] text-slate-450 uppercase tracking-widest">{label}</p>
          {payload.map((pld, index) => (
            <p key={index} className="flex justify-between gap-6 font-semibold" style={{ color: pld.color }}>
              <span>{pld.name}:</span>
              <span className="font-black text-white">{pld.value}</span>
            </p>
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-28 flex flex-col justify-between">
          <div className="shimmer-skeleton h-5 w-1/3 rounded" />
          <div className="shimmer-skeleton h-3 w-1/2 rounded" />
        </div>

        {/* KPI Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl h-24 flex justify-between">
              <div className="space-y-3 w-2/3">
                <div className="shimmer-skeleton h-3 w-1/2 rounded" />
                <div className="shimmer-skeleton h-5 w-2/3 rounded" />
              </div>
              <div className="shimmer-skeleton h-10 w-10 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 h-80 flex flex-col justify-between">
            <div className="shimmer-skeleton h-4 w-1/4 rounded" />
            <div className="shimmer-skeleton h-52 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 h-80 flex flex-col justify-between">
            <div className="shimmer-skeleton h-4 w-1/3 rounded" />
            <div className="shimmer-skeleton h-52 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Welcome Back, Dr. Thorne</h2>
          <p className="text-[11px] text-slate-500 mt-1">Your laboratory clusters are running securely. Compliant with FDA 21 CFR Part 11 signature logs.</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => setActiveTab('notebook')}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-2.5 shadow active:scale-[0.98] transition-all focus-ring"
          >
            New Notebook Log
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-4 py-2.5 transition-all focus-ring"
          >
            Manage Projects
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Projects</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{activeProjectsList.length}</div>
            <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">✓ {completedProjectsCount} completed</span>
              this semester
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl border border-blue-100">
            <Layers className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Notebook Logs</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{notebookEntries.length}</div>
            <div className="text-[10px] text-slate-505 mt-1.5 flex items-center gap-1">
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[8px] font-extrabold">
                {notebookEntries.filter(n => n.status === 'In Review').length} In Review
              </span>
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl border border-indigo-100">
            <Beaker className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Shared Nodes</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{sharedResources.length}</div>
            <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="text-blue-600 font-bold">✓ Global permissions</span>
              secured
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100">
            <Users className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Audit Status</span>
            <div className="text-[10px] font-black text-emerald-700 mt-2.5 bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-full inline-flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              SOC 2 + Part 11 Compliant
            </div>
          </div>
          <div className="bg-purple-50 text-purple-650 p-2.5 rounded-xl border border-purple-100">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Area Chart: Productivity */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-xs">Weekly Laboratory Output</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Tracking investigator bench hours vs digital notebook submissions</p>
            </div>
            <span className="text-[9px] bg-slate-50 border border-slate-200 rounded px-2.5 py-1 font-bold text-slate-500 uppercase tracking-wider">7 Days</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="entriesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Area type="monotone" name="Lab Hours" dataKey="Lab Hours" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#hoursGrad)" />
                <Area type="monotone" name="Data Entries" dataKey="Data Entries" stroke="#60A5FA" strokeWidth={2} fillOpacity={1} fill="url(#entriesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Progress */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-xs">Project Completion Status</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Completion indexes vs active milestones</p>
          </div>

          <div className="h-44 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData} margin={{ left: -30, right: 10 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar name="Progress %" dataKey="Progress" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Active project metrics sync automatically. Visit the <button onClick={() => setActiveTab('projects')} className="text-blue-600 font-bold hover:underline focus-ring">Projects page</button> to edit.
          </div>
        </div>

      </div>

      {/* Grid: Calendar, Audit Trail, Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-blue-600" /> Research Calendar
            </h3>
            <span className="text-[9px] font-black text-blue-650 bg-blue-50 px-2 py-0.5 rounded">4 Scheduled Runs</span>
          </div>

          <div className="space-y-3.5">
            {calendarItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-slate-100 last:border-0 pb-3.5 last:pb-0">
                <div>
                  <h4 className="font-bold text-slate-700 text-xs">{item.event}</h4>
                  <p className="text-[10px] text-slate-450 mt-0.5">{item.lab}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded block">{item.date}</span>
                  <span className="text-[8px] text-slate-400 mt-1 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Audit Log */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Compliance Audit Trail
            </h3>
            <button onClick={() => setActiveTab('settings')} className="text-[9px] text-blue-600 font-bold flex items-center hover:underline focus-ring">
              Full Logs <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-xs text-slate-650">
                <span className="mt-0.5 text-slate-400">⚡</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-750 truncate">{log.action}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{log.target}</div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1 font-semibold">
                    <span>{log.user.split(' ')[1]}</span>
                    <span>{log.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-650" /> Resource Bookings
            </h3>
            <button onClick={() => setActiveTab('resources')} className="text-[9px] text-blue-600 font-bold flex items-center hover:underline focus-ring">
              Manage Shares <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sharedResources.map((res) => (
              <div key={res.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-slate-700 truncate">{res.name}</div>
                  <div className="text-[10px] text-slate-450 mt-0.5">Owner: {res.owner.split(' ')[1]}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border ${
                  res.permission === 'Owner' ? 'bg-blue-50 text-blue-650 border-blue-150' : 
                  res.permission === 'Editor' ? 'bg-emerald-50 text-emerald-650 border-emerald-150' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
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
