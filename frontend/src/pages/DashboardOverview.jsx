import React from 'react';
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
  Legend
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

  // Active Projects (excl Completed)
  const activeProjectsList = projects.filter(p => p.status !== 'Completed');
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;

  // Chart Data: Research Productivity (mock hours spent over the last 7 days)
  const productivityData = [
    { day: 'Mon', 'Lab Hours': 8, 'Data Entries': 3 },
    { day: 'Tue', 'Lab Hours': 12, 'Data Entries': 7 },
    { day: 'Wed', 'Lab Hours': 10, 'Data Entries': 5 },
    { day: 'Thu', 'Lab Hours': 14, 'Data Entries': 9 },
    { day: 'Fri', 'Lab Hours': 9, 'Data Entries': 4 },
    { day: 'Sat', 'Lab Hours': 4, 'Data Entries': 2 },
    { day: 'Sun', 'Lab Hours': 2, 'Data Entries': 1 },
  ];

  // Chart Data: Project Workload Allocation
  const allocationData = projects.map(p => ({
    name: p.code,
    Progress: p.progress,
    Milestones: p.milestones.length,
  }));

  // Quick Calendar schedule items
  const calendarItems = [
    { date: 'June 5', event: 'Transfection plate review', time: '10:00 AM', lab: 'Genomics Lab' },
    { date: 'June 6', event: 'Tensile stress trial runs', time: '02:30 PM', lab: 'Materials Room' },
    { date: 'June 8', event: 'Project Artemis Peer review', time: '11:00 AM', lab: 'Conference Room B' },
    { date: 'June 9', event: 'Safety Board Audit check', time: '09:00 AM', lab: 'HQ Biotech' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h2 className="text-xl font-bold text-slate-900">Welcome Back, Dr. Thorne</h2>
          <p className="text-xs text-slate-500 mt-1">Your laboratory clusters are running securely. Compliant with FDA 21 CFR Part 11 signature logs.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('notebook')}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-2.5 shadow transition-all active:scale-[0.98]"
          >
            New Notebook Log
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-4 py-2.5 transition-all"
          >
            Manage Projects
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-sm flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Projects</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{activeProjectsList.length}</div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-bold">✓ {completedProjectsCount} completed</span>
              this semester
            </div>
          </div>
          <div className="bg-blue-50 text-blue-650 p-2.5 rounded-xl">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-sm flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Notebook Logs</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{notebookEntries.length}</div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[8px] font-extrabold">
                {notebookEntries.filter(n => n.status === 'In Review').length} In Review
              </span>
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-650 p-2.5 rounded-xl">
            <Beaker className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-sm flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Shared Nodes</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{sharedResources.length}</div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-blue-600 font-bold">✓ Global permissions</span>
              secured
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-650 p-2.5 rounded-xl">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-sm flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Audit Status</span>
            <div className="text-sm font-black text-slate-800 mt-2 bg-emerald-50 border border-emerald-150 text-emerald-700 px-2 py-0.5 rounded-full inline-flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              SOC 2 + Part 11 Compliant
            </div>
            <div className="text-[9px] text-slate-400 mt-2">Continuous signature tracking</div>
          </div>
          <div className="bg-purple-50 text-purple-650 p-2.5 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Recharts Performance Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Productivity Area Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Weekly Research Activity</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Tracking investigator bench hours vs digital notebook submissions</p>
            </div>
            <span className="text-[10px] bg-slate-50 border border-slate-150 rounded px-2.5 py-1 font-semibold text-slate-655">Last 7 Days</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px', border: 'none' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Lab Hours" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                <Area type="monotone" dataKey="Data Entries" stroke="#60A5FA" strokeWidth={2} fillOpacity={1} fill="url(#colorEntries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project progress allocation bar chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Project Progress Indexes</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Target completion percentages vs total milestones</p>
          </div>

          <div className="h-48 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData} margin={{ left: -30, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '10px', border: 'none' }} />
                <Bar dataKey="Progress" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Active project metrics sync automatically. To edit, visit the <button onClick={() => setActiveTab('projects')} className="text-blue-650 font-bold hover:underline">Projects page</button>.
          </div>
        </div>

      </div>

      {/* Grid: Calendar, Audit Trail, Team activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar View */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-blue-600" /> Research Calendar
            </h3>
            <span className="text-[10px] text-blue-600 font-bold">4 Scheduled Runs</span>
          </div>

          <div className="space-y-3">
            {calendarItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div>
                  <h4 className="font-bold text-slate-700 text-xs">{item.event}</h4>
                  <p className="text-[10px] text-slate-450 mt-0.5">{item.lab}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded block">{item.date}</span>
                  <span className="text-[9px] text-slate-450 mt-1 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Trail */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Compliance Audit Trail
            </h3>
            <button onClick={() => setActiveTab('settings')} className="text-[10px] text-blue-600 font-bold flex items-center hover:underline">
              Full Logs <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-xs">
                <span className="mt-0.5 text-slate-400">⚡</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-700 truncate">{log.action}</div>
                  <div className="text-[10px] text-slate-450 truncate mt-0.5">{log.target}</div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                    <span>{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Equipment & Resources Activity */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-650" /> Lab Resource Bookings
            </h3>
            <button onClick={() => setActiveTab('resources')} className="text-[10px] text-blue-600 font-bold flex items-center hover:underline">
              Manage Shares <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sharedResources.map((res) => (
              <div key={res.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-slate-700 truncate">{res.name}</div>
                  <div className="text-[10px] text-slate-450 mt-0.5">{res.type} — Owner: {res.owner.split(' ')[1] || res.owner}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  res.permission === 'Owner' ? 'bg-blue-100 text-blue-750' : 
                  res.permission === 'Editor' ? 'bg-emerald-50 text-emerald-650' : 'bg-slate-200/70 text-slate-600'
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
