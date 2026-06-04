import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  SlidersHorizontal
} from 'lucide-react';

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

  return (
    <div className="space-y-6">
      
      {/* Filters Header Banner */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">Analytical Filters</h2>
        </div>
        <div className="flex gap-3 text-xs w-full sm:w-auto">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-655"
          >
            <option value="Month">Last 30 Days</option>
            <option value="Quarter">Last Quarter</option>
            <option value="Year">Full Calendar Year</option>
          </select>
          {/* Project filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-655"
          >
            <option value="All">All Research Branches</option>
            {projects.map(p => (
              <option key={p.id} value={p.code}>{p.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Workload allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workload hours (Area Chart) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Weekly R&D Bench Allocations</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Aggregated weekly log hours spent across core laboratory lines</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workloadWeekly} margin={{ left: -20, right: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px', border: 'none' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="CRISPR" stroke="#2563EB" strokeWidth={2} fillOpacity={0.05} fill="#2563EB" />
                <Area type="monotone" dataKey="Polymers" stroke="#60A5FA" strokeWidth={2} fillOpacity={0.05} fill="#60A5FA" />
                <Area type="monotone" dataKey="Diagnostic" stroke="#818CF8" strokeWidth={2} fillOpacity={0.05} fill="#818CF8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Allocation Costs (Bar Chart) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-850 text-sm">Equipment Usage Statistics</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Total reservation booking hours vs calculated maintenance allocations</p>
          </div>

          <div className="h-56 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceAllocation} layout="vertical" margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#64748B' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 8, fill: '#64748B' }} width={80} />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '10px', border: 'none' }} />
                <Bar dataKey="Hours" fill="#60A5FA" radius={[0, 4, 4, 0]}>
                  {resourceAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2563EB' : '#60A5FA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Usage quotas reset at start of month. Standard hourly maintenance overhead is loaded from ERP configurations.
          </div>
        </div>

      </div>

      {/* Stacked pipeline chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Publication & Report Pipelines</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Breakdown of experiment logs stages per project (Drafts, Reviews, and Approved Signatures)</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineStats} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '10px', border: 'none' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Drafts" stackId="a" fill="#E2E8F0" />
              <Bar dataKey="Reviews" stackId="a" fill="#60A5FA" />
              <Bar dataKey="Signed" stackId="a" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
