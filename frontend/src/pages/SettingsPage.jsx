import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building,
  Beaker,
  Briefcase,
  Mail,
  Camera,
  Trash2,
  Check,
  Save,
  ShieldCheck,
  AlertCircle,
  Upload,
  Lock,
  FileCheck2,
  Database,
  Search,
  KeyRound,
  Fingerprint,
  FileText,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser, auditLogs } = useApp();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'compliance' | 'preferences'
  const [auditFilter, setAuditFilter] = useState('');

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Principal Investigator');
  const [email, setEmail] = useState(user?.email || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [lab, setLab] = useState(user?.lab || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);

  // System Preference States
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [requireDualAuth, setRequireDualAuth] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // UI Feedback States
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageError, setImageError] = useState('');

  // Sync state when user object loads or updates
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole(user.role || 'Principal Investigator');
      setEmail(user.email || '');
      setInstitution(user.institution || '');
      setLab(user.lab || '');
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const getInitials = (fullName) => {
    if (!fullName) return 'PI';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const handleImageUpload = (e) => {
    setImageError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict 1MB size limit check (1024 * 1024 = 1,048,576 bytes)
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setImageError(`Image exceeds the 1MB limit (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB). Please choose an image under 1MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check valid image type
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WebP, GIF).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
      setImageError('');
    };
    reader.onerror = () => {
      setImageError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSaving(true);

    try {
      await setUser({
        name,
        role,
        email,
        institution,
        lab,
        avatar: avatar || null,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLogs = (auditLogs || []).filter((log) => {
    if (!auditFilter) return true;
    const q = auditFilter.toLowerCase();
    return (
      (log.action || '').toLowerCase().includes(q) ||
      (log.target || '').toLowerCase().includes(q) ||
      (log.user || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in-up">
      {/* Top Banner Card: Profile Overview & Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Area with Upload Trigger */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-white/10 shadow-2xl bg-slate-800 flex items-center justify-center relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || 'Investigator'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 flex items-center justify-center text-white text-2xl sm:text-3xl font-black tracking-tight font-mono">
                  {getInitials(name)}
                </div>
              )}

              {/* Hover overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
                title="Upload custom profile photo"
              >
                <Camera className="w-5 h-5 text-teal-300" />
                <span>Upload</span>
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Identity Title & Actions */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {name || 'Investigator Profile'}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                <ShieldCheck className="w-3 h-3" />
                FDA 21 CFR Part 11 Certified
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-teal-400 font-semibold">{role || 'Principal Investigator'}</span>
              {institution && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">{institution}</span>
                </>
              )}
              {lab && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{lab}</span>
                </>
              )}
            </p>

            {/* Avatar Management Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition-all border border-white/10 shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-teal-300" />
                Upload Photo (&lt; 1MB)
              </button>

              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold backdrop-blur transition-all border border-red-500/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Photo
                </button>
              )}
            </div>

            {/* Image Error Alert */}
            {imageError && (
              <p className="text-[11px] text-red-400 font-semibold mt-2 flex items-center justify-center sm:justify-start gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {imageError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          Scientist Profile & Credentials
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'compliance'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          21 CFR Part 11 Audit Trail ({auditLogs?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'preferences'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Security & Preferences
        </button>
      </div>

      {/* Tab 1: Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
          <div className="border-b border-slate-150 pb-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              Researcher Credentials & Settings
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Update your scientific identity, academic affiliations, laboratory division, and compliance information.
            </p>
          </div>

          {/* Global Form Error */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name-field" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Full Name <span className="text-teal-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="name-field"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Wrick Guha"
                  className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-teal-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-all focus-ring"
                />
              </div>
              <span className="text-[10px] text-slate-400">Attached to electronic signatures and compliance logs.</span>
            </div>

            {/* Email Identity */}
            <div className="space-y-1.5">
              <label htmlFor="email-field" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Email Identity <span className="text-teal-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email-field"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@inveniqlab.ai"
                  className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-teal-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-all focus-ring"
                />
              </div>
              <span className="text-[10px] text-slate-400">Used for institutional account sign-in & notifications.</span>
            </div>

            {/* Research Role */}
            <div className="space-y-1.5">
              <label htmlFor="role-field" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Research Role / Title <span className="text-teal-600">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="role-field"
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Principal Investigator, Senior Scientist, PhD Scholar"
                  className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-teal-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-all focus-ring"
                />
              </div>
              <span className="text-[10px] text-slate-400">Designation displayed in team projects and shared reports.</span>
            </div>

            {/* Affiliated Institution */}
            <div className="space-y-1.5">
              <label htmlFor="institution-field" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Affiliated Institution / University
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="institution-field"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Institute of Biomolecular Sciences, Harvard Medical School"
                  className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-teal-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-all focus-ring"
                />
              </div>
              <span className="text-[10px] text-slate-400">Your university, research hospital, or biotech entity.</span>
            </div>

            {/* Laboratory Division */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="lab-field" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Laboratory Division / Research Wing
              </label>
              <div className="relative">
                <Beaker className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="lab-field"
                  type="text"
                  value={lab}
                  onChange={(e) => setLab(e.target.value)}
                  placeholder="e.g. Thorne Genomics & Gene Delivery Lab"
                  className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-teal-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-all focus-ring"
                />
              </div>
              <span className="text-[10px] text-slate-400">Department or specialized unit under your institutional umbrella.</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs"
                  >
                    <Check className="w-4 h-4 text-teal-600 shrink-0" />
                    Profile settings saved & synced successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 active:scale-[0.98] text-white font-bold px-6 py-3 text-xs shadow-md shadow-teal-700/20 transition-all focus-ring disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: 21 CFR Part 11 Regulatory & Audit Trail */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Certificate Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Regulatory Audit Log & Compliance Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    Compliant with Title 21 of the Code of Federal Regulations Part 11 (Electronic Records & Signatures)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Tamper-Evident Active
                </span>
              </div>
            </div>

            {/* Audit Search Bar */}
            <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter audit events by action, target, or user..."
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-all focus-ring"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                {filteredLogs.length} audit trail records recorded
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="mt-4 border border-slate-200/90 rounded-2xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No compliance audit logs matched your query.
                  </div>
                ) : (
                  filteredLogs.map((log, idx) => (
                    <div
                      key={log.id || idx}
                      className="p-3.5 sm:px-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-800">
                            {log.action}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Target: <span className="font-mono text-slate-700 font-semibold">{log.target || 'System Object'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono sm:text-right">
                        <span>{log.user || user?.name || 'Authorized Investigator'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-150 pb-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-teal-600" />
              Security & Regulatory Governance
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure session auto-lock parameters, cryptographic verification gates, and automated notifications.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Session Auto-lock */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <div className="font-bold text-slate-800 text-sm">Session Inactivity Auto-Lock</div>
                <div className="text-slate-500 text-xs mt-0.5">
                  Required under 21 CFR § 11.10(d) to prevent unauthorized bench terminal tampering.
                </div>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer focus-ring"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            {/* Dual Factor E-Sign Verification */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <div className="font-bold text-slate-800 text-sm">Require Password on Every E-Signature</div>
                <div className="text-slate-500 text-xs mt-0.5">
                  Enforces dual-component identification for notebook locking and milestone approvals.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRequireDualAuth(!requireDualAuth)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  requireDualAuth ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    requireDualAuth ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Email Alerts */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <div className="font-bold text-slate-800 text-sm">Protocol Modification Notifications</div>
                <div className="text-slate-500 text-xs mt-0.5">
                  Receive instant notifications whenever a team member requests approval or edits shared assets.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  emailAlerts ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    emailAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
