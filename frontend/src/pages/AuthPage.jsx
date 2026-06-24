import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Beaker,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AuthPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Tab state ('signin' | 'signup')
  const [activeTab, setActiveTab] = useState(searchParams.get('signup') === 'true' ? 'signup' : 'signin');

  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Principal Investigator');
  const [institution, setInstitution] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync tab with query parameters if they change
  useEffect(() => {
    const isSignup = searchParams.get('signup') === 'true';
    setActiveTab(isSignup ? 'signup' : 'signin');
  }, [searchParams]);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email) {
      setValidationError('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (activeTab === 'signup') {
      if (!name) {
        setValidationError('Full Name is required.');
        return;
      }
      if (!institution) {
        setValidationError('Institution / Laboratory is required.');
        return;
      }
    }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        await login({
          signup: true,
          name,
          email,
          password,
          role,
          institution,
          lab: `${name.split(' ').pop() || 'Thorne'} Genomics Lab`
        });
      } else {
        await login({
          signup: false,
          email,
          password
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setValidationError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row blueprint-grid relative overflow-hidden">

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* LEFT COLUMN: Auth Form Area */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-10 z-10 bg-white/80 backdrop-blur-md border-r border-slate-200/50 shadow-2xl min-h-screen">

        {/* Header/Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20 text-white font-extrabold text-lg">
            L
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            LAB<span className="text-blue-600 font-medium">Notebook</span>
          </span>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-8">

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'signin' ? 'Sign In to Workspace' : 'Create Researcher Account'}
            </h1>
            <p className="text-xs text-slate-450 leading-normal">
              {activeTab === 'signin'
                ? 'Enter your institutional credentials to load compliance dashboards.'
                : 'Get started with compliant R&D logs, project checksheets, and calculation ledgers.'}
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 relative">
            <button
              onClick={() => {
                setActiveTab('signin');
                setValidationError('');
              }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 focus-ring ${activeTab === 'signin' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setValidationError('');
              }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 focus-ring ${activeTab === 'signup' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Create Account
            </button>

            {/* Sliding Tab Highlight */}
            <motion.div
              layoutId="auth-tab-highlight"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-12px)] bg-white rounded-xl shadow-sm border border-slate-200/50"
              style={{
                left: activeTab === 'signin' ? '6px' : 'calc(50% + 6px)'
              }}
            />
          </div>

          {/* Validation Alert */}
          <AnimatePresence mode="wait">
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 bg-red-50 border border-red-150 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 font-medium shadow-xs"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fields Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-750">

            {activeTab === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1.5 tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. Wrick Guha"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1.5 tracking-wider">Institution / Laboratory</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Institute of Biomolecular Sciences"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1.5 tracking-wider">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Principal Investigator"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus-ring"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1.5 tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@labnotebook.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus-ring"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider">Password</label>
                {activeTab === 'signin' && (
                  <button
                    type="button"
                    className="text-[9px] text-blue-600 font-extrabold hover:underline"
                    onClick={() => alert('Forgot password features are deactivated in mock view.')}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-12 text-xs text-slate-800 focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 p-1 text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  {activeTab === 'signin' ? 'Sign In to Workspace' : 'Register Account'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              )}
            </button>
          </form>

        </div>

        {/* Back Link */}
        <div className="text-center text-[10px] text-slate-400 pt-4">
          By authenticating, you agree to our 21 CFR Part 11 electronic records protocols.
          <div className="mt-2.5">
            <button onClick={() => navigate('/')} className="text-blue-650 hover:underline font-bold">
              ← Return to landing page
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Visual Feature Accent Showcase */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Tiny Console Graphic Accent */}
        <div className="border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md p-6 max-w-lg mx-auto my-auto space-y-6 shadow-2xl relative">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-4 text-[10px] text-white/40">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 font-mono text-[9px]">COMPLIANCE_SIGNER_SHELL.sh</span>
          </div>

          <div className="space-y-4 font-mono text-[10px] text-white/70 leading-relaxed">
            <p className="text-blue-450">&gt; verifying security certificates...</p>
            <p className="text-emerald-450">&gt; SHA-256 signature chain validated successfully</p>
            <p>&gt; SECURE FDA 21 CFR PART 11 REGISTER ACTIVE</p>

            {/* Visual representation card */}
            <div className="border border-white/10 rounded-xl bg-slate-900/90 p-4 space-y-2 text-white text-xs">
              <div className="flex justify-between items-center text-[10px] font-black text-white/50">
                <span>PROJECT LEDGER ID</span>
                <span className="text-emerald-400 font-bold">COMPLIANT</span>
              </div>
              <div className="h-0.5 bg-white/15 w-full my-1.5" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold">HEK293T Cloning Sequence</div>
                  <div className="text-[9px] text-white/40 mt-0.5">Author: Dr. Evelyn Thorne</div>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 font-extrabold text-xs">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Trust Tag */}
        <div className="text-center text-[10px] text-white/40 tracking-wider font-semibold">
          TRUSTED BY LEADING CLINICAL RESEARCH GROUPS AND UNIVERSITIES GLOBALLY.
        </div>

      </div>

    </div>
  );
}
