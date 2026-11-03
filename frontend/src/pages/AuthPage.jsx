import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  KeyRound,
  Fingerprint
} from 'lucide-react';

let turnstileScriptPromise;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => {
        if (window.turnstile) {
          resolve(window.turnstile);
        } else {
          turnstileScriptPromise = null;
          reject(new Error('Security verification could not be loaded. Please try again.'));
        }
      };
      script.onerror = () => {
        turnstileScriptPromise = null;
        reject(new Error('Security verification could not be loaded. Please try again.'));
      };
      document.head.appendChild(script);
    });
  }

  return turnstileScriptPromise;
}

export default function AuthPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const captchaSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const captchaContainerRef = useRef(null);
  const captchaWidgetIdRef = useRef(null);
  const pendingCaptchaRef = useRef(null);

  // Tab state ('signin' | 'signup')
  const [activeTab, setActiveTab] = useState(searchParams.get('signup') === 'true' ? 'signup' : 'signin');

  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Principal Investigator');
  const [institution, setInstitution] = useState('');
  const [lab, setLab] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const settleCaptcha = (error, token) => {
    const pending = pendingCaptchaRef.current;
    if (!pending) return;

    window.clearTimeout(pending.timeout);
    pendingCaptchaRef.current = null;
    if (error) {
      pending.reject(error);
    } else {
      pending.resolve(token);
    }
  };

  const requestCaptchaToken = async () => {
    if (!captchaSiteKey) return undefined;

    const turnstile = await loadTurnstile();
    if (!captchaContainerRef.current) {
      throw new Error('Security verification is unavailable. Please try again.');
    }

    if (captchaWidgetIdRef.current === null) {
      captchaWidgetIdRef.current = turnstile.render(captchaContainerRef.current, {
        sitekey: captchaSiteKey,
        size: 'invisible',
        callback: (token) => settleCaptcha(null, token),
        'error-callback': () => settleCaptcha(new Error('Security verification failed. Please try again.')),
        'expired-callback': () => settleCaptcha(new Error('Security verification expired. Please try again.')),
      });
    }

    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(
        () => settleCaptcha(new Error('Security verification timed out. Please try again.')),
        15000
      );
      pendingCaptchaRef.current = { resolve, reject, timeout };
      try {
        turnstile.execute(captchaWidgetIdRef.current);
      } catch (error) {
        settleCaptcha(error);
      }
    });
  };

  // Sync tab with URL parameters
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
      setValidationError('Email address is required.');
      return;
    }
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid institutional email address.');
      return;
    }
    if (!password || (activeTab === 'signup' && password.length < 8)) {
      setValidationError(activeTab === 'signup'
        ? 'Password must be at least 8 characters.'
        : 'Password is required.');
      return;
    }

    if (activeTab === 'signup') {
      if (!name.trim()) {
        setValidationError('Full Name is required for electronic records.');
        return;
      }
    }

    setLoading(true);
    try {
      const captchaToken = await requestCaptchaToken();
      if (activeTab === 'signup') {
        await login({
          signup: true,
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          institution: institution.trim(),
          lab: lab.trim(),
          captchaToken,
        });
      } else {
        await login({
          signup: false,
          email: email.trim(),
          password,
          captchaToken,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setValidationError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      if (captchaWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(captchaWidgetIdRef.current);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row blueprint-grid relative overflow-x-clip font-sans">
      
      {/* Ambient background blur */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* LEFT COLUMN: Auth Form Area */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 bg-white/90 backdrop-blur-xl border-r border-slate-200/80 shadow-2xl min-h-screen">
        
        {/* Header/Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => navigate('/')}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 shadow-md shadow-teal-500/20 text-white font-extrabold text-lg tracking-tight">
            I
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            Inveniq<span className="text-teal-600 font-semibold">Lab</span>
          </span>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-7">
          
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'signin' ? 'Sign in to your lab' : 'Create investigator account'}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {activeTab === 'signin'
                ? 'Enter your institutional credentials to access your active experiment ledgers.'
                : 'Create an account for saved research notes, project tracking, and scientific calculators.'}
            </p>
          </div>

          {/* Segmented Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/70 relative">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setValidationError('');
              }}
              className={`flex-1 min-h-11 text-center py-2 rounded-xl text-xs font-bold transition-all relative z-10 cursor-pointer ${
                activeTab === 'signin' ? 'text-teal-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setValidationError('');
              }}
              className={`flex-1 min-h-11 text-center py-2 rounded-xl text-xs font-bold transition-all relative z-10 cursor-pointer ${
                activeTab === 'signup' ? 'text-teal-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register Account
            </button>

            {/* Sliding highlight */}
            <motion.div
              layoutId="authTabSlider"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute top-1 bottom-1 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-slate-200/60"
              style={{
                left: activeTab === 'signin' ? '4px' : 'calc(50% + 2px)'
              }}
            />
          </div>

          {/* Validation Alert */}
          <AnimatePresence mode="wait">
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 font-medium"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
            {captchaSiteKey && <div ref={captchaContainerRef} aria-hidden="true" />}
            
            {activeTab === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label htmlFor="full-name" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1 tracking-wider">
                    Full Name & Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      id="full-name"
                      autoComplete="name"
                      required
                      placeholder="e.g. Dr. Wrick Guha"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-base text-slate-800 focus-ring font-medium"
                    />
                  </div>
                </div>

                {/* Role / Title */}
                <div>
                  <label htmlFor="lab-role" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1 tracking-wider">
                    Laboratory Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      id="lab-role"
                      autoComplete="organization-title"
                      placeholder="e.g. Principal Investigator, Postdoc, Senior Scientist"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-base text-slate-800 focus-ring font-medium"
                    />
                  </div>
                </div>

                {/* Institution & Lab Wing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="institution" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1 tracking-wider">
                      Institution
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        id="institution"
                        autoComplete="organization"
                        placeholder="e.g. Harvard / Max Planck"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-base text-slate-800 focus-ring font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lab-division" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1 tracking-wider">
                      Lab Division
                    </label>
                    <div className="relative">
                      <Beaker className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        id="lab-division"
                        placeholder="e.g. Genomics Wing"
                        value={lab}
                        onChange={(e) => setLab(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-base text-slate-800 focus-ring font-medium"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1 tracking-wider">
                Institutional Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  inputMode="email"
                  required
                  placeholder="scientist@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-base text-slate-800 focus-ring font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Password <span className="text-rose-500">*</span>
                </label>
                {activeTab === 'signin' && (
                  <button
                    type="button"
                    className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer"
                    onClick={() => setValidationError('Please contact your institutional lab admin to reset credentials.')}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                  minLength={activeTab === 'signup' ? 8 : undefined}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-base text-slate-800 focus-ring font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full min-h-11 inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 shadow-md shadow-teal-500/20 active:scale-[0.99] transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed text-xs cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>{activeTab === 'signin' ? 'Sign In to Workspace' : 'Initialize Lab Account'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              )}
            </button>

          </form>

        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400 pt-4 space-y-2">
          <p>Your account activity and research records are protected by session-based access controls.</p>
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="text-teal-600 hover:underline font-bold cursor-pointer"
          >
            ← Return to public website
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive High-Tech Showcase */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden dark-science-grid">
        
        {/* Ambient bioluminescent glows */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header Tag */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Console Box */}
        <div className="my-auto max-w-lg w-full mx-auto rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500/80" />
              <span className="ml-2 font-mono text-[10px] text-slate-400">SIGNATURE_ENGINE.sh</span>
            </div>
            <span className="text-[9px] font-mono text-teal-400 font-bold bg-teal-950/80 border border-teal-800 px-2 py-0.5 rounded">
              WORKFLOW PREVIEW
            </span>
          </div>

          <div className="font-mono text-[11px] text-slate-300 space-y-2 leading-relaxed">
            <p className="text-teal-400">&gt; establishing mutual TLS v1.3 handshake...</p>
            <p className="text-slate-400">&gt; hashing SHA-256 ledger checksum: <span className="text-white">e3b0c442...98fc</span></p>
            <p className="text-emerald-400">&gt; example signing workflow preview.</p>
          </div>

          {/* Visual Certificate Card */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-400">LEDGER HASH CHAIN</span>
              <span className="text-emerald-400 font-bold">SAMPLE RECORD</span>
            </div>
            <div className="h-0.5 bg-white/10 w-full" />
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">CRISPR Exon Excision Protocol</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Example record - no signature stored</div>
              </div>
              <div className="h-8 w-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Audit Trail</span>
              <div className="text-sm font-bold text-white font-mono mt-0.5">Per-user records</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Document Fingerprint</span>
              <div className="text-sm font-bold text-teal-400 font-mono mt-0.5">SHA-256</div>
            </div>
          </div>

        </div>

        {/* Bottom Tagline */}
        <div className="text-center text-[11px] text-slate-500 font-mono tracking-wider z-10">
          TRUSTED BY LEADING BIOTECH CLUSTERS, ACADEMIC INSTITUTES & CROs GLOBALLY
        </div>

      </div>

    </div>
  );
}
