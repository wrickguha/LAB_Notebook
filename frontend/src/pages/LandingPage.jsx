import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Beaker,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  Dna,
  FileText,
  FlaskConical,
  FolderKanban,
  Layers,
  Lock,
  Mail,
  Menu,
  Moon,
  Network,
  NotebookPen,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  TestTube2,
  Users,
  X,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: NotebookPen,
    tag: 'ELECTRONIC NOTEBOOK',
    title: 'Digital Lab Notebook (ELN)',
    description: 'Record observations, protocols, and raw datasets with FDA 21 CFR Part 11 compliant digital signatures and cryptographic hashing.',
    stat: '100% Audit Ready'
  },
  {
    icon: FolderKanban,
    tag: 'PROJECT MANAGEMENT',
    title: 'Research Milestones & Timelines',
    description: 'Structure multi-investigator projects, assign bench milestones, track completion indexes, and organize laboratory divisions.',
    stat: 'Real-time Sync'
  },
  {
    icon: Calculator,
    tag: 'SCIENTIFIC SUITE',
    title: '19 Precision Lab Calculators',
    description: 'Calibrated formulas for PCR, qPCR, LAMP, primer Tm/Ta, GC content, molarity, DNA/RNA spectrophotometry, and serial dilutions.',
    stat: '19 Validated Formulas'
  },
  {
    icon: Users,
    tag: 'COLLABORATION',
    title: 'Inter-Lab Resource Sharing',
    description: 'Distribute shared datasets, protocols, and equipment booking schedules across team members with granular permission levels.',
    stat: 'Role-Based Access'
  },
  {
    icon: BookOpen,
    tag: 'LITERATURE HUB',
    title: 'DOI Research Paper Indexing',
    description: 'Index published research papers directly by DOI, link literature to active notebook entries, and retrieve external citations.',
    stat: 'Instant DOI Lookup'
  },
  {
    icon: ShieldCheck,
    tag: 'COMPLIANCE & AUDIT',
    title: 'Immutable Regulatory Audit Trail',
    description: 'Automatic system logs capturing timestamped user actions, electronic sign-offs, and parameter changes for accreditation inspection.',
    stat: 'SOC 2 & 21 CFR Part 11'
  },
];

const metrics = [
  { value: '99.98%', label: 'Regulatory Audit Traceability', sub: 'Verified across academic & clinical institutions' },
  { value: '19', label: 'Validated Scientific Calculators', sub: 'From PCR master mixes to nucleic acid spectrophotometry' },
  { value: '10k+', label: 'Digital Experiments Logged', sub: 'Zero lost data, fully searchable protocols' },
  { value: '21 CFR', label: 'Part 11 Electronic Records', sub: 'Cryptographic SHA-256 signatures & locked entries' },
];

function InteractiveProductPreview() {
  const [activeTab, setActiveTab] = useState('notebook'); // 'notebook' | 'calculator' | 'projects'

  return (
    <div className="relative mx-auto max-w-4xl w-full rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 overflow-hidden">
      {/* Chrome window header */}
      <div className="h-11 border-b border-slate-200/80 bg-slate-50/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-teal-400" />
          <span className="ml-2 font-mono text-[11px] text-slate-500 bg-white px-3 py-0.5 rounded-md border border-slate-200">
            app.inveniqlab.ai/workspace/{activeTab}
          </span>
        </div>

        {/* Tab Switcher inside preview */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('notebook')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              activeTab === 'notebook' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Notebook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              activeTab === 'calculator' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              activeTab === 'projects' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Projects
          </button>
        </div>
      </div>

      {/* Interactive Mock Body */}
      <div className="p-6 min-h-[340px] bg-slate-50/40">
        <AnimatePresence mode="wait">
          {activeTab === 'notebook' && (
            <motion.div
              key="notebook"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                      LOG #2026-084
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Signed & Locked
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">
                    CRISPR-Cas9 Editing of HEK293T for Targeted Exon Excision
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono">Investigator: Dr. E. Thorne</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Transfection Efficiency</span>
                  <div className="text-xl font-black text-slate-800">92.4%</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">▲ +4.2% vs control</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">DNA Purity (A260/A280)</span>
                  <div className="text-xl font-black text-slate-800">1.86</div>
                  <div className="text-[10px] text-teal-600 font-semibold">Optimal Spec Ratio</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Cryptographic Ledger</span>
                  <div className="text-xs font-mono text-slate-600 truncate">SHA256: 9b2d...f4e1</div>
                  <div className="text-[10px] text-slate-400">21 CFR Part 11 Compliant</div>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-800">Procedure Observations</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Cells were harvested 48h post-electroporation. Gel electrophoresis confirmed 450 bp excision band with no detectable off-target cleavage in non-homologous screening lanes.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">PCR Master Mix Calculator</h4>
                    <span className="text-[10px] text-slate-400">Taq Polymerase Standard Protocol</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold">
                  24 Reactions (+10% Excess)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">2X Master Mix</span>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">660.00 µL</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Forward Primer</span>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">26.40 µL</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Reverse Primer</span>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">26.40 µL</div>
                </div>
                <div className="p-2.5 bg-teal-50/70 border border-teal-200 rounded-xl">
                  <span className="text-[9px] font-mono text-teal-700 uppercase font-bold">Nuclease-Free H2O</span>
                  <div className="text-sm font-bold text-teal-900 mt-0.5">554.40 µL</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Total Cocktail Master Mix Volume:</span>
                <span className="font-black text-slate-900 font-mono text-sm">1,267.20 µL</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Active Laboratory Projects</h4>
                  <span className="text-[10px] text-slate-400">Cross-Division R&D Ledger</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  All Systems Online
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">PRJ-GEN-01: CRISPR Excision</span>
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">Active</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">3 of 4 Milestones Complete</div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full w-3/4" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">PRJ-IMM-04: Monoclonal Purification</span>
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">Review</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Affinity Chromatography Protocol</div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                      <span>Progress</span>
                      <span>90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[90%]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [isNight, setIsNight] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock mobile body scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden-mobile', mobileMenuOpen);
    return () => document.body.classList.remove('overflow-hidden-mobile');
  }, [mobileMenuOpen]);

  const goToAuth = (signup = false) => navigate(signup ? '/auth?signup=true' : '/auth');
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`landing-page ${isNight ? 'night-mode' : ''}`}>
      
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-40 h-18 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <a href="#top" className="flex items-center gap-2.5 text-decoration-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 shadow-md shadow-teal-500/20 text-white font-extrabold text-lg tracking-tight">
              I
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Inveniq<span className="text-teal-600 dark:text-teal-400 font-semibold">Lab</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#about" className="hover:text-teal-600 transition-colors">About</a>
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#tools" className="hover:text-teal-600 transition-colors">Scientific Suite</a>
            <a href="#pricing" className="hover:text-teal-600 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => setIsNight(!isNight)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-teal-600 transition-colors cursor-pointer"
              aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}
            >
              {isNight ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button 
              type="button" 
              onClick={() => goToAuth(false)}
              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button 
              type="button" 
              onClick={() => goToAuth(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav className="fixed inset-x-0 top-18 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 text-sm font-bold text-slate-800 dark:text-slate-100 md:hidden shadow-xl">
          <a href="#about" onClick={closeMenu} className="py-2 hover:text-teal-600">About InveniqLab</a>
          <a href="#features" onClick={closeMenu} className="py-2 hover:text-teal-600">Features</a>
          <a href="#tools" onClick={closeMenu} className="py-2 hover:text-teal-600">Scientific Suite</a>
          <a href="#pricing" onClick={closeMenu} className="py-2 hover:text-teal-600">Pricing</a>
          <a href="#contact" onClick={closeMenu} className="py-2 hover:text-teal-600">Contact</a>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-3">
            <button 
              type="button" 
              onClick={() => { closeMenu(); goToAuth(false); }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold"
            >
              Sign In
            </button>
            <button 
              type="button" 
              onClick={() => { closeMenu(); goToAuth(true); }}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-center text-xs font-bold"
            >
              Get Started Free
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Sections */}
      <main id="top" className="relative">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden science-grid">
          {/* Ambient background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>DIGITAL LAB NOTEBOOK & RESEARCH ERP</span>
              <span className="text-teal-400">•</span>
              <span className="font-mono text-[11px]">21 CFR PART 11</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.05]">
              Organize your research.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500">
                Accelerate discovery.
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              InveniqLab is the unified digital laboratory environment for modern researchers. Replace disconnected paper notebooks and spreadsheets with cryptographically sealed logs, 19 calibrated calculators, and collaborative project ledgers.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button 
                type="button" 
                onClick={() => goToAuth(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xl shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Launch Free Lab Workspace</span>
                <ArrowRight size={16} />
              </button>

              <a 
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:border-teal-500 transition-all"
              >
                <span>Explore Architecture</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" /> Electronic Signatures
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" /> FDA 21 CFR Part 11 Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" /> Zero Spreadsheets Needed
              </span>
            </div>

            {/* Live Interactive Product Mockup */}
            <div className="pt-8">
              <InteractiveProductPreview />
            </div>

          </div>
        </section>

        {/* METRICS ROW */}
        <section className="border-y border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((m, idx) => (
                <div key={idx} className="space-y-1.5 text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight text-teal-600 dark:text-teal-400">
                    {m.value}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {m.label}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 01 ABOUT SECTION */}
        <section id="about" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              01 / Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Precision tools built for rigorous science.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Biotechnology laboratories often juggle fragile spreadsheets, disconnected calculators, and paper notebooks that fail compliance audits. InveniqLab consolidates the bench scientist's workflow into a cohesive, compliant digital workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Regulatory Integrity</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Immutable audit trails automatically capture every parameter edit, experiment approval, and team permission change for flawless FDA inspection readiness.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Molecular Calculation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Nineteen peer-reviewed scientific formulas built straight into the platform. Calculate PCR master mixes, LAMP assays, oligonucleotide annealing temperatures, and copy numbers in seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Team Synchronization</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Collaborate seamlessly between Principal Investigators, postdoctoral fellows, and laboratory managers with granular role permissions and resource sharing.
              </p>
            </div>
          </div>
        </section>

        {/* 02 BENTO FEATURES SECTION */}
        <section id="features" className="py-20 lg:py-28 bg-slate-100/60 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                02 / Platform Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Everything your laboratory requires.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Six integrated modules engineered specifically for life science teams.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200/60 dark:border-teal-800">
                        {item.stat}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        {item.tag}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 SCIENTIFIC SUITE SECTION */}
        <section id="tools" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                03 / Calibrated Calculations
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                No more manual math errors in your assays.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether setting up a 96-well qPCR plate or calculating primer reconstitution in sterile TE buffer, InveniqLab handles the math with instantaneous recalculation and export to your lab notebook.
              </p>

              <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs">✓</div>
                  <span>Master mix pipetting cocktails with customizable excess volumes (5-20%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs">✓</div>
                  <span>Nearest-Neighbor thermodynamic oligonucleotide Tm and Ta predictions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs">✓</div>
                  <span>Direct export of calculation recipes into digital notebook experiment logs</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => goToAuth(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  <span>Test All 19 Calculators</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Visual Formula Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-teal-400 font-bold">
                  <FlaskConical className="w-4 h-4" />
                  <span>CALIBRATOR ENGINE v4.2</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  DOUBLE PRECISION
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-teal-400 font-bold">C1 × V1 = C2 × V2 (DILUTION LAW)</span>
                  <p className="text-slate-300 text-[11px]">V1 = (C2 × V2) / C1</p>
                  <p className="text-slate-400 text-[10px]">Buffer Addition = V2 - V1</p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-[10px] text-teal-400 font-bold">DNA COPY NUMBER FORMULA</span>
                  <p className="text-slate-300 text-[11px]">Copies = (ng × 6.02214076e23) / (Length bp × 1e9 × 660)</p>
                  <p className="text-slate-400 text-[10px]">Based on double-stranded DNA mean mass (660 g/mol·bp)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-teal-300">Ready to automate your calculations?</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Free forever for verified academic researchers.</div>
                </div>
                <button
                  type="button"
                  onClick={() => goToAuth(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-[11px] cursor-pointer"
                >
                  Try Now
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 04 PRICING SECTION */}
        <section id="pricing" className="py-20 lg:py-28 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400">
                04 / Transparent Investment
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Plans built for laboratories of every scale.
              </h2>
              <p className="text-sm text-slate-400">
                Get started free for individual investigators. Scale seamlessly across research centers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Academic Tier */}
              <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400">
                    ACADEMIC & SCHOLAR
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">$0</span>
                    <span className="text-xs text-slate-400">/ forever free</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Designed for graduate researchers, PhD scholars, and single-bench investigators.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> Full Electronic Lab Notebook
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> All 19 Scientific Calculators
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> DOI Research Paper Indexing
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> Standard Community Support
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => goToAuth(true)}
                  className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Get Started Free
                </button>
              </div>

              {/* Enterprise Lab Tier */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-teal-950/60 to-slate-900 border-2 border-teal-500 flex flex-col justify-between space-y-6 relative shadow-2xl">
                <div className="absolute -top-3 right-6 bg-teal-500 text-slate-950 font-extrabold text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full">
                  MOST POPULAR
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400">
                    ENTERPRISE & BIO-R&D
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">$49</span>
                    <span className="text-xs text-slate-400">/ user / month</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    For pharmaceutical firms, biotech startups, and clinical research groups.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-200 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> Everything in Academic tier
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> FDA 21 CFR Part 11 Electronic Signatures
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> Multi-Lab Resource Booking & SOP Hub
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" /> Unlimited Audit Log Exports & Priority Support
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => goToAuth(true)}
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                >
                  Start Enterprise Trial
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 05 CONTACT SECTION */}
        <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                05 / Get In Touch
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Custom validation for your laboratory?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                We work directly with department chairs, lab managers, and quality assurance officers to implement InveniqLab according to your SOP requirements.
              </p>
            </div>

            <a 
              href="mailto:contact@inveniqlab.ai"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
            >
              <Mail className="w-4 h-4 text-teal-400 dark:text-teal-600" />
              <span>Contact Lab Specialist</span>
            </a>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-extrabold text-base">
                  I
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  Inveniq<span className="text-teal-600 font-semibold">Lab</span>
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                The next-generation Digital Lab Notebook and Research ERP for modern biotechnology and life science laboratories.
              </p>
              <div className="text-[11px] font-mono text-teal-600">
                FDA 21 CFR PART 11 READY
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Platform Modules</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-teal-600">Electronic Lab Notebook</a></li>
                <li><a href="#features" className="hover:text-teal-600">Research Management</a></li>
                <li><a href="#features" className="hover:text-teal-600">Resource Sharing</a></li>
                <li><a href="#tools" className="hover:text-teal-600">19 Scientific Calculators</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Regulatory & Trust</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="#about" className="hover:text-teal-600">21 CFR Part 11 Validation</a></li>
                <li><a href="#about" className="hover:text-teal-600">SOC 2 Type II Security</a></li>
                <li><a href="#about" className="hover:text-teal-600">Cryptographic Signing</a></li>
                <li><a href="#about" className="hover:text-teal-600">Data Immutability</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Institutional Access</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Ready to deploy across your faculty or research division?
              </p>
              <button
                type="button"
                onClick={() => goToAuth(true)}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Sign Up for Free
              </button>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} InveniqLab Systems Inc. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#top" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#top" className="hover:text-slate-600">Terms of Service</a>
              <a href="#top" className="hover:text-slate-600">Security Disclosures</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
