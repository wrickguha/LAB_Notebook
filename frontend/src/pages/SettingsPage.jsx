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
  FileCheck2,
  KeyRound,
  Lock,
  Sparkles,
  Upload
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser } = useApp();
  const fileInputRef = useRef(null);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Principal Investigator');
  const [email, setEmail] = useState(user?.email || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [lab, setLab] = useState(user?.lab || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);

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
    if (!fullName) return 'U';
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
      setImageError('Image exceeds the 1MB limit (Current: ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB). Please choose an image under 1MB.');
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in-up">
      
      {/* Top Banner Card: Profile Overview & Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

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
                <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white text-2xl sm:text-3xl font-black tracking-tight">
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
                <Camera className="w-5 h-5 text-blue-400" />
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
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                FDA 21 CFR Part 11 Certified
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-blue-400 font-semibold">{role || 'Principal Investigator'}</span>
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition-all border border-white/10 shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
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

      {/* Main Profile Form Card */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Section Header */}
        <div className="border-b border-slate-150 pb-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
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
              Full Name <span className="text-red-500">*</span>
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
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-colors focus-ring"
              />
            </div>
            <span className="text-[10px] text-slate-400">Attached to electronic signatures and compliance logs.</span>
          </div>

          {/* Email Identity */}
          <div className="space-y-1.5">
            <label htmlFor="email-field" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Email Identity <span className="text-red-500">*</span>
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
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-colors focus-ring"
              />
            </div>
            <span className="text-[10px] text-slate-400">Used for institutional account sign-in & notifications.</span>
          </div>

          {/* Research Role */}
          <div className="space-y-1.5">
            <label htmlFor="role-field" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Research Role / Title <span className="text-red-500">*</span>
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
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-colors focus-ring"
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
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-colors focus-ring"
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
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 transition-colors focus-ring"
              />
            </div>
            <span className="text-[10px] text-slate-400">Department or specialized unit under your institutional umbrella.</span>
          </div>

        </div>

        {/* Credentials & Compliance Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-150 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Digital Ledger Stamp</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Every notebook entry signed with this identity generates a cryptographic SHA-256 validation seal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Granular RBAC</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Assigned role dictates folder creation, project review authorization, and resource sharing rights.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Profile Image Rules</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Custom photos are stored securely (&le; 1MB). Initials avatars are auto-rendered when no photo is uploaded.
            </p>
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
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Profile settings saved & synced successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold px-6 py-3 text-xs shadow-lg shadow-blue-500/20 transition-all focus-ring disabled:opacity-50 cursor-pointer"
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

    </div>
  );
}
