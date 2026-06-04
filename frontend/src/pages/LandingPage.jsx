import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Beaker,
  Layers,
  Users,
  TrendingUp,
  Calculator,
  BookOpen,
  ClipboardList,
  History,
  ShieldAlert,
  Search,
  Lock,
  Globe,
  Zap,
  ArrowRight,
  ChevronDown,
  Star,
  Check,
  Menu,
  X,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  Play,
  Activity,
  CheckCircle,
  Database
} from 'lucide-react';

// Count-up helper component for Trust Stats
const Counter = ({ value, duration = 1.5, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ''));
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    let timer = setInterval(() => {
      start += Math.ceil(end / 40); // speed up counting
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export default function LandingPage() {
  const { login } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeModulePreview, setActiveModulePreview] = useState('notebook');

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden-mobile');
    } else {
      document.body.classList.remove('overflow-hidden-mobile');
    }
    return () => document.body.classList.remove('overflow-hidden-mobile');
  }, [mobileMenuOpen]);

  const faqs = [
    {
      q: "Is LAB Notebook compliant with regulatory standards like FDA 21 CFR Part 11?",
      a: "Yes. LAB Notebook delivers automated audit logs, secure cryptographic digital signatures, role-based access control (RBAC), and immutable version history logs. These satisfy strict digital records guidelines required by global pharmaceutical and clinical research bodies."
    },
    {
      q: "Can we migrate our existing spreadsheets and documents into the platform?",
      a: "Yes. Our platform includes importer wizards that parse standard spreadsheets (CSV, Excel), Word documents, and local Markdown logs. We also provide secure REST APIs to hook up existing institutional databases."
    },
    {
      q: "How secure is our intellectual property on the cloud?",
      a: "All records are encrypted at rest with AES-256 and in transit via TLS 1.3. We host data on single-tenant cloud networks with 24/7 scanning, SOC 2 compliance certifications, and daily secure backups."
    },
    {
      q: "Do you support offline capabilities for cold rooms or isolated labs?",
      a: "Yes. Our Digital Lab Notebook operates using a Progressive Web App (PWA) framework. You can draft observations, edit checklists, and log data offline. Once you reconnect to network, changes sync automatically while checking for compliance locks."
    }
  ];

  const pricing = {
    scholar: {
      priceMonthly: 19,
      priceYearly: 15,
      features: [
        'Single scientist workspace',
        'Unlimited experiment logs',
        'Basic scientific calculators',
        '10 GB encrypted file space',
        'Local PDF exports',
        'Standard email support'
      ]
    },
    team: {
      priceMonthly: 59,
      priceYearly: 49,
      features: [
        'Up to 15 team members',
        'Collaborative sharing rules',
        'Interactive project boards',
        'Recharts analytics workspace',
        '100 GB institutional cloud storage',
        'Version history & audit logging',
        'API access for scientific equipment',
        'Priority 24/7 support'
      ]
    },
    enterprise: {
      priceMonthly: 149,
      priceYearly: 119,
      features: [
        'Unlimited users & research labs',
        'FDA 21 CFR Part 11 compliance pack',
        'Single Sign-On (SSO / SAML)',
        'Isolated custom cloud hosting',
        'Unlimited cloud storage',
        'Custom scientific calculators builder',
        'Dedicated compliance officer support',
        '99.99% SLA guarantee'
      ]
    }
  };

  const modules = [
    {
      id: 'notebook',
      title: 'Digital Lab Notebook',
      icon: Beaker,
      desc: 'Create folder trees, write markdown logs, embed data tables, and apply compliance-level digital signatures.',
      previewText: 'Organized folders, automatic version tracking (v1.0 -> v1.2), references linking with DOIs, and file attachments in one Notion-like editor.'
    },
    {
      id: 'projects',
      title: 'Projects & Milestones',
      icon: Layers,
      desc: 'Track research stages, assign tasks to lab members, configure checklists, and observe project timeline calendars.',
      previewText: 'A Linear-style board showing CRISPR transfections or scaffold tensile trials with progress bars, status pills, and owner avatars.'
    },
    {
      id: 'sharing',
      title: 'Collaboration Hub',
      icon: Users,
      desc: 'Share notebooks with granular permissions (Owner, Editor, Commenter, Viewer) and track recent editor operations.',
      previewText: 'Real-time peer reviews, shared laboratory libraries, and automated audit logs showing who accessed what protocol.'
    },
    {
      id: 'calculators',
      title: 'Scientific Calculators',
      icon: Calculator,
      desc: 'Biotech, Chemistry, Physics, and Statistics solvers that store results in history logs.',
      previewText: 'Molarity calculators, DNA copy numbers, PCR Master Mix multipliers, and half-life decay timers built natively inside the workspace.'
    },
    {
      id: 'papers',
      title: 'Research Papers Repository',
      icon: BookOpen,
      desc: 'Upload reference articles, catalog summaries, search metadata, and link papers directly as citations inside experiments.',
      previewText: 'A digital bookshelf to parse PubMed references and attach PDF files directly to active genomic projects.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 blueprint-grid relative overflow-x-hidden">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[800px] left-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20 text-white font-extrabold text-lg">
              L
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              LAB<span className="text-blue-600 font-medium">Notebook</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-semibold text-slate-650 hover:text-blue-600 transition-colors uppercase tracking-wider">Features</a>
            <a href="#why-us" className="text-xs font-semibold text-slate-650 hover:text-blue-600 transition-colors uppercase tracking-wider">Why Us</a>
            <a href="#modules" className="text-xs font-semibold text-slate-655 hover:text-blue-600 transition-colors uppercase tracking-wider">Modules</a>
            <a href="#workflow" className="text-xs font-semibold text-slate-655 hover:text-blue-600 transition-colors uppercase tracking-wider">Workflow</a>
            <a href="#pricing" className="text-xs font-semibold text-slate-655 hover:text-blue-600 transition-colors uppercase tracking-wider">Pricing</a>
            <a href="#faq" className="text-xs font-semibold text-slate-655 hover:text-blue-600 transition-colors uppercase tracking-wider">FAQs</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={login}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg focus-ring"
            >
              Login
            </button>
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-2.5 shadow hover:scale-[1.02] active:scale-[0.98] transition-all focus-ring"
            >
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus-ring"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>

        {/* Full Screen Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-xl md:hidden flex flex-col justify-between p-6 overflow-y-auto"
            >
              <nav className="flex flex-col gap-6 text-center pt-8">
                {[
                  { href: '#features', label: 'Features' },
                  { href: '#why-us', label: 'Why Us' },
                  { href: '#modules', label: 'Modules' },
                  { href: '#workflow', label: 'Workflow' },
                  { href: '#pricing', label: 'Pricing' },
                  { href: '#faq', label: 'FAQs' }
                ].map((link, idx) => (
                  <motion.a
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-extrabold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pb-12">
                <button
                  onClick={() => { setMobileMenuOpen(false); login(); }}
                  className="w-full text-center py-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); login(); }}
                  className="w-full text-center py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow shadow-blue-500/10 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-3.5 py-1 text-xs font-bold text-blue-750 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Next-Gen R&D and ERP Workspace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-black text-slate-900 tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.05]"
          >
            Transform Research <br />
            Into <span className="text-blue-600 relative inline-block">Discoveries</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            The all-in-one research ERP and digital laboratory notebook built for scientists, scholars, laboratories, and innovation teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-3.5 shadow-lg shadow-blue-650/15 hover:scale-[1.02] active:scale-[0.98] transition-all focus-ring"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="#modules"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-5 py-3.5 shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all focus-ring"
            >
              Explore Modules
            </a>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 w-full max-w-5xl relative rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur shadow-2xl p-2 sm:p-3"
        >
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 text-[10px] text-slate-400 px-1">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="bg-slate-100 rounded px-8 py-0.5 max-w-[250px] truncate">
              https://dashboard.labnotebook.ai/artemis
            </div>
            <div className="w-10 h-1.5 bg-slate-200 rounded" />
          </div>

          <div className="grid grid-cols-12 gap-3.5">
            {/* Sidebar Representation */}
            <div className="col-span-3 hidden md:block border-r border-slate-100 pr-3 space-y-2">
              <div className="h-5 bg-slate-200/60 rounded w-2/3" />
              <div className="space-y-1.5 pt-4">
                <div className="h-5 bg-blue-50 border-l-2 border-blue-600 rounded-r px-2 flex items-center">
                  <span className="w-2 h-2 rounded bg-blue-600 mr-2" />
                  <div className="w-12 h-1.5 bg-blue-400 rounded" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 rounded px-2 flex items-center">
                    <span className="w-2 h-2 rounded bg-slate-200 mr-2" />
                    <div className="w-16 h-1.5 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="col-span-12 md:col-span-9 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs">Project Artemis: CRISPR Engineering</h3>
                  <p className="text-[9px] text-slate-400 mt-0.5">Thorne Genomics Lab — IBS</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                  Active
                </span>
              </div>

              {/* KPI columns */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: 'Experiments', value: '142 Logs', bg: 'bg-blue-50 text-blue-600', icon: Beaker },
                  { label: 'Collaborators', value: '8 Active', bg: 'bg-indigo-50 text-indigo-650', icon: Users },
                  { label: 'Progress', value: '68%', bg: 'bg-emerald-50 text-emerald-650', icon: TrendingUp }
                ].map((kpi, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                      <kpi.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold">{kpi.label}</div>
                      <div className="text-xs font-black text-slate-700">{kpi.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart container */}
              <div className="h-40 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Transfection Efficiency (GFP Fluorescence)</span>
                  <div className="flex gap-2">
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded bg-blue-500 mr-1" />Electroporation</span>
                    <span className="flex items-center"><span className="w-1.5 h-1.5 rounded bg-slate-350 mr-1" />Lipofectamine</span>
                  </div>
                </div>
                {/* Chart bar outputs */}
                <div className="flex items-end justify-between px-4 h-24 pt-2">
                  {[40, 55, 48, 72, 85, 91, 78].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 w-full max-w-[20px]">
                      <div className="flex gap-1 items-end w-full h-16">
                        <div style={{ height: `${h}%` }} className="bg-blue-600 rounded-t w-1/2" />
                        <div style={{ height: `${h * 0.75}%` }} className="bg-slate-300 rounded-t w-1/2" />
                      </div>
                      <span className="text-[8px] text-slate-400">T+{i*8}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI cards */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -top-5 -right-3 hidden lg:flex items-center gap-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 max-w-[200px]"
          >
            <div className="bg-emerald-50 border border-emerald-150 p-1.5 rounded-lg text-emerald-600">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-800">Part 11 Verified</div>
              <p className="text-[8px] text-slate-400">Secure SHA-256 signature stamps compiled.</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-5 -left-3 hidden lg:flex items-center gap-2 bg-slate-900 text-white rounded-xl shadow-lg p-2.5 max-w-[210px]"
          >
            <div className="bg-blue-500 p-1.5 rounded-lg text-white">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold">Dilution Formula Saved</div>
              <p className="text-[8px] text-slate-400">Calculated: 1.0 M NaCl in 100mL.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Stats Section */}
      <section className="bg-white border-y border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <h2 className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Global Analytics Ledger</h2>
          <p className="font-extrabold text-slate-900 text-lg sm:text-xl">Accelerating scientific discovery cycles in labs globally</p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {[
              { val: '12,500', tag: 'Projects Managed' },
              { val: '850,000', tag: 'Research Hours Saved' },
              { val: '98,000', tag: 'Shared Resources' },
              { val: '4,200', tag: 'Collaborations Created' }
            ].map((stat, i) => (
              <div key={i} className="p-4 border-r border-slate-100 last:border-0">
                <div className="text-2xl sm:text-3xl font-black text-blue-600">
                  <Counter value={stat.val} suffix="+" />
                </div>
                <div className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">{stat.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Comparison Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold text-blue-650 uppercase tracking-widest">The Core Problem</span>
          <h2 className="font-black text-slate-900 text-xl sm:text-2xl">General Project Managers Fail Laboratories</h2>
          <p className="text-xs text-slate-500 leading-relaxed">Generic task lists cannot run chemistry dilutions or verify compliance log seals. Outdated labs stay stuck between local files and binders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Challenges Card */}
          <div className="bg-red-50/40 border border-red-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-red-700 flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Scatter & Non-Compliance Risks
            </h3>
            
            <div className="space-y-4 text-xs">
              {[
                { title: 'Lost Paper Observations', desc: 'Handwritten notes easily deteriorate or get misplaced, destroying months of raw data assets.' },
                { title: 'Local Spreadsheet Silos', desc: 'No single source of truth. Equations break silently and audit history is nonexistent.' },
                { title: 'Compliance Audit Bottlenecks', desc: 'Compiling paper logs and signatures during FDA audits takes weeks of tedious checking.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100/80 text-red-650 font-bold flex items-center justify-center text-[10px]">{idx + 1}</span>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions Card */}
          <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-blue-700 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" /> The Unified LAB Notebook System
            </h3>

            <div className="space-y-4 text-xs">
              {[
                { title: 'Immutable Digital Notebooks', desc: 'Query and search research records instantly from a secure, version-controlled repository.' },
                { title: 'Integrated Math Solvers', desc: 'PCR Master Mix scaling, Molarity calculations, and stats curves built directly into logs.' },
                { title: 'Part 11 Compliance Automation', desc: 'Cryptographic locking signatures and log audits generated natively on save.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100/80 text-blue-650 font-bold flex items-center justify-center text-[10px]">✓</span>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-455 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="bg-white border-y border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Platform Integrity</span>
            <h2 className="font-black text-slate-900 text-xl sm:text-2xl">Enterprise Infrastructure Built for R&D</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Research-First Design', desc: 'Workflows modeled on real laboratory operations rather than generic offices.', icon: Beaker },
              { title: 'Centralized Knowledge', desc: 'Store datasets, papers, protocols, and findings in one secure workspace.', icon: Layers },
              { title: 'Scientific Collaboration', desc: 'Review notes, assign tags, and execute peer approvals.', icon: Users },
              { title: 'Built-in Math Solvers', desc: 'Perform PCR scaling and molarity calculations natively.', icon: Calculator },
              { title: 'Enterprise Security', desc: 'AES-256 cloud encryption, SOC 2 compliance, and daily data backup sets.', icon: Lock },
              { title: 'Compliance Ledger', desc: 'Automated logs recording user actions, IP addresses, and signatures.', icon: History },
              { title: 'Multi-device Syncing', desc: 'Access your research vault securely from laptops, tablets, or gear PCs.', icon: Globe },
              { title: 'Scale Operations', desc: 'Adapts from individual PhD workspaces to multi-lab universities.', icon: Zap }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, borderColor: '#60A5FA' }}
                className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-xs transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 mb-3.5">
                  <card.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-slate-800 text-xs">{card.title}</h3>
                <p className="text-[11px] text-slate-450 mt-1.5 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold text-blue-650 uppercase tracking-widest">Platform Core</span>
          <h2 className="font-black text-slate-900 text-xl sm:text-2xl mt-1">Exceptional Operational Features</h2>
        </div>

        <div className="space-y-16">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="w-full lg:w-1/2 space-y-5">
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Module 01</span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950">Flagship Digital Lab Notebook</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                Write robust experiment entries with Markdown, compile readout data tables, link literature reference DOIs, and execute compliance-level signatures that lock the document.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> TeX inline equations support ($C_1 V_1 = C_2 V_2$)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> Version history logs (v1.0 to v1.2)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> Immutable compliance signing controls</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-slate-200 p-4 shadow-xl grid-bg">
              <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 space-y-2 font-mono text-[10px]">
                <div className="flex justify-between text-slate-400 border-b border-slate-200/60 pb-1.5">
                  <span className="font-bold text-slate-700">HEK293T_DNA_CLONE.md</span>
                  <span>v1.2 — signed</span>
                </div>
                <div className="text-slate-600 space-y-1.5">
                  <p className="font-bold text-slate-900"># Transfection Assay Protocol</p>
                  <p>1. Culture cells at 37°C in 5% CO2 standards.</p>
                  <p className="p-2 bg-blue-50 border border-blue-100 rounded text-blue-800 text-[9px]">
                    Equation: N = N0 * e^(k * t)
                  </p>
                  <p>2. Record storage modulus indexes under tension.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse gap-10 items-center">
            <div className="w-full lg:w-1/2 space-y-5">
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Module 02</span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950">Linear-Style Project Milestones</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                Replace generic Kanban layouts with scientific checklists. Assign assays, trace chromatography schedules, and update progress indices as steps are check-signed in notebooks.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> Milestones checkboxes linked directly to progress bars</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> View tasks in Grid, List, and Timeline calendars</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> Collaborator avatar allocation trackers</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-slate-200 p-4 shadow-xl grid-bg">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 border-b border-slate-100 pb-1.5">
                  <span>Project Artemis Milestones</span>
                  <span className="text-blue-600">68% Reached</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { text: 'sgRNA synthesis & purification', done: true },
                    { text: 'Flow cytometry transfection screening', done: true },
                    { text: 'Western Blot analysis confirmation', done: false }
                  ].map((task, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100 text-[10px]">
                      <span className={task.done ? 'text-slate-400 line-through' : 'font-medium text-slate-700'}>{task.text}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${task.done ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {task.done ? 'Checked' : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Interactive Showcase Grid */}
      <section id="modules" className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Dynamic Infrastructure</span>
            <h2 className="font-black text-slate-900 text-xl sm:text-2xl">A Unified Scientific Ecosystem</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Nav list */}
            <div className="lg:col-span-5 space-y-2.5">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModulePreview(m.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 focus-ring ${
                    activeModulePreview === m.id
                      ? 'bg-white border-blue-300 shadow-sm scale-[1.01]'
                      : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${activeModulePreview === m.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <m.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{m.title}</h4>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Preview display */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-lg p-5 sm:p-6 flex flex-col justify-between grid-bg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModulePreview}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <span className="text-[8px] font-extrabold text-blue-600 uppercase tracking-wider">SYSTEM PREVIEW SHELL</span>
                  <h3 className="font-black text-slate-900 text-base">{modules.find(m => m.id === activeModulePreview).title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{modules.find(m => m.id === activeModulePreview).previewText}</p>
                  
                  {/* Console visual decoration */}
                  <div className="border border-slate-150 rounded-xl bg-slate-900 text-slate-200 p-4 font-mono text-[10px] space-y-2 mt-4">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 text-slate-500 text-[8px] font-bold">
                      <span>CONSOLE DIRECTORY LOGS</span>
                      <span>STATUS: ONLINE</span>
                    </div>
                    {activeModulePreview === 'notebook' && (
                      <>
                        <div className="text-emerald-400">&gt; Loading Folders: Genetics, Scaffold Polymers, SOP Protocols</div>
                        <div>&gt; Note ID: 1042 Cas9 Amplification - status: In Review</div>
                        <div className="text-slate-500">&gt; SECURE FDA CRYPTO SIGNATURE LOCKED (2026-06-04)</div>
                      </>
                    )}
                    {activeModulePreview === 'projects' && (
                      <>
                        <div className="text-emerald-400">&gt; Query Active Pipelines: CRISPR Transfection (68% completed)</div>
                        <div>&gt; Load Milestones checklist: forward primer (Checked), target gel electrophoresis (Pending)</div>
                      </>
                    )}
                    {activeModulePreview === 'sharing' && (
                      <>
                        <div className="text-emerald-400">&gt; Shared nodes: 3 active folders</div>
                        <div>&gt; User "Alex" updated from Commenter to Editor (Audit stamp compiled)</div>
                      </>
                    )}
                    {activeModulePreview === 'calculators' && (
                      <>
                        <div className="text-emerald-400">&gt; DNA Copies estimator resolved: 50ng at 4000 bp</div>
                        <div className="text-blue-400">&gt; Result: 1.143e+10 copies. Log history entry recorded.</div>
                      </>
                    )}
                    {activeModulePreview === 'papers' && (
                      <>
                        <div className="text-emerald-400">&gt; Fetch reference collection: Lutolf et al. Biomacromolecules (2003)</div>
                        <div>&gt; Association matched with Project Helios: Scaffold Synthesis Hydrogels</div>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Timeline Section */}
      <section id="workflow" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold text-blue-650 uppercase tracking-widest">R&D Cycles</span>
          <h2 className="font-black text-slate-900 text-xl sm:text-2xl">The Linear Research Flow</h2>
        </div>

        <div className="relative pt-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-100/80 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {[
              { step: '01', title: 'Create Project', desc: 'Select templates, define scopes, and invite reviewers.' },
              { step: '02', title: 'Document Data', desc: 'Draft experimental checklists, notes, and spreadsheets.' },
              { step: '03', title: 'Run Calculations', desc: 'Scale PCR mix multipliers and determine solute molarities.' },
              { step: '04', title: 'Peer Review', desc: 'Track revisions, submit comments, and digital sign.' },
              { step: '05', title: 'Analyze Metrics', desc: 'Assess productivity outputs via dashboard charts.' },
              { step: '06', title: 'Publish Output', desc: 'Compile references metadata and export PDF results.' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-4.5 text-center shadow-xs flex flex-col justify-between"
              >
                <div className="mx-auto w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow">
                  {step.step}
                </div>
                <h4 className="font-bold text-slate-800 text-xs mt-3">{step.title}</h4>
                <p className="text-[10px] text-slate-450 mt-1.5 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-y border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-blue-605 uppercase tracking-widest">Endorsements</span>
            <h2 className="font-black text-slate-900 text-xl sm:text-2xl mt-1">Accelerating Breakthroughs Worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "LAB Notebook saved our department from binder overflow. We can query transfections records from years ago in seconds. The built-in compliance signature logs satisfy FDA standards seamlessly.",
                name: "Dr. Evelyn Thorne",
                title: "Lead Scientist, Thorne Genomics Lab",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              },
              {
                quote: "The built-in calculators are a game changer. I used to run PCR calculations on scrap paper, which led to errors. Now, the system scales recipes directly inside my active notebook log.",
                name: "Alex Rivera",
                title: "PostDoc Researcher, IBS",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              },
              {
                quote: "Coordinating 12 separate polymer synthesis labs was a PM nightmare. Storing calendars, folders, calculations, and publications under one central dashboard solved all communication bottlenecks.",
                name: "Prof. Marcus Vance",
                title: "Director of Scaffold Biomaterials Division",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic text-[11px] leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 mt-5 pt-3.5 border-t border-slate-200/50">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{t.name}</h4>
                    <p className="text-[9px] text-slate-400">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-blue-650 uppercase tracking-widest">Plans & Licenses</span>
          <h2 className="font-black text-slate-900 text-xl sm:text-2xl">Choose Your Laboratory Operations Tier</h2>
          
          {/* Monthly/Yearly toggle */}
          <div className="inline-flex items-center bg-slate-200/60 p-1 rounded-xl border border-slate-350/40">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 text-[10px] font-bold rounded-lg transition-all focus-ring ${
                billingCycle === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 focus-ring ${
                billingCycle === 'yearly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Yearly
              <span className="bg-blue-100 text-blue-700 text-[8px] px-1 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Scholar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Scholar Workspace</h3>
              <p className="text-[10px] text-slate-400 mt-1">Perfect for independent scholars and PhD researchers.</p>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-slate-900">
                  ${billingCycle === 'monthly' ? pricing.scholar.priceMonthly : pricing.scholar.priceYearly}
                </span>
                <span className="text-[10px] text-slate-450 ml-1">/ month</span>
              </div>

              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-[11px] text-slate-600">
                {pricing.scholar.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={login}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs bg-white transition-all focus-ring"
            >
              Start Free Trial
            </button>
          </div>

          {/* Research Team */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-full tracking-wider">
              Highly Recommended
            </span>
            <div>
              <h3 className="font-extrabold text-slate-850 text-sm">Research Team License</h3>
              <p className="text-[10px] text-slate-400 mt-1">Perfect for collaborative biotechnology lab groups.</p>

              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-slate-900">
                  ${billingCycle === 'monthly' ? pricing.team.priceMonthly : pricing.team.priceYearly}
                </span>
                <span className="text-[10px] text-slate-450 ml-1">/ month</span>
              </div>

              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-[11px] text-slate-650">
                {pricing.team.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={login}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow shadow-blue-550/20 transition-all focus-ring"
            >
              Start Free Trial
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-850 text-sm">Enterprise System</h3>
              <p className="text-[10px] text-slate-400 mt-1">Full compliance operations pack for universities and institutes.</p>

              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-slate-900">
                  ${billingCycle === 'monthly' ? pricing.enterprise.priceMonthly : pricing.enterprise.priceYearly}
                </span>
                <span className="text-[10px] text-slate-455 ml-1">/ month</span>
              </div>

              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-[11px] text-slate-600">
                {pricing.enterprise.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={login}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs bg-white transition-all focus-ring"
            >
              Book Custom Demo
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="bg-white border-y border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Knowledgebase</span>
            <h2 className="font-black text-slate-900 text-xl sm:text-2xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-4.5 text-left font-bold text-slate-800 text-xs hover:bg-slate-100/60 transition-colors focus-ring"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <p className="p-4.5 pt-0 text-[11px] text-slate-500 leading-relaxed border-t border-slate-200/50 bg-white">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion Focused Large CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="relative z-10 max-w-4xl mx-auto bg-blue-650 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-blue-500/10">
          <h2 className="font-black text-2xl sm:text-3xl tracking-tight">Start Building Better Research Today</h2>
          <p className="mt-3.5 text-xs text-blue-100 max-w-lg mx-auto leading-relaxed">
            Replace spreadsheet mess and binder clutter. Gain confidence in your records, maintain regulatory checks, and unlock discoveries.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-bold text-xs px-5 py-3 shadow transition-all hover:scale-[1.02] active:scale-[0.98] focus-ring"
            >
              Start Free Trial
            </button>
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl border border-blue-400 hover:border-blue-300 text-white font-bold text-xs px-5 py-3 transition-all focus-ring"
            >
              Book Custom Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 text-[11px]">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-1.5 text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-extrabold text-sm">L</div>
              <span className="font-extrabold text-base tracking-tight">LAB<span className="text-blue-500 font-medium">Notebook</span></span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">LAB Notebook is the leading Digital Lab Notebook and Research ERP platform for biotechnology, materials science, and engineering teams.</p>
            <div className="text-slate-600 pt-2">© 2026 LAB Notebook Inc. All rights reserved.</div>
          </div>
          {[
            { title: 'Product', links: [{ h: '#features', l: 'Features' }, { h: '#modules', l: 'Modules' }, { h: '#pricing', l: 'Pricing' }] },
            { title: 'Resources', links: [{ h: '#', l: 'Documentation' }, { h: '#', l: 'SOP Manuals' }, { h: '#', l: 'API Tools' }] },
            { title: 'Compliance', links: [{ h: '#', l: 'FDA 21 CFR' }, { h: '#', l: 'SOC 2 Security' }, { h: '#', l: 'Privacy' }] },
            { title: 'Contact', links: [{ h: '#', l: 'Sales Desk' }, { h: '#', l: 'Tech Support' }, { h: '#', l: 'Call Booker' }] }
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[9px]">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.links.map((link, i) => (
                  <li key={i}><a href={link.h} className="hover:text-white transition-colors">{link.l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
}
