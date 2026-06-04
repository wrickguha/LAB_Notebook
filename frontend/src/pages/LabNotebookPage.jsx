import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderPlus,
  FileText,
  Plus,
  Eye,
  Edit3,
  Check,
  Lock,
  ChevronRight,
  ChevronDown,
  Paperclip,
  Bookmark,
  History,
  FileSpreadsheet,
  Trash2,
  LockKeyhole,
  CheckCircle2,
  FileDown
} from 'lucide-react';

export default function LabNotebookPage() {
  const {
    notebookFolders,
    addNotebookFolder,
    notebookEntries,
    addNotebookEntry,
    updateNotebookEntryContent,
    approveNotebookEntry,
    projects
  } = useApp();

  const [activeFolderId, setActiveFolderId] = useState(notebookFolders[0]?.id || 'folder-1');
  const [activeEntryId, setActiveEntryId] = useState(notebookEntries[0]?.id || 'note-1');
  const [showCabinet, setShowCabinet] = useState(true);
  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [newFolderName, setNewFolderName] = useState('');
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  // Reference and Attachment temporary forms
  const [newDoi, setNewDoi] = useState('');
  const [newCitation, setNewCitation] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('');

  // Selected note detail
  const activeEntry = notebookEntries.find(entry => entry.id === activeEntryId);

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName) return;
    addNotebookFolder(newFolderName);
    setNewFolderName('');
    setFolderModalOpen(false);
  };

  const handleCreateLog = () => {
    const newId = addNotebookEntry({
      folderId: activeFolderId,
      projectId: projects[0]?.id || '',
      title: 'Untilted Experiment Entry',
      status: 'Draft',
      content: `### Objective\nDescribe the biological or chemical objective...\n\n### Procedure\n1. Step 1\n2. Step 2\n\n### Observations\nRecord live data readouts...`,
    });
    setActiveEntryId(newId);
    setEditorMode('edit');
    setShowCabinet(false);
  };

  // Simple Markdown & TeX Parser for Preview Mode
  const parseMarkdown = (text) => {
    if (!text) return '';
    let parsed = text;

    // Convert Headings
    parsed = parsed.replace(/^### (.*$)/gim, '<h4 class="font-extrabold text-slate-800 text-sm mt-4 mb-2">$1</h4>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h3 class="font-black text-slate-900 text-base mt-5 mb-2">$1</h3>');
    parsed = parsed.replace(/^# (.*$)/gim, '<h2 class="font-black text-slate-950 text-lg mt-6 mb-3">$1</h2>');

    // Bold
    parsed = parsed.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');

    // LaTeX inline equations
    parsed = parsed.replace(/\$([^$]+)\$/g, '<code class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono text-[10px]">$1</code>');

    // Lists
    parsed = parsed.replace(/^\s*\-\s*\[x\]\s*(.*$)/gim, '<li class="flex items-center gap-2 text-slate-400 line-through my-1"><input type="checkbox" checked disabled class="rounded" /> $1</li>');
    parsed = parsed.replace(/^\s*\-\s*\[\/\]\s*(.*$)/gim, '<li class="flex items-center gap-2 text-blue-600 my-1"><input type="checkbox" disabled class="rounded" /> $1</li>');
    parsed = parsed.replace(/^\s*\-\s*\[\s*\]\s*(.*$)/gim, '<li class="flex items-center gap-2 text-slate-700 my-1"><input type="checkbox" disabled class="rounded" /> $1</li>');
    parsed = parsed.replace(/^\s*\-\s*(.*$)/gim, '<li class="list-disc ml-5 my-1 text-slate-700">$1</li>');
    parsed = parsed.replace(/^\d+\.\s*(.*$)/gim, '<li class="list-decimal ml-5 my-1 text-slate-700">$1</li>');

    // Code blocks
    parsed = parsed.replace(/\`\`\`([\s\S]*?)\`\`\`/gm, '<pre class="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[10px] my-3 whitespace-pre-wrap">$1</pre>');

    // Paragraphs
    parsed = parsed.split('\n\n').map(p => {
      if (p.trim().startsWith('<h') || p.trim().startsWith('<l') || p.trim().startsWith('<p') || p.trim().startsWith('<u')) {
        return p;
      }
      return `<p class="text-xs text-slate-600 leading-relaxed my-2">${p}</p>`;
    }).join('\n');

    return parsed;
  };

  const currentFolderEntries = notebookEntries.filter(entry => entry.folderId === activeFolderId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-10rem)]">
      
      {/* LEFT SIDEBAR: Folder Trees & Entry Navigation */}
      <div className={`lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4 ${
        showCabinet ? 'flex' : 'hidden lg:flex'
      }`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-xs">Research Cabinets</span>
            <button
              onClick={() => setFolderModalOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              title="Add New Folder"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {/* Folder List */}
          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
            {notebookFolders.map(folder => {
              const isActive = activeFolderId === folder.id;
              const count = notebookEntries.filter(e => e.folderId === folder.id).length;
              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    setActiveFolderId(folder.id);
                    // Automatically select first note in folder if exists
                    const fNotes = notebookEntries.filter(e => e.folderId === folder.id);
                    if (fNotes.length > 0) {
                      setActiveEntryId(fNotes[0].id);
                      setShowCabinet(false);
                    } else {
                      setShowCabinet(true);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-650' : 'text-slate-550 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`w-4 h-4 ${isActive ? 'text-blue-650' : 'text-slate-400'}`} />
                    <span>{folder.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-blue-150' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notebook Entries List */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logs inside folder</span>
              <button
                onClick={handleCreateLog}
                className="inline-flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-[10px] font-bold text-blue-650 px-2.5 py-1 transition-all"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Log
              </button>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar">
              {currentFolderEntries.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-[11px]">This folder is empty. Create a log.</div>
              ) : (
                currentFolderEntries.map(entry => {
                  const isActive = activeEntryId === entry.id;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => {
                        setActiveEntryId(entry.id);
                        setShowCabinet(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                        isActive
                          ? 'bg-white border-blue-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-slate-700 text-xs truncate flex-1">{entry.title}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                          entry.status === 'Approved' ? 'bg-emerald-50 text-emerald-650' : 'bg-blue-50 text-blue-650'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                        <span>{entry.author.split(' ')[1]}</span>
                        <span>{entry.date}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
          Select or add folders to sort biological vectors from polymer trials.
        </div>
      </div>

      {/* RIGHT WORKSPACE: Notebook Editor / Preview Canvas */}
      <div className={`lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px] ${
        showCabinet ? 'hidden lg:flex' : 'flex'
      }`}>
        {activeEntry ? (
          <>
            {/* Work Header Panel */}
            <div className="border-b border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
              {/* Back Button for mobile */}
              <button
                onClick={() => setShowCabinet(true)}
                className="lg:hidden inline-flex items-center gap-1 text-[11px] font-bold text-blue-650 hover:underline mb-1"
              >
                ← Back to Research Cabinets
              </button>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    disabled={activeEntry.status === 'Approved'}
                    value={activeEntry.title}
                    onChange={(e) => {
                      // Custom local title mutation
                      activeEntry.title = e.target.value;
                      updateNotebookEntryContent(activeEntry.id, activeEntry.content);
                    }}
                    className={`w-full text-base sm:text-lg font-black text-slate-900 bg-transparent border-b border-transparent focus:border-blue-400 py-0.5 ${
                      activeEntry.status === 'Approved' ? 'cursor-not-allowed' : ''
                    }`}
                  />
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-450 font-semibold">
                    <span>Logged by: {activeEntry.author}</span>
                    <span>•</span>
                    <span>Date: {activeEntry.date}</span>
                  </div>
                </div>

                {/* Signing compliance actions */}
                <div>
                  {activeEntry.status === 'Approved' ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm">
                      <LockKeyhole className="w-3.5 h-3.5" /> Compliant Signed Log
                    </span>
                  ) : (
                    <button
                      onClick={() => approveNotebookEntry(activeEntry.id)}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white px-4 py-2 shadow shadow-emerald-650/15 active:scale-[0.98] transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Sign & Lock Document
                    </button>
                  )}
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex justify-between items-center border-t border-slate-200/80 pt-3 text-xs">
                {/* Editor/Preview Mode toggle */}
                <div className="inline-flex items-center bg-slate-200/70 p-1 rounded-xl">
                  <button
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      editorMode === 'edit' ? 'bg-white text-blue-650 shadow' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Mode
                  </button>
                  <button
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      editorMode === 'preview' ? 'bg-white text-blue-650 shadow' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Formatted Preview
                  </button>
                </div>

                {/* PDF Pack download */}
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" /> Export PDF
                </button>
              </div>
            </div>

            {/* Markdown Text Area */}
            <div className="flex-1 p-5 min-h-[250px] flex flex-col">
              {editorMode === 'edit' ? (
                <textarea
                  disabled={activeEntry.status === 'Approved'}
                  value={activeEntry.content}
                  onChange={(e) => updateNotebookEntryContent(activeEntry.id, e.target.value)}
                  placeholder="Draft your experimental process in markdown. Supports TeX math (e.g. $C_1 V_1 = C_2 V_2$)."
                  className="w-full flex-1 resize-none bg-transparent border-0 text-slate-800 text-xs leading-relaxed focus:ring-0 min-h-[300px]"
                />
              ) : (
                <div
                  className="flex-1 text-xs leading-relaxed text-slate-800 space-y-4"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(activeEntry.content) }}
                />
              )}
            </div>

            {/* Dynamic Interactive Tables */}
            {activeEntry.tables && activeEntry.tables.length > 0 && (
              <div className="border-t border-slate-100 p-5 space-y-3 bg-slate-50/20">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Embedded Readout Tables
                </span>
                {activeEntry.tables.map((t, tIdx) => (
                  <div key={tIdx} className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 text-[9px] uppercase tracking-wider">
                          {t.headers.map((h, i) => <th key={i} className="p-3">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {t.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-150 last:border-0 hover:bg-slate-50/50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 text-slate-700 font-semibold">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* Citations & File Attachments Footer */}
            <div className="border-t border-slate-150 p-5 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Attachments Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" /> Linked Attachments
                </span>
                
                <div className="space-y-2">
                  {activeEntry.attachments.length === 0 ? (
                    <p className="text-[10px] text-slate-400">No linked raw datasets.</p>
                  ) : (
                    activeEntry.attachments.map((file, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-200 shadow-xs text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[180px]">{file.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{file.size}</span>
                      </div>
                    ))
                  )}

                  {/* Add Attachment Mock Input */}
                  {activeEntry.status !== 'Approved' && (
                    <div className="flex gap-2 items-center pt-2">
                      <input
                        type="text"
                        placeholder="File_name.csv"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] flex-1"
                      />
                      <button
                        onClick={() => {
                          if (!newFileName) return;
                          activeEntry.attachments.push({ name: newFileName, size: '1.2 MB', type: 'CSV' });
                          setNewFileName('');
                          updateNotebookEntryContent(activeEntry.id, activeEntry.content);
                        }}
                        className="px-2.5 py-1.5 bg-blue-50 text-blue-650 border border-blue-150 hover:bg-blue-100 rounded-lg font-bold text-[10px]"
                      >
                        Attach
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic References Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" /> Reference Citations
                </span>

                <div className="space-y-2">
                  {activeEntry.references.length === 0 ? (
                    <p className="text-[10px] text-slate-400">No linked PubMed references.</p>
                  ) : (
                    activeEntry.references.map((ref, i) => (
                      <div key={i} className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs text-[10px] leading-relaxed">
                        <p className="font-medium text-slate-700 truncate">{ref.citation}</p>
                        <span className="text-blue-650 font-bold block mt-1">DOI: {ref.doi}</span>
                      </div>
                    ))
                  )}

                  {/* Add reference DOI mock input */}
                  {activeEntry.status !== 'Approved' && (
                    <div className="flex gap-2 items-center pt-2">
                      <input
                        type="text"
                        placeholder="DOI e.g. 10.1021/..."
                        value={newDoi}
                        onChange={(e) => setNewDoi(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] flex-1"
                      />
                      <button
                        onClick={() => {
                          if (!newDoi) return;
                          activeEntry.references.push({
                            citation: 'Custom scientific citation linked from database.',
                            doi: newDoi
                          });
                          setNewDoi('');
                          updateNotebookEntryContent(activeEntry.id, activeEntry.content);
                        }}
                        className="px-2.5 py-1.5 bg-blue-50 text-blue-650 border border-blue-150 hover:bg-blue-100 rounded-lg font-bold text-[10px]"
                      >
                        Cite
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Version History Footer Panel */}
            <div className="border-t border-slate-150 p-4 bg-slate-100/40 text-xs">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                <History className="w-3.5 h-3.5 text-slate-450" /> Version Ledger logs
              </span>
              <div className="flex flex-wrap gap-4 max-h-16 overflow-y-auto no-scrollbar">
                {activeEntry.versionHistory.map((hist, i) => (
                  <div key={i} className="flex gap-1.5 items-center text-[10px] text-slate-455">
                    <span className="font-bold text-blue-600 bg-blue-50 border border-blue-150 rounded px-1">{hist.version}</span>
                    <span>({hist.user.split(' ')[1]} at {hist.timestamp})</span>
                    <span className="italic text-slate-400">"{hist.comment}"</span>
                  </div>
                ))}
              </div>
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-400 space-y-3">
            {/* Back Button for mobile */}
            <button
              onClick={() => setShowCabinet(true)}
              className="lg:hidden inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mb-4"
            >
              ← Back to Research Cabinets
            </button>
            <FileText className="w-10 h-10 text-slate-300" />
            <p className="text-xs">No active experiment log selected. Create a draft or pick from the cabinet.</p>
          </div>
        )}
      </div>

      {/* Add Folder Modal */}
      <AnimatePresence>
        {folderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFolderModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl relative w-full max-w-sm p-5 z-10 text-xs"
            >
              <h3 className="font-bold text-slate-900 text-sm mb-4">Create Research Cabinet</h3>
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cabinet Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRISPR Amplification"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFolderModalOpen(false)}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow"
                  >
                    Create
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
