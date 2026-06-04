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
  Play
} from 'lucide-react';

// Count-up helper component for Trust Stats
const Counter = ({ value, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ''));
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 30);
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  // Format with commas
  const formatted = count.toLocaleString();
  return <span>{formatted}{suffix}</span>;
};

export default function LandingPage() {
  const { login } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeModulePreview, setActiveModulePreview] = useState('notebook');

  // FAQ Accordion Data
  const faqs = [
    {
      q: "Is LAB Notebook compliant with regulatory standards like FDA 21 CFR Part 11?",
      a: "Yes, absolutely. LAB Notebook provides automated audit logs, timestamped version history, cryptographic signatures, and role-based access control (RBAC). These features satisfy strict guidelines for electronic records and signatures required by the FDA and other global governing bodies."
    },
    {
      q: "Can we migrate our existing spreadsheets and documents into the platform?",
      a: "Yes. We offer built-in importer wizards that parse Excel databases, Word logs, CSV files, and Markdown folders. Our customer onboarding team also provides automated API scripts for transferring legacy database records from older ERP systems."
    },
    {
      q: "How secure is our intellectual property on the cloud?",
      a: "Security is our highest priority. All data is encrypted at rest using AES-256 and in transit via TLS 1.3. We deploy on isolated, single-tenant AWS/Vercel enterprise servers with continuous vulnerability scanning, automated daily backups, and SOC 2 Type II certifications."
    },
    {
      q: "Do you offer offline capabilities for lab rooms without internet?",
      a: "Yes. Our Digital Lab Notebook operates using a progressive web app (PWA) framework. You can draft experiment logs, log observations, and complete checklists offline. Once a connection is established, changes sync automatically while checking for version conflicts."
    },
    {
      q: "What scientific calculations are natively supported?",
      a: "We support a wide array of biotechnology, chemistry, and physics calculators—including molarity dilutions, PCR master mix ratios, DNA/RNA copy count estimations, radioactive decay half-life, standard deviation curves, and statistical significance models."
    }
  ];

  // Pricing Data
  const pricing = {
    scholar: {
      priceMonthly: 19,
      priceYearly: 15,
      features: [
        'Single scientist workspace',
        'Unlimited experiment logs',
        'Basic scientific calculators',
        '10 GB encrypted file attachments',
        'Local PDF exports',
        'Standard email support'
      ]
    },
    team: {
      priceMonthly: 59,
      priceYearly: 49,
      features: [
        'Up to 15 team members',
        'Collaborative workspace & sharing rules',
        'Interactive project boards',
        'Advanced Recharts analytics',
        '100 GB institutional cloud storage',
        'Version history & audit logging',
        'API access for scientific gear',
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
        'Dedicated custom database hosting',
        'Unlimited cloud storage',
        'Custom scientific calculators builder',
        'Dedicated Account Manager',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 grid-bg">
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[1200px] right-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 text-white font-bold text-xl">
              L
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              LAB<span className="text-blue-600 font-medium">Notebook</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#why-us" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#modules" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Modules</a>
            <a href="#workflow" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Workflow</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">FAQs</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={login}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-1.5"
            >
              Login
            </button>
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white px-5 py-2.5 shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 bg-white"
            >
              <div className="space-y-1 px-4 pb-4 pt-2 shadow-inner">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Features
                </a>
                <a
                  href="#why-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Why Us
                </a>
                <a
                  href="#modules"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Modules
                </a>
                <a
                  href="#workflow"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Workflow
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  FAQs
                </a>
                <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={login}
                    className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={login}
                    className="w-full text-center py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/10"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-24 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-blue-700 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Empowering Next-Gen Biotech & R&D Teams
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
          >
            Transform Research <br className="hidden sm:inline" />
            Into <span className="text-blue-600 bg-clip-text">Discoveries</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            The all-in-one research ERP and digital laboratory notebook built for scientists, scholars, laboratories, and innovation teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 px-4"
          >
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold text-white px-7 py-3.5 shadow-xl shadow-blue-600/15 hover:shadow-blue-600/30 hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a
              href="#modules"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-base font-semibold text-slate-700 hover:text-slate-900 px-7 py-3.5 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Explore Modules
            </a>
          </motion.div>
        </div>

        {/* Dashboard Preview & Floating Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative max-w-5xl mx-auto rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur shadow-2xl p-2.5 sm:p-4 grid-bg"
        >
          {/* Glass Navbar Mockup */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4 text-xs text-slate-500 px-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="bg-slate-100 rounded-md py-1 px-12 font-medium tracking-wide">
              https://dashboard.labnotebook.ai/project/artemis
            </div>
            <div className="w-12 h-2 bg-slate-200 rounded" />
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Sidebar Mockup */}
            <div className="col-span-3 hidden md:block border-r border-slate-100 pr-4 space-y-3">
              <div className="h-6 bg-slate-200/70 rounded w-3/4" />
              <div className="space-y-2 pt-4">
                <div className="h-5 bg-blue-50 border-l-2 border-blue-600 rounded-r px-2 py-0.5 flex items-center">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600 mr-2" />
                  <div className="w-16 h-2 bg-blue-400 rounded" />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-5 rounded px-2 py-0.5 flex items-center">
                    <span className="w-2.5 h-2.5 rounded bg-slate-300 mr-2 animate-pulse" />
                    <div className="w-20 h-2 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="col-span-12 md:col-span-9 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Project Artemis: CRISPR Engineering</h3>
                  <p className="text-xs text-slate-400">Genomics Research Group — Institute of Biomolecular Sciences</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  Active Status
                </span>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50/80 border border-slate-150 p-3 rounded-xl flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Beaker className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Total Experiments</div>
                    <div className="text-sm font-bold text-slate-700">142 Logs</div>
                  </div>
                </div>
                <div className="bg-slate-50/80 border border-slate-150 p-3 rounded-xl flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Collaborators</div>
                    <div className="text-sm font-bold text-slate-700">8 Active</div>
                  </div>
                </div>
                <div className="bg-slate-50/80 border border-slate-150 p-3 rounded-xl flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Target Progress</div>
                    <div className="text-sm font-bold text-slate-700">68% Reached</div>
                  </div>
                </div>
              </div>

              {/* Chart Mockup */}
              <div className="h-44 bg-slate-50/60 border border-slate-150 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">Transfection Efficiency (Relative Fluorescence Unit)</span>
                  <div className="flex gap-2">
                    <span className="flex items-center"><span className="w-2 h-2 rounded bg-blue-500 mr-1"/>Electroporation</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded bg-slate-400 mr-1"/>Lipofectamine</span>
                  </div>
                </div>
                {/* Visual Chart Bars Mockup */}
                <div className="flex items-end justify-between px-6 h-28 pt-4">
                  {[45, 60, 52, 78, 89, 91, 74].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 w-full max-w-[24px]">
                      <div className="flex gap-1 items-end w-full h-20">
                        <div style={{ height: `${h}%` }} className="bg-blue-600 rounded-t w-1/2" />
                        <div style={{ height: `${h * 0.7}%` }} className="bg-slate-300 rounded-t w-1/2" />
                      </div>
                      <span className="text-[9px] text-slate-400">T+{i*8}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="absolute -top-6 -right-6 hidden lg:flex items-center gap-3 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 max-w-[240px]"
          >
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Compliance Logged</div>
              <p className="text-[10px] text-slate-400">FDA 21 CFR Part 11 signature timestamp compiled.</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-8 -left-8 hidden lg:flex items-center gap-3 bg-slate-900 text-white rounded-2xl shadow-xl p-3 max-w-[250px]"
          >
            <div className="bg-blue-500 p-2.5 rounded-xl text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Scientific Solvers</div>
              <p className="text-[10px] text-slate-400">Molarity Dilution calculated: 1.0 M NaCl in 100mL.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust & Stats Section */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-blue-600 uppercase tracking-widest">Global Footprint</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Accelerating discovery in labs worldwide</p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-4 border-r border-slate-100 last:border-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                <Counter value="12,500" suffix="+" />
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-500">Projects Managed</div>
            </div>
            <div className="p-4 border-r border-slate-100 last:border-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                <Counter value="850,000" suffix="+" />
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-500">Research Hours Saved</div>
            </div>
            <div className="p-4 border-r border-slate-100 last:border-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                <Counter value="98,000" suffix="+" />
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-500">Shared Resources</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                <Counter value="4,200" suffix="+" />
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-500">Collaborations Created</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">The Challenge</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Traditional Research Frameworks Are Broken</p>
          <p className="mt-4 text-lg text-slate-500">Manual tracking and outdated local spreadsheets delay peer-reviews, cause data leaks, and slow down crucial drug development timelines.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenges side */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Outdated Systems
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">1</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Paper Lab Notebooks</h4>
                  <p className="text-xs text-slate-500 mt-1">Physical logs can get lost, damaged, or burnt. Searching for experimental records from 3 years ago takes hours of cabinet checking.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">2</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Spreadsheet Chaos</h4>
                  <p className="text-xs text-slate-500 mt-1">Fragmented Excel sheets stored locally on lab laptops. Formulas get corrupted, and version history is nonexistent.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">3</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Regulatory Compliance Risk</h4>
                  <p className="text-xs text-slate-500 mt-1">FDA audit preparation takes weeks because data trails are scattered across email threads and chat apps.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution side */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-blue-600" /> Powered by LAB Notebook
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Digital First Vault</h4>
                  <p className="text-xs text-slate-500 mt-1">Search through millions of rows, attachments, and logs instantly. Full folder organization with markdown support.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Built-in Math & Graph Tools</h4>
                  <p className="text-xs text-slate-500 mt-1">Perform molarity conversions, PCR scaling, and DNA copying instantly inside your log with real-time graph exports.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">FDA 21 CFR Part 11 Ready</h4>
                  <p className="text-xs text-slate-500 mt-1">Cryptographic hashes of logs, locking files upon approval, and secure timestamp logs compile automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="bg-white border-y border-slate-200 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Why Choose Us</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Engineered for High-Stakes R&D</p>
            <p className="mt-4 text-lg text-slate-500">We replace general-purpose PM boards with a specialized research platform created by scientists, for scientists.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Research-First Design', desc: 'Interfaces modeled on real lab workloads rather than general corporate software.', icon: Beaker },
              { title: 'Centralized Knowledge', desc: 'Store datasets, papers, protocols, and findings in one accessible node.', icon: Layers },
              { title: 'Scientific Collaboration', desc: 'Secure peer reviews and approvals with full timestamp trails.', icon: Users },
              { title: 'Built-in Calculators', desc: 'Accelerate PCR preparations and chemistry concentrations natively.', icon: Calculator },
              { title: 'Enterprise Security', desc: 'AES-256 cloud encryption, SOC 2 compliance, and daily data backup sets.', icon: Lock },
              { title: 'Version Tracking', desc: 'Full audit history logs every word replacement and cell change.', icon: History },
              { title: 'Cloud Accessibility', desc: 'Seamless synchronization across laptops, lab tablets, and workstations.', icon: Globe },
              { title: 'Scalable R&D Operations', desc: 'From solo PhD scholars to university research departments.', icon: Zap },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-4">
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{card.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Product Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything You Need to Manage R&D</p>
        </div>

        <div className="mt-16 space-y-24">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Feature 01</span>
              <h3 className="text-2xl font-bold text-slate-950">Flagship Digital Lab Notebook</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Write robust experiment notes with Markdown, construct data spreadsheets directly in the canvas, and drag and drop raw cytometer or chromatograph files.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Rich Text with TeX Math Support ($C_1 V_1 = C_2 V_2$)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Embedded CSV/Excel spreadsheet inputs</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Lockable versions for patent protection</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-slate-200 p-4 shadow-xl grid-bg">
              {/* Notebook visual mockup */}
              <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-slate-700">EXPERIMENT_LOG_44B.md</span>
                  <span className="text-slate-400">v1.2 — 18 mins ago</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-900"># PCR Amplification Protocol</p>
                  <p>1. Transfect Cas9 plasmids into HEK293T culture media...</p>
                  <p className="p-2 bg-blue-50/80 border border-blue-100 text-blue-800 rounded font-mono text-[10px]">
                    Volume total = 50 µL (Taq Mix: 25uL, Primers: 5uL)
                  </p>
                  <p>2. Set thermal cycler at 95°C for 2 minutes denaturation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Feature 02</span>
              <h3 className="text-2xl font-bold text-slate-950">Research Project Management</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Replace general boards with layouts built for project milestones. Assign assays, monitor gel blot completion steps, and track overall progress toward target publications.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Linear-inspired clean workspace design</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Milestone checklist linking with documents</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Calendar views for shared resource bookings</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-slate-200 p-4 shadow-xl grid-bg">
              {/* Projects visual mockup */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-700">Project Artemis Milestones</span>
                  <span className="text-blue-650 font-semibold">68% Done</span>
                </div>
                <div className="space-y-2">
                  {[
                    { title: 'sgRNA Design & Synthesis', status: 'completed' },
                    { title: 'Transfection efficiency assay flow run', status: 'completed' },
                    { title: 'Western Blot expression verification', status: 'pending' },
                  ].map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <span className={`font-medium ${m.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{m.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${m.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {m.status === 'completed' ? 'Signed' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Feature 03</span>
              <h3 className="text-2xl font-bold text-slate-950">Scientific Calculators Pack</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Compute concentrations, calculate copy numbers, and prepare dilution formulas. Store results in the history panel and drag findings into active notebook entries.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Live Molarity, PCR scaling, and DNA copies tools</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Export answers as copyable MD code</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Calculator history to reuse results</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-slate-200 p-4 shadow-xl grid-bg">
              {/* Calculators visual mockup */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <span className="text-xs font-semibold text-slate-600 block">DNA Copy Estimator</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400">DNA mass (ng)</label>
                    <div className="bg-white border border-slate-200 p-1.5 rounded">50</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Length (bp)</label>
                    <div className="bg-white border border-slate-200 p-1.5 rounded">4000</div>
                  </div>
                </div>
                <div className="bg-blue-600 text-white rounded p-2 text-center text-xs font-bold shadow-md">
                  Result: 1.143e+10 copies
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="bg-slate-100 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Interactive Hub</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Explore Integrated R&D Modules</p>
            <p className="mt-4 text-lg text-slate-500">Every component works in unison to maintain compliance and save time.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Module Selector */}
            <div className="lg:col-span-5 space-y-3">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModulePreview(m.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                    activeModulePreview === m.id
                      ? 'bg-white border-blue-300 shadow-md scale-[1.01]'
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100 hover:scale-[1.005]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeModulePreview === m.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-650'}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{m.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Module Preview Area */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-lg p-6 flex flex-col justify-between grid-bg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModulePreview}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest">
                    <span>Active Interface Module</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {modules.find(m => m.id === activeModulePreview).title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {modules.find(m => m.id === activeModulePreview).previewText}
                  </p>
                  
                  {/* Decorative representation of screens */}
                  <div className="border border-slate-100 rounded-xl bg-slate-50 p-4 font-mono text-[11px] text-slate-600 space-y-2 mt-4 shadow-inner">
                    <span className="text-[10px] text-slate-400 block border-b border-slate-200 pb-1 font-sans font-bold uppercase">SYSTEM CONSOLE // DATA PREVIEW</span>
                    {activeModulePreview === 'notebook' && (
                      <>
                        <div className="text-blue-700">✔ Loaded Folders (4) - [Genetics, Scaffolds, Microscopy, SOP]</div>
                        <div>📂 Note Draft: "CRISPR Editing Efficiency" (In Review)</div>
                        <div className="text-slate-400">&gt; Timestamp locked: 2026-06-04 18:12 (FDA Compliant Signature)</div>
                      </>
                    )}
                    {activeModulePreview === 'projects' && (
                      <>
                        <div className="text-blue-700">✔ Loaded active projects: 4</div>
                        <div>📁 Project Artemis progress: 68% [■■■■■■■□□□]</div>
                        <div>📁 Project Helios progress: 45% [■■■■□□□□□□]</div>
                      </>
                    )}
                    {activeModulePreview === 'sharing' && (
                      <>
                        <div className="text-blue-750">✔ Active Collaborators: 4</div>
                        <div>🔒 "Sequencing Folder" shared with: Alex (Editor), Sarah (Commenter)</div>
                        <div>⚡ Change permission: Marcus Vance updated to Viewer level</div>
                      </>
                    )}
                    {activeModulePreview === 'calculators' && (
                      <>
                        <div className="text-blue-700">✔ Dilution scaling computed successfully.</div>
                        <div>Input parameters: 50ng DNA at 4000 bp.</div>
                        <div className="font-bold text-emerald-600">&gt; Output result: 1.143e+10 copies. Added to history.</div>
                      </>
                    )}
                    {activeModulePreview === 'papers' && (
                      <>
                        <div className="text-blue-700">✔ Reference catalog fetched.</div>
                        <div>&gt; DOI 10.1038/nprot.2013.143 matched: Zhang et al. Nature Protocols (2013).</div>
                        <div>&gt; Associated with Project Artemis: CRISPR Transfection Logs.</div>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Ready to deploy out of the box.</span>
                <button
                  onClick={login}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                >
                  Access Dashboard Workspace <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Workflow Section */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Workflow Timeline</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Continuous Scientific Iteration</p>
        </div>

        <div className="mt-16 relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-100 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {[
              { step: '01', title: 'Create Project', desc: 'Initialize projects, select research goals, and invite peer reviewers.' },
              { step: '02', title: 'Document Experiments', desc: 'Log findings in the Markdown editor, attach media, and compile tables.' },
              { step: '03', title: 'Perform Calculations', desc: 'Calculate PCR ingredients or molar concentrations and record answers.' },
              { step: '04', title: 'Collaborate', desc: 'Review notes, assign comments, and digitally approve logs.' },
              { step: '05', title: 'Analyze Results', desc: 'Track statistics, review timelines, and export Recharts progress diagrams.' },
              { step: '06', title: 'Publish Research', desc: 'Export compliant data packs, index references, and submit to journals.' },
            ].map((w, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center flex flex-col justify-between"
              >
                <div className="mx-auto w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                  {w.step}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-4">{w.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">What Researchers Are Saying</p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "LAB Notebook saved our lab from binder overflow. We can query research records from years ago in seconds. The FDA audit logs built right into the notebook makes verification checks effortless.",
                name: "Dr. Evelyn Thorne",
                title: "Lead Scientist, Thorne Genomics Lab",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              },
              {
                quote: "The built-in calculators are a game changer. I used to run PCR reactions scaling calculations on scrap paper, which led to minor errors. Now, the platform outputs formulas straight into my active logs.",
                name: "Alex Rivera",
                title: "PostDoctoral Fellow, IBS",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              },
              {
                quote: "Coordinating a department of 14 separate R&D groups was a project management nightmare. Having projects, documents, resource logs, and publications under one central dashboard solved all communication bottlenecks.",
                name: "Prof. Marcus Vance",
                title: "Director of Biomaterials Research",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-650 italic text-xs leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/60">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Pricing Plans</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Choose Your Research Tier</p>
          
          {/* Monthly/Yearly toggle */}
          <div className="mt-6 inline-flex items-center bg-slate-200/80 p-1.5 rounded-xl border border-slate-300/40">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Scholar Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">Scholar</h3>
              <p className="text-xs text-slate-400 mt-1">Perfect for solo PhD students and independent scholars.</p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900">
                  ${billingCycle === 'monthly' ? pricing.scholar.priceMonthly : pricing.scholar.priceYearly}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3.5 border-t border-slate-100 pt-6">
                {pricing.scholar.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={login}
              className="mt-8 w-full py-3 rounded-xl border border-slate-350 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-bold text-sm bg-white hover:bg-slate-50 transition-all"
            >
              Start Free Trial
            </button>
          </div>

          {/* Research Team Plan */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative scale-[1.01]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              Highly Recommended
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">Research Team</h3>
              <p className="text-xs text-slate-400 mt-1">Best choice for biotechnology research groups & labs.</p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-950">
                  ${billingCycle === 'monthly' ? pricing.team.priceMonthly : pricing.team.priceYearly}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3.5 border-t border-slate-100 pt-6">
                {pricing.team.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={login}
              className="mt-8 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-550/40 hover:scale-[1.01] transition-all"
            >
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">Enterprise</h3>
              <p className="text-xs text-slate-400 mt-1">Custom operations packages for universities and R&D organizations.</p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900">
                  ${billingCycle === 'monthly' ? pricing.enterprise.priceMonthly : pricing.enterprise.priceYearly}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3.5 border-t border-slate-100 pt-6">
                {pricing.enterprise.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={login}
              className="mt-8 w-full py-3 rounded-xl border border-slate-350 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-bold text-sm bg-white hover:bg-slate-50 transition-all"
            >
              Book Custom Demo
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Common Questions</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Frequently Asked Questions</p>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-250/70 rounded-xl overflow-hidden bg-slate-50 transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 text-sm hover:bg-slate-100/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="p-5 pt-0 text-xs text-slate-500 leading-relaxed border-t border-slate-200/50 bg-white">
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

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto bg-blue-600 text-white rounded-3xl p-10 sm:p-14 shadow-2xl shadow-blue-500/15">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Start Building Better Research Today</h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Replace spreadsheet mess and binder clutter. Gain confidence in your records, maintain continuous regulatory checks, and unlock breakthroughs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-bold text-sm px-6 py-3.5 shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Free Trial
            </button>
            <button
              onClick={login}
              className="inline-flex items-center justify-center rounded-xl border border-blue-400 hover:border-blue-300 text-white font-bold text-sm px-6 py-3.5 transition-all"
            >
              Book Custom Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-450 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 text-xs">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                L
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                LAB<span className="text-blue-500 font-medium">Notebook</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              LAB Notebook is the leading Digital Lab Notebook and Research ERP platform for biotechnology, materials science, and engineering teams.
            </p>
            <div className="text-slate-550 pt-2">
              © 2026 LAB Notebook Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-[10px]">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Modules</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-[10px]">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">User Manuals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API References</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-[10px]">Compliance</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">FDA 21 CFR Part 11</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SOC 2 Certification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-[10px]">Contact</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">sales@labnotebook.ai</a></li>
              <li><a href="#" className="hover:text-white transition-colors">support@labnotebook.ai</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Schedule Call</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
