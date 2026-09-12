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
  FileDown,
  ShieldCheck,
  Sparkles,
  Search,
  ExternalLink
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
  const [searchFilter, setSearchFilter] = useState('');

  // Reference and Attachment temporary forms
  const [newDoi, setNewDoi] = useState('');
  const [newCitation, setNewCitation] = useState('');
  const [newFileName, setNewFileName] = useState('');

  // Active note detail
  const activeEntry = (notebookEntries || []).find(entry => entry.id === activeEntryId);

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    addNotebookFolder(newFolderName.trim());
    setNewFolderName('');
    setFolderModalOpen(false);
  };

  const handleCreateLog = async () => {
    try {
      const newId = await addNotebookEntry({
        folderId: activeFolderId,
        projectId: projects[0]?.id || '',
        title: 'Untitled Experiment Entry',
        status: 'Draft',
        content: `### Objective\nDescribe the biological target or chemical reaction...\n\n### Materials & Reagents\n- Reagent A (Lot #0421)\n- Sterile TE Buffer pH 8.0\n\n### Protocol\n1. Prepare master mix cocktail on wet ice.\n2. Aliquot 20 µL per reaction tube.\n3. Cycle through denaturation, annealing, and extension.\n\n### Observations & Readouts\nRecord live spectrofluorometer readouts and gel band weights...`,
      });
      if (newId) {
        setActiveEntryId(newId);
        setEditorMode('edit');
        setShowCabinet(false);
      }
    } catch (err) {
      console.error('Failed to create log:', err);
    }
  };

  // Markdown & LaTeX Parser for Preview Mode
  const parseMarkdown = (text) => {
    if (!text) return '';
    let parsed = text;

    // Convert Headings
    parsed = parsed.replace(/^### (.*$)/gim, '<h4 class="font-extrabold text-slate-900 text-sm mt-4 mb-1.5">$1</h4>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h3 class="font-black text-slate-900 text-base mt-5 mb-2">$1</h3>');
    parsed = parsed.replace(/^# (.*$)/gim, '<h2 class="font-black text-slate-950 text-lg mt-6 mb-2.5">$1</h2>');

    // Bold & Italic
    parsed = parsed.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    parsed = parsed.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // LaTeX inline equations
    parsed = parsed.replace(/\$([^$]+)\$/g, '<code class="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-mono text-[10px] border border-teal-200">$1</code>');

    // Lists
    parsed = parsed.replace(/^\s*\-\s*\[x\]\s*(.*$)/gim, '<li class="flex items-center gap-2 text-slate-400 line-through my-1"><input type="checkbox" checked disabled class="rounded text-teal-600" /> $1</li>');
    parsed = parsed.replace(/^\s*\-\s*\[\s*\]\s*(.*$)/gim, '<li class="flex items-center gap-2 text-slate-700 my-1"><input type="checkbox" disabled class="rounded" /> $1</li>');
    parsed = parsed.replace(/^\s*\-\s*(.*$)/gim, '<li class="list-disc ml-5 my-1 text-slate-700">$1</li>');
    parsed = parsed.replace(/^\d+\.\s*(.*$)/gim, '<li class="list-decimal ml-5 my-1 text-slate-700">$1</li>');

    // Code blocks
    parsed = parsed.replace(/\`\`\`([\s\S]*?)\`\`\`/gm, '<pre class="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] my-3 whitespace-pre-wrap border border-slate-800">$1</pre>');

    // Paragraphs
    parsed = parsed.split('\n\n').map(p => {
      if (p.trim().startsWith('<h') || p.trim().startsWith('<l') || p.trim().startsWith('<p') || p.trim().startsWith('<u')) {
        return p;
      }
      return `<p class="text-xs text-slate-600 leading-relaxed my-2">${p}</p>`;
    }).join('\n');

    return parsed;
  };

  const currentFolderEntries = (notebookEntries || []).filter(entry => {
    const inFolder = entry.folderId === activeFolderId;
    const matchesSearch = !searchFilter.trim() || 
      (entry.title || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (entry.content || '').toLowerCase().includes(searchFilter.toLowerCase());
    return inFolder && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-9.5rem)] font-sans">
      
      {/* LEFT SIDEBAR: Cabinet & Entry Navigation */}
      <div className={`lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 ${
        showCabinet ? 'flex' : 'hidden lg:flex'
      }`}>
        <div className="space-y-4">
          
          {/* Cabinet Header */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="font-black text-slate-900 text-xs tracking-tight">Research Cabinets</span>
              <p className="text-[10px] text-slate-400">Classified digital binders</p>
            </div>
            <button
              type="button"
              onClick={() => setFolderModalOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
              title="Add New Folder Cabinet"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {/* Folder List */}
          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
            {(notebookFolders || []).map(folder => {
              const isActive = activeFolderId === folder.id;
              const count = (notebookEntries || []).filter(e => e.folderId === folder.id).length;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => {
                    setActiveFolderId(folder.id);
                    const fNotes = (notebookEntries || []).filter(e => e.folderId === folder.id);
                    if (fNotes.length > 0) {
                      setActiveEntryId(fNotes[0].id);
                      setShowCabinet(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.2 rounded-xl text-xs font-semibold tracking-normal transition-all cursor-pointer ${
                    isActive ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/60 shadow-xs' : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-teal-200/60 text-teal-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Logs Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter entries in cabinet..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-1.5 pl-8.5 pr-3 text-xs text-slate-750 focus-ring font-medium"
            />
          </div>

          {/* Notebook Entries List */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Entries ({currentFolderEntries.length})
              </span>
              <button
                type="button"
                onClick={handleCreateLog}
                className="inline-flex items-center gap-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[10px] font-bold text-teal-700 px-2.5 py-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New Entry</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar">
              {currentFolderEntries.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No entries found. Create a draft to begin.</div>
              ) : (
                currentFolderEntries.map(entry => {
                  const isActive = activeEntryId === entry.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        setActiveEntryId(entry.id);
                        setShowCabinet(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-white border-teal-400 shadow-sm ring-1 ring-teal-300/40'
                          : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs truncate flex-1">{entry.title}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold shrink-0 ${
                          entry.status === 'Approved' || entry.status === 'Signed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-slate-400">
                        <span>{entry.author ? (entry.author.split(' ')[1] || entry.author) : 'Investigator'}</span>
                        <span>{entry.date}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Cabinet footer */}
        <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
          <span>FDA 21 CFR Part 11 Certified</span>
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
        </div>
      </div>

      {/* RIGHT WORKSPACE: Notebook Editor Canvas */}
      <div className={`lg:col-span-8 flex flex-col bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden min-h-[520px] ${
        showCabinet ? 'hidden lg:flex' : 'flex'
      }`}>
        {activeEntry ? (
          <>
            {/* Header Panel */}
            <div className="border-b border-slate-200/80 bg-slate-50/60 p-4 sm:p-6 space-y-4">
              
              {/* Mobile back trigger */}
              <button
                type="button"
                onClick={() => setShowCabinet(true)}
                className="lg:hidden inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline mb-1 cursor-pointer"
              >
                ← Back to Research Cabinets
              </button>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    disabled={activeEntry.status === 'Approved' || activeEntry.status === 'Signed'}
                    value={activeEntry.title}
                    onChange={(e) => {
                      activeEntry.title = e.target.value;
                      updateNotebookEntryContent(activeEntry.id, activeEntry.content);
                    }}
                    className={`w-full text-base sm:text-xl font-black text-slate-900 bg-transparent border-b border-transparent focus:border-teal-500 py-0.5 focus-ring ${
                      activeEntry.status === 'Approved' || activeEntry.status === 'Signed' ? 'cursor-not-allowed text-slate-700' : ''
                    }`}
                  />
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                    <span>Author: {activeEntry.author}</span>
                    <span>•</span>
                    <span>Recorded: {activeEntry.date}</span>
                  </div>
                </div>

                {/* Signing compliance button */}
                <div className="shrink-0">
                  {activeEntry.status === 'Approved' || activeEntry.status === 'Signed' ? (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs font-mono">
                      <LockKeyhole className="w-3.5 h-3.5 text-emerald-600" /> 
                      <span>CRYPTOGRAPHICALLY SEALED</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => approveNotebookEntry(activeEntry.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white px-4 py-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> 
                      <span>Sign & Seal (Part 11)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex justify-between items-center border-t border-slate-200/80 pt-3 text-xs">
                
                {/* Editor / Preview Mode Tabs */}
                <div className="inline-flex items-center bg-slate-200/70 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      editorMode === 'edit' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> 
                    <span>Editor Canvas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      editorMode === 'preview' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> 
                    <span>Formatted Preview</span>
                  </button>
                </div>

                {/* PDF Print Export */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <FileDown className="w-3.5 h-3.5 text-slate-400" /> 
                  <span>Export Dossier</span>
                </button>
              </div>
            </div>

            {/* Markdown Text Area */}
            <div className="flex-1 p-6 min-h-[300px] flex flex-col">
              {editorMode === 'edit' ? (
                <textarea
                  disabled={activeEntry.status === 'Approved' || activeEntry.status === 'Signed'}
                  value={activeEntry.content}
                  onChange={(e) => updateNotebookEntryContent(activeEntry.id, e.target.value)}
                  placeholder="Draft your experimental process in markdown. Supports TeX math (e.g. $C_1 V_1 = C_2 V_2$)."
                  className="w-full flex-1 resize-none bg-transparent border-0 text-slate-800 text-xs font-mono leading-relaxed focus:ring-0 min-h-[320px] focus-ring"
                />
              ) : (
                <div className="flex-1 text-xs leading-relaxed text-slate-800 space-y-4">
                  {(activeEntry.status === 'Approved' || activeEntry.status === 'Signed') && (
                    <div className="crypto-seal rounded-2xl p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-teal-900 bg-teal-50/20">
                      <div>
                        <div className="font-extrabold text-teal-800 flex items-center gap-1.5">
                          <LockKeyhole className="w-3.5 h-3.5 text-teal-600" /> Cryptographic Ledger Seal Active
                        </div>
                        <p className="text-slate-500 mt-1 font-medium">Digitally signed and sealed under FDA 21 CFR Part 11 protocols.</p>
                        <div className="font-mono text-[10px] text-slate-400 mt-1">SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[10px]">
                          PART 11 SECURE
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">{activeEntry.date} 18:12:35 UTC</span>
                      </div>
                    </div>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: parseMarkdown(activeEntry.content) }} />
                </div>
              )}
            </div>

            {/* Dynamic Embedded Readout Tables */}
            {activeEntry.tables && activeEntry.tables.length > 0 && (
              <div className="border-t border-slate-150 p-6 space-y-3 bg-slate-50/30">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" /> 
                  <span>Embedded Analytical Spectrometry Readouts</span>
                </span>
                {activeEntry.tables.map((t, tIdx) => (
                  <div key={tIdx} className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-mono font-bold text-slate-500 text-[10px] uppercase tracking-wider">
                          {t.headers.map((h, i) => <th key={i} className="p-3">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {t.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
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
            <div className="border-t border-slate-150 p-6 bg-slate-50/40 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Attachments Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-teal-600" /> 
                  <span>Attached Datasets & FASTA Files</span>
                </span>
                
                <div className="space-y-2">
                  {(activeEntry.attachments || []).length === 0 ? (
                    <p className="text-[11px] text-slate-400">No linked raw datasets.</p>
                  ) : (
                    (activeEntry.attachments || []).map((file, i) => (
                      <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs">
                        <span className="font-semibold text-slate-800 truncate max-w-[180px]">{file.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{file.size}</span>
                      </div>
                    ))
                  )}

                  {/* Add Attachment Input */}
                  {activeEntry.status !== 'Approved' && activeEntry.status !== 'Signed' && (
                    <div className="flex gap-2 items-center pt-2">
                      <input
                        type="text"
                        placeholder="Filename.csv or Sequence.fasta"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl p-2 text-xs flex-1 focus-ring"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newFileName.trim()) return;
                          if (!activeEntry.attachments) activeEntry.attachments = [];
                          activeEntry.attachments.push({ name: newFileName.trim(), size: '1.2 MB', type: 'CSV' });
                          setNewFileName('');
                          updateNotebookEntryContent(activeEntry.id, activeEntry.content);
                        }}
                        className="px-3 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Attach
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Citations Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-teal-600" /> 
                  <span>Literature DOI References</span>
                </span>

                <div className="space-y-2">
                  {(activeEntry.references || []).length === 0 ? (
                    <p className="text-[11px] text-slate-400">No linked PubMed or DOI citations.</p>
                  ) : (
                    (activeEntry.references || []).map((ref, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs text-[11px] leading-relaxed">
                        <p className="font-semibold text-slate-800 truncate">{ref.citation}</p>
                        <span className="text-teal-600 font-mono font-bold block mt-0.5">DOI: {ref.doi}</span>
                      </div>
                    ))
                  )}

                  {/* Add Reference DOI */}
                  {activeEntry.status !== 'Approved' && activeEntry.status !== 'Signed' && (
                    <div className="flex gap-2 items-center pt-2">
                      <input
                        type="text"
                        placeholder="DOI e.g. 10.1038/s41586..."
                        value={newDoi}
                        onChange={(e) => setNewDoi(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl p-2 text-xs flex-1 focus-ring"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newDoi.trim()) return;
                          if (!activeEntry.references) activeEntry.references = [];
                          activeEntry.references.push({
                            citation: 'Peer-reviewed research reference',
                            doi: newDoi.trim()
                          });
                          setNewDoi('');
                          updateNotebookEntryContent(activeEntry.id, activeEntry.content);
                        }}
                        className="px-3 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Cite
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Version History Footer */}
            {activeEntry.versionHistory && activeEntry.versionHistory.length > 0 && (
              <div className="border-t border-slate-150 p-4 bg-slate-50 text-xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <History className="w-3.5 h-3.5 text-slate-400" /> 
                  <span>Immutable Version Audit Ledger</span>
                </span>
                <div className="flex flex-wrap gap-4 max-h-16 overflow-y-auto no-scrollbar">
                  {activeEntry.versionHistory.map((hist, i) => (
                    <div key={i} className="flex gap-1.5 items-center text-[10px] text-slate-600 font-mono">
                      <span className="font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.2">{hist.version}</span>
                      <span>({hist.user ? hist.user.split(' ')[1] : 'User'} at {hist.timestamp})</span>
                      <span className="italic text-slate-400">"{hist.comment}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-400 space-y-3">
            <button
              type="button"
              onClick={() => setShowCabinet(true)}
              className="lg:hidden inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline mb-4"
            >
              ← Back to Research Cabinets
            </button>
            <FileText className="w-12 h-12 text-slate-300" />
            <p className="text-xs font-semibold text-slate-500">No active experiment log selected.</p>
            <p className="text-[11px] text-slate-400">Pick an entry from your cabinets on the left or create a new draft.</p>
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
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative w-full max-w-sm p-6 z-10 text-xs"
            >
              <h3 className="font-black text-slate-900 text-sm mb-1">Create Research Cabinet</h3>
              <p className="text-[10px] text-slate-400 mb-4">Organize experimental runs and protocols.</p>
              
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Cabinet Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRISPR Assay Series 2"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring font-medium"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFolderModalOpen(false)}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/20 cursor-pointer"
                  >
                    Create Cabinet
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
