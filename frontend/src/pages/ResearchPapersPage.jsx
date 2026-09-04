import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  X,
  ExternalLink,
  BookMarked,
  Link2,
  CalendarDays,
  FileText
} from 'lucide-react';

export default function ResearchPapersPage() {
  const { researchPapers, addResearchPaper } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Simplified form states: Title, DOI (primary), Year, Summary
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [doi, setDoi] = useState('');
  const [summary, setSummary] = useState('');
  const [doiError, setDoiError] = useState('');

  const handleAddPaper = (e) => {
    e.preventDefault();
    setDoiError('');

    if (!title.trim()) return;
    if (!doi.trim()) {
      setDoiError('A DOI link is required to index this paper.');
      return;
    }

    addResearchPaper({
      title: title.trim(),
      year,
      // Normalise: strip full https://doi.org/ prefix if user pasted the URL
      doi: doi.trim().replace(/^https?:\/\/doi\.org\//i, ''),
      summary: summary.trim(),
      authors: '',
      journal: '',
      tags: [],
    });

    setTitle('');
    setYear(new Date().getFullYear().toString());
    setDoi('');
    setSummary('');
    setDoiError('');
    setModalOpen(false);
  };

  const getDoiUrl = (raw) => {
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://doi.org/${raw}`;
  };

  const filteredPapers = (researchPapers || []).filter(paper =>
    (paper.title   || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
    (paper.doi     || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
    (paper.summary || '').toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Search and Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search papers by title or DOI..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl py-1.5 pl-9 pr-4 text-xs font-semibold text-slate-700 transition-all focus-ring"
          />
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-2.5 shadow hover:shadow-md active:scale-[0.98] transition-all focus-ring cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Paper
        </button>
      </div>

      {/* Empty state */}
      {filteredPapers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300" />
          <p className="text-sm font-bold text-slate-500">No papers indexed yet</p>
          <p className="text-xs text-slate-400 max-w-xs">
            Click <span className="font-bold text-blue-600">Add Paper</span> and paste a DOI to log a reference publication.
          </p>
        </div>
      )}

      {/* Paper cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPapers.map((paper) => {
          const doiUrl = getDoiUrl(paper.doi);
          return (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md rounded-2xl p-5 shadow-sm flex flex-col gap-3 transition-all duration-200"
            >
              {/* Title */}
              <div className="flex justify-between items-start gap-3">
                <h3 className="font-extrabold text-slate-800 text-sm leading-snug flex-1">{paper.title}</h3>
                <BookMarked className="w-5 h-5 text-blue-400/70 flex-shrink-0 mt-0.5" />
              </div>

              {/* Year */}
              {paper.year && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  {paper.year}
                </div>
              )}

              {/* Summary */}
              {(paper.summary || paper.abstract) && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
                  {paper.summary || paper.abstract}
                </p>
              )}

              {/* DOI + View Publisher */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-[10px] text-slate-450 font-mono truncate max-w-[170px]" title={paper.doi}>
                    {paper.doi || 'No DOI'}
                  </span>
                </div>

                {doiUrl ? (
                  <a
                    href={doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-sm transition-all active:scale-[0.97] flex-shrink-0"
                  >
                    View Publisher <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-350 italic">No DOI set</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Paper Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl relative w-full max-w-md p-6 z-10"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Log Reference Publication</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 focus-ring rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPaper} className="space-y-4 text-xs">

                {/* Paper Title */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Paper Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRISPR-Cas9 Editing in Mammalians"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-400 rounded-xl p-2.5 text-xs text-slate-800 transition-colors focus-ring"
                  />
                </div>

                {/* DOI — primary field */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    DOI Link <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10.1038/nprot.2013  or  https://doi.org/..."
                      value={doi}
                      onChange={(e) => { setDoi(e.target.value); setDoiError(''); }}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 font-mono transition-colors focus-ring"
                    />
                  </div>
                  {doiError && (
                    <p className="text-[10px] text-red-500 font-semibold">{doiError}</p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Paste a DOI code or full URL. "View Publisher" will open the publisher page directly.
                  </p>
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publication Year</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      min="1900"
                      max="2099"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 transition-colors focus-ring"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Brief Abstract / Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a condensed summary of research conclusions and methodologies."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-400 rounded-xl p-2.5 text-xs text-slate-800 resize-none transition-colors focus-ring"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs focus-ring cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow text-xs focus-ring cursor-pointer transition-colors"
                  >
                    Index Paper
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

