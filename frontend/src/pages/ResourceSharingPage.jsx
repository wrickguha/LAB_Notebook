import React, { useState } from 'react';
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
  Monitor
} from 'lucide-react';

export default function ResourceSharingPage() {
  const { sharedResources, addSharedResource, updateResourcePermission } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  // Sharing Form State
  const [resName, setResName] = useState('');
  const [resType, setResType] = useState('Folder'); // Folder | File | Equipment Log
  const [resPermission, setResPermission] = useState('Editor');
  const [collaboratorName, setCollaboratorName] = useState('');

  const handleShareResource = (e) => {
    e.preventDefault();
    if (!resName || !collaboratorName) return;

    addSharedResource({
      name: resName,
      type: resType,
      permission: 'Owner',
      sharedWith: [`${collaboratorName} (${resPermission})`],
    });

    setResName('');
    setCollaboratorName('');
    setModalOpen(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Folder': return <FolderOpen className="w-4 h-4 text-blue-650" />;
      case 'File': return <FileText className="w-4 h-4 text-indigo-650" />;
      default: return <Monitor className="w-4 h-4 text-purple-650" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page description banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Laboratory Access Permissions</h2>
          <p className="text-[10px] text-slate-450 mt-0.5">Configure role-based access control (RBAC) rules for shared folders, files, and centrifuge equipment.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-2.5 shadow hover:shadow-md transition-all active:scale-[0.98] focus-ring cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Share Resource
        </button>
      </div>

      {/* Shared Resource Inventory */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto w-full no-scrollbar">
        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-500 uppercase tracking-widest text-[9px]">
              <th className="p-4">Resource Node</th>
              <th className="p-4 w-32">Type</th>
              <th className="p-4 w-32">Owner</th>
              <th className="p-4">Collaborators with Access (Modify Role)</th>
              <th className="p-4 w-40 text-right">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {sharedResources.map((res) => (
              <tr key={res.id} className="border-b border-slate-150 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    {getTypeIcon(res.type)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{res.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Node ID: {res.id}</div>
                  </div>
                </td>
                <td className="p-4 text-slate-500 font-semibold">{res.type}</td>
                <td className="p-4 font-bold text-slate-700">{res.owner}</td>
                <td className="p-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {res.sharedWith.map((collab, i) => {
                      const name = collab.split(' (')[0];
                      const role = collab.split(' (')[1]?.replace(')', '') || 'Viewer';
                      return (
                        <div key={i} className="bg-slate-100/80 border border-slate-200 rounded-xl px-2.5 py-1 flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{name}</span>
                          <select
                            value={role}
                            onChange={(e) => updateResourcePermission(res.id, name, e.target.value)}
                            className="bg-white border border-slate-200 text-[10px] rounded p-0.5 font-bold text-blue-650 cursor-pointer focus-ring"
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
                </td>
                <td className="p-4 text-right text-slate-400 font-medium">{res.lastModified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Share Resource Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl relative w-full max-w-sm p-6 z-10 text-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Configure Sharing Access</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-655 focus-ring rounded-lg cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleShareResource} className="space-y-4 text-slate-750">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Resource Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRISPR Vectors DNA Sequence"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Resource Type</label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    >
                      <option value="Folder">Folder</option>
                      <option value="File">File</option>
                      <option value="Equipment Log">Equipment Log</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Access Level</label>
                    <select
                      value={resPermission}
                      onChange={(e) => setResPermission(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    >
                      <option value="Editor">Editor</option>
                      <option value="Commenter">Commenter</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Collaborator Email / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={collaboratorName}
                    onChange={(e) => setCollaboratorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-lg focus-ring cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow hover:shadow-md focus-ring cursor-pointer"
                  >
                    Grant Access
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
