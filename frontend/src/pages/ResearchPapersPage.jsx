import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  X,
  Tag,
  ExternalLink,
  BookMarked,
  FileText
} from 'lucide-react';

export default function ResearchPapersPage() {
  const { researchPapers, addResearchPaper } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [year, setYear] = useState('2026');
  const [doi, setDoi] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');

  const handleAddPaper = (e) => {
    e.preventDefault();
    if (!title || !authors) return;

    addResearchPaper({
      title,
      authors,
      journal,
      year,
      doi,
      summary,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    });

    // Reset Form
    setTitle('');
    setAuthors('');
    setJournal('');
    setYear('2026');
    setDoi('');
    setSummary('');
    setTags('');
    setModalOpen(false);
  };

  const filteredPapers = (researchPapers || []).filter(paper => 
    (paper.title || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
    (paper.authors || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
    (paper.tags || []).some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Search and Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
        
        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search papers by title, author, tag..."
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

      {/* Grid of papers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{paper.title}</h3>
                <BookMarked className="w-5 h-5 text-blue-500/60 flex-shrink-0" />
              </div>

              <div className="text-[10px] text-slate-455 font-bold leading-relaxed">
                <span>By: {paper.authors}</span>
                <span className="mx-2">•</span>
                <span className="italic">{paper.journal} ({paper.year})</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{paper.summary || paper.abstract || ''}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(paper.tags || []).map((tag, i) => (
                  <span key={i} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* DOI Link */}
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-450 font-bold">DOI: {paper.doi || 'N/A'}</span>
              {paper.doi && (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-650 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline focus-ring rounded px-1"
                >
                  View Publisher <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Paper Modal */}
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
              className="bg-white border border-slate-200 rounded-2xl shadow-2xl relative w-full max-w-lg p-6 z-10 text-xs text-slate-750"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Log Reference Publication</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-450 hover:text-slate-655 focus-ring rounded-lg cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPaper} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Paper Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRISPR-Cas9 Editing in Mammalians"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Authors list</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zhang F., Hubbell J."
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Journal / Conference</label>
                    <input
                      type="text"
                      placeholder="e.g. Nature Biotech"
                      value={journal}
                      onChange={(e) => setJournal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">DOI code</label>
                    <input
                      type="text"
                      placeholder="e.g. 10.1038/nprot.2013"
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. CRISPR, Biotech, RNA"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-850 focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Brief Abstract / Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a condensed summary of research conclusions and methodologies."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
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
