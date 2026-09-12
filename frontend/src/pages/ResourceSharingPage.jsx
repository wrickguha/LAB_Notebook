import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Plus,
  Users,
  Lock,
  Globe,
  Settings,
  X,
  FileText,
  FolderOpen,
  Monitor,
  Search,
  Grid,
  List,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Filter,
  UserPlus,
  ArrowUpRight,
  Sparkles,
  Database,
  Cpu
} from 'lucide-react';

export default function ResourceSharingPage() {
  const { sharedResources, addSharedResource, updateResourcePermission } = useApp();
  
  // UI State
  const [modalOpen, setModalOpen] = useState(false);
  const [quickAddUserModal, setQuickAddUserModal] = useState(null); // resource id
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'Folder' | 'File' | 'Equipment' | 'Protocol'
  const [copiedId, setCopiedId] = useState(null);

  // New Resource Form State
  const [resName, setResName] = useState('');
  const [resType, setResType] = useState('Folder');
  const [resPermission, setResPermission] = useState('Editor');
  const [collaboratorName, setCollaboratorName] = useState('');

  // Quick Add Collaborator State
  const [newCollabName, setNewCollabName] = useState('');
  const [newCollabRole, setNewCollabRole] = useState('Editor');

  const resourceTypes = [
    { id: 'Folder', label: 'Folder', icon: FolderOpen, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { id: 'File', label: 'File / Dataset', icon: FileText, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { id: 'Equipment Log', label: 'Equipment Log', icon: Cpu, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { id: 'Protocol', label: 'Protocol SOP', icon: Database, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  ];

  // Filtered resources
  const filteredResources = useMemo(() => {
    return (sharedResources || []).filter((res) => {
      const matchesSearch = 
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (res.sharedWith || []).some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = 
        selectedType === 'All' ? true :
        selectedType === 'Folder' ? res.type === 'Folder' :
        selectedType === 'File' ? (res.type === 'File' || res.type?.includes('File')) :
        selectedType === 'Equipment' ? (res.type === 'Equipment Log' || res.type?.includes('Equipment')) :
        res.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [sharedResources, searchTerm, selectedType]);

  // Quick stats calculation
  const totalAssets = (sharedResources || []).length;
  const uniqueCollaboratorsCount = useMemo(() => {
    const set = new Set();
    (sharedResources || []).forEach(res => {
      (res.sharedWith || []).forEach(collab => {
        const name = collab.split(' (')[0].trim();
        if (name) set.add(name);
      });
    });
    return set.size;
  }, [sharedResources]);

  const handleShareResource = (e) => {
    e.preventDefault();
    if (!resName.trim() || !collaboratorName.trim()) return;

    addSharedResource({
      name: resName.trim(),
      type: resType,
      permission: 'Owner',
      sharedWith: [`${collaboratorName.trim()} (${resPermission})`],
    });

    setResName('');
    setCollaboratorName('');
    setResPermission('Editor');
    setModalOpen(false);
  };

  const handleQuickAddCollaborator = (e) => {
    e.preventDefault();
    if (!quickAddUserModal || !newCollabName.trim()) return;

    const resource = (sharedResources || []).find(r => r.id === quickAddUserModal);
    if (resource) {
      updateResourcePermission(resource.id, newCollabName.trim(), newCollabRole);
    }

    setNewCollabName('');
    setNewCollabRole('Editor');
    setQuickAddUserModal(null);
  };

  const handleCopyLink = (resId) => {
    const fakeLink = `${window.location.origin}/dashboard?resource=${resId}`;
    navigator.clipboard?.writeText(fakeLink);
    setCopiedId(resId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Folder':
        return {
          icon: FolderOpen,
          bg: 'bg-teal-50 text-teal-700 border-teal-200/80',
        };
      case 'File':
        return {
          icon: FileText,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        };
      case 'Equipment Log':
        return {
          icon: Cpu,
          bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
        };
      default:
        return {
          icon: Database,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        };
    }
  };

  const getPermissionBadge = (role) => {
    switch (role) {
      case 'Owner':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Editor':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Commenter':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up font-sans">
      
      {/* Top Banner: Metrics & Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              ROLE-BASED ACCESS CONTROL (RBAC)
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Laboratory Resource Sharing Hub
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Securely delegate access permissions for research cabinets, sequencing datasets, and equipment logs with FDA 21 CFR Part 11 signature traceability.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">Shared Assets</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{totalAssets}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">Active Peers</span>
              <span className="text-xl sm:text-2xl font-black text-teal-400 font-mono">{uniqueCollaboratorsCount}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">Security Tier</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 block mt-1 font-mono">Part 11 Compliant</span>
            </div>
          </div>

        </div>
      </div>

      {/* Control Bar: Filters, Search & Actions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          
          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shared resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 transition-colors focus-ring"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter Pills */}
          <div className="inline-flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 overflow-x-auto no-scrollbar">
            {['All', 'Folder', 'File', 'Equipment'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-ring whitespace-nowrap cursor-pointer ${
                  selectedType === type
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type === 'All' ? 'All Assets' : type === 'Equipment' ? 'Equipment' : `${type}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Right: View Mode & Share CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          
          {/* View Toggle */}
          <div className="inline-flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all focus-ring cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all focus-ring cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Audit Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white px-4 py-2.5 shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all focus-ring cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Share Resource</span>
          </button>
        </div>

      </div>

      {/* Main Resource Content */}
      {filteredResources.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Share2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Shared Resources Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {searchTerm || selectedType !== 'All'
              ? 'No items match your active search and filter criteria. Try clearing filters.'
              : 'Grant permissions to collaborators for experimental protocols, sequencing files, or equipment logs.'}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700 focus-ring cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Resource</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const badge = getTypeBadge(res.type);
            const IconComponent = badge.icon;

            return (
              <div
                key={res.id}
                className="bg-white border border-slate-200/80 hover:border-teal-500/40 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Card Header: Type Badge & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border ${badge.bg}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                      {res.type}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(res.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                      title="Copy Share Link"
                    >
                      {copiedId === res.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Resource Name & Node ID */}
                  <div className="mt-3.5 space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-teal-700 transition-colors">
                      {res.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span>Node #{res.id}</span>
                      <span>•</span>
                      <span>Owner: <strong className="text-slate-700">{res.owner}</strong></span>
                    </div>
                  </div>

                  {/* Collaborators Access Matrix */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      <span>Collaborators ({res.sharedWith?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() => setQuickAddUserModal(res.id)}
                        className="text-teal-600 hover:text-teal-700 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Add Peer</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                      {(res.sharedWith || []).map((collab, idx) => {
                        const name = collab.split(' (')[0].trim();
                        const role = collab.split(' (')[1]?.replace(')', '') || 'Viewer';

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-150 hover:bg-slate-100/70 transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px] font-extrabold shrink-0">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-800 text-[11px] truncate">{name}</span>
                            </div>

                            <select
                              value={role}
                              onChange={(e) => updateResourcePermission(res.id, name, e.target.value)}
                              className={`text-[10px] font-bold font-mono rounded-lg px-2 py-0.5 border cursor-pointer focus-ring ${getPermissionBadge(role)}`}
                            >
                              <option value="Owner">Owner</option>
                              <option value="Editor">Editor</option>
                              <option value="Commenter">Commenter</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    Encrypted
                  </span>
                  <span>Modified {res.lastModified}</span>
                </div>
              </div>
            );
          })}
        </div>

      ) : (

        /* DETAILED TABLE VIEW */
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-500 uppercase tracking-widest text-[9px] font-mono">
                <th className="p-4 pl-6">Resource Node</th>
                <th className="p-4 w-36">Type</th>
                <th className="p-4 w-36">Owner</th>
                <th className="p-4">Collaborators with Access (Modify Role)</th>
                <th className="p-4 w-32 text-right pr-6">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res) => {
                const badge = getTypeBadge(res.type);
                const IconComponent = badge.icon;

                return (
                  <tr key={res.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${badge.bg}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{res.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Node ID: {res.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${badge.bg}`}>
                        {res.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-bold">{res.owner}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2 items-center">
                        {(res.sharedWith || []).map((collab, i) => {
                          const name = collab.split(' (')[0].trim();
                          const role = collab.split(' (')[1]?.replace(')', '') || 'Viewer';

                          return (
                            <div key={i} className="inline-flex items-center gap-1.5 p-1 px-2 rounded-xl bg-slate-50 border border-slate-200">
                              <span className="text-[10px] font-semibold text-slate-800">{name}</span>
                              <select
                                value={role}
                                onChange={(e) => updateResourcePermission(res.id, name, e.target.value)}
                                className={`text-[9px] font-bold font-mono rounded px-1.5 py-0.2 border cursor-pointer ${getPermissionBadge(role)}`}
                              >
                                <option value="Owner">Owner</option>
                                <option value="Editor">Editor</option>
                                <option value="Commenter">Commenter</option>
                                <option value="Viewer">Viewer</option>
                              </select>
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setQuickAddUserModal(res.id)}
                          className="text-[10px] text-teal-600 font-bold hover:underline ml-1 cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right pr-6 font-mono text-slate-400 text-[11px]">{res.lastModified}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SHARE RESOURCE MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative w-full max-w-md p-6 sm:p-8 z-10 text-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-6">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-teal-600" />
                    Share Laboratory Resource
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Authorize collaborators to access experiments and logs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleShareResource} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Resource Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HEK293T Excision Protocol"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Resource Type</label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                    >
                      <option value="Folder">Folder Cabinet</option>
                      <option value="File">Dataset File</option>
                      <option value="Equipment Log">Equipment Log</option>
                      <option value="Protocol">Protocol SOP</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Initial Role</label>
                    <select
                      value={resPermission}
                      onChange={(e) => setResPermission(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                    >
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                      <option value="Commenter">Commenter</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Collaborator Name or Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Goodall or j.goodall@lab.org"
                    value={collaboratorName}
                    onChange={(e) => setCollaboratorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus-ring"
                  />
                </div>

                <div className="pt-4 border-t border-slate-150 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl focus-ring cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all focus-ring cursor-pointer"
                  >
                    Grant Access
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK ADD COLLABORATOR MODAL */}
      <AnimatePresence>
        {quickAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddUserModal(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative w-full max-w-sm p-6 z-10 text-xs"
            >
              <h3 className="font-black text-slate-900 text-sm mb-1 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-600" />
                Add Collaborator
              </h3>
              <p className="text-[10px] text-slate-400 mb-4">Grant access to node #{quickAddUserModal}</p>

              <form onSubmit={handleQuickAddCollaborator} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Collaborator Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Thorne"
                    value={newCollabName}
                    onChange={(e) => setNewCollabName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Access Level</label>
                  <select
                    value={newCollabRole}
                    onChange={(e) => setNewCollabRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus-ring cursor-pointer"
                  >
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Commenter">Commenter</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickAddUserModal(null)}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/20 cursor-pointer"
                  >
                    Authorize Peer
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
