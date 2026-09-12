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
  FileText,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export default function ResearchPapersPage() {
  const { researchPapers, addResearchPaper } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedDoi, setCopiedDoi] = useState(null);

  // Form states: Title, DOI (primary), Year, Summary
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
      setDoiError('A DOI link is required to index this publication.');
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

  const handleCopyDoi = (rawDoi) => {
    if (!rawDoi) return;
    navigator.clipboard?.writeText(rawDoi);
    setCopiedDoi(rawDoi);
    setTimeout(() => setCopiedDoi(null), 2000);
  };

  const filteredPapers = (researchPapers || []).filter(paper =>
    (paper.title   || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
    (paper.doi     || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
    (paper.summary || '').toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalIndexed = (researchPapers || []).length;
  const totalWithDoi = (researchPapers || []).filter(p => p.doi).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold tracking-wider">
              <BookMarked className="w-3.5 h-3.5 text-teal-400" />
              PEER-REVIEWED SCIENTIFIC LITERATURE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Research Papers & Publications
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Index experimental citations, catalog high-impact publications, and resolve direct publisher DOIs for automated protocol referencing.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-4 py-3 text-center min-w-[100px]">
              <div className="text-xl font-mono font-bold text-white">{totalIndexed}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Indexed</div>
            </div>
            <div className="bg-teal-500/10 border border-teal-500/20 backdrop-blur-md rounded-2xl px-4 py-3 text-center min-w-[100px]">
              <div className="text-xl font-mono font-bold text-teal-300">{totalWithDoi}</div>
              <div className="text-[10px] text-teal-400/80 uppercase font-bold tracking-wider mt-0.5">DOI Linked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Add Action */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by publication title, abstract, or DOI..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-xl py-2 pl-10 pr-9 text-xs font-semibold text-slate-800 transition-all focus-ring placeholder:text-slate-400"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 text-xs font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Showing {filteredPapers.length} of {totalIndexed}</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 active:scale-[0.98] text-xs font-bold text-white px-4 py-2.5 shadow-md shadow-teal-700/20 transition-all focus-ring cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Index Publication</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredPapers.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-slate-800">
              {filterQuery ? 'No matching publications found' : 'No research papers indexed yet'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {filterQuery
                ? `No indexed papers matched "${filterQuery}". Try clearing your search keywords.`
                : 'Build your laboratory literature repository by logging published papers with digital object identifiers (DOIs).'}
            </p>
          </div>
          {filterQuery ? (
            <button
              onClick={() => setFilterQuery('')}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
            >
              Clear Search Filter
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Index Your First Paper
            </button>
          )}
        </div>
      )}

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPapers.map((paper, idx) => {
          const doiUrl = getDoiUrl(paper.doi);
          return (
            <motion.div
              key={paper.id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group bg-white border border-slate-200 hover:border-teal-200 hover:shadow-lg rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all duration-200 relative overflow-hidden"
            >
              {/* Subtle top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-3">
                {/* Header row: badge and bookmark icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {paper.year && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                        <CalendarDays className="w-3 h-3 text-slate-400" />
                        {paper.year}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold">
                      Peer Reviewed
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors flex-shrink-0">
                    <BookMarked className="w-4 h-4" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-slate-900">
                  {paper.title}
                </h3>

                {/* Abstract / Summary */}
                {(paper.summary || paper.abstract) && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {paper.summary || paper.abstract}
                  </p>
                )}
              </div>

              {/* Bottom Footer: DOI indicator & Publisher Link */}
              <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/90 text-slate-600 max-w-[200px] sm:max-w-[240px]">
                    <Link2 className="w-3 h-3 text-teal-600 flex-shrink-0" />
                    <span className="text-[10px] font-mono truncate select-all" title={paper.doi}>
                      {paper.doi || 'No DOI assigned'}
                    </span>
                  </div>

                  {paper.doi && (
                    <button
                      type="button"
                      onClick={() => handleCopyDoi(paper.doi)}
                      title="Copy DOI identifier"
                      className="p-1 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                      {copiedDoi === paper.doi ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {doiUrl ? (
                  <a
                    href={doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 hover:border-teal-600 text-[11px] font-bold shadow-xs transition-all active:scale-[0.97] flex-shrink-0 cursor-pointer"
                  >
                    <span>Publisher</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">Unlinked</span>
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
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative w-full max-w-lg p-6 sm:p-7 z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Index Reference Publication
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Catalog DOI metadata into your lab notebook citation registry
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus-ring rounded-xl cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPaper} className="space-y-4.5 text-xs">
                {/* Paper Title */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Paper Title <span className="text-teal-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Precise genome editing in human cells via Cas9 endonuclease"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-semibold transition-all focus-ring placeholder:text-slate-400"
                  />
                </div>

                {/* DOI Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Digital Object Identifier (DOI) <span className="text-teal-600">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">Format: 10.xxxx/...</span>
                  </div>
                  <div className="relative">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10.1038/nature12373 or https://doi.org/10.1038/nature12373"
                      value={doi}
                      onChange={(e) => { setDoi(e.target.value); setDoiError(''); }}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-10 pr-3 text-xs text-slate-800 font-mono transition-all focus-ring placeholder:text-slate-400"
                    />
                  </div>
                  {doiError ? (
                    <p className="text-[11px] text-red-500 font-semibold">{doiError}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Prefixes like <code className="text-slate-600">https://doi.org/</code> are automatically normalised.
                    </p>
                  )}
                </div>

                {/* Publication Year */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Publication Year
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="1900"
                      max="2099"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-10 pr-3 text-xs font-mono text-slate-800 transition-all focus-ring"
                    />
                  </div>
                </div>

                {/* Abstract / Summary */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Executive Abstract / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a condensed summary of research conclusions, protocols, or molecular mechanisms relevant to your ongoing experiments."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:bg-white rounded-xl p-3 text-xs text-slate-800 resize-none transition-all focus-ring placeholder:text-slate-400"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs focus-ring cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-md shadow-teal-700/20 text-xs focus-ring cursor-pointer transition-all active:scale-[0.98]"
                  >
                    Save & Index Paper
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
