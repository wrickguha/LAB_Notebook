import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  History,
  Lock,
  Search,
  Check,
  Save,
  Info,
  Clock
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'compliance' | 'security'
  const [searchLogQuery, setSearchLogQuery] = useState('');
  
  // Profile Forms
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution);
  const [lab, setLab] = useState(user.lab);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security Toggles
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [pinRequired, setPinRequired] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      role,
      email,
      institution,
      lab
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
    log.target.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchLogQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-10rem)]">
      
      {/* LEFT NAVIGATION PANEL */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-row lg:flex-col gap-1.5 h-fit overflow-x-auto lg:overflow-x-visible no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 hidden lg:block">Control Panel</span>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
            activeTab === 'profile' ? 'bg-blue-50 text-blue-650' : 'text-slate-550 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Investigator Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
            activeTab === 'compliance' ? 'bg-blue-50 text-blue-655' : 'text-slate-555 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Part 11 Audit Trail</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
            activeTab === 'security' ? 'bg-blue-50 text-blue-655' : 'text-slate-555 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security Preferences</span>
        </button>
      </div>

      {/* RIGHT DISPLAY PANEL */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
        
        {/* PROFILE CONFIG */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="font-bold text-slate-850 text-sm">Investigator Profile Information</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Edit research identity details that attach to electronic signature stamps.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-750">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Research Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Identity</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Affiliated Institution</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Laboratory Division</label>
                <input
                  type="text"
                  required
                  value={lab}
                  onChange={(e) => setLab(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {saveSuccess && (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 animate-bounce" /> Profile settings saved successfully!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-2.5 shadow active:scale-[0.98] transition-all"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
              </button>
            </div>
          </form>
        )}

        {/* FDA CFR PART 11 AUDIT TRAIL */}
        {activeTab === 'compliance' && (
          <div className="space-y-4 flex-1 flex flex-col animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Regulatory Audit Ledger (FDA 21 CFR Part 11)</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Automated timestamp signature logs mapping user actions, IP targets, and validation checks.</p>
              </div>

              {/* Search Log */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchLogQuery}
                  onChange={(e) => setSearchLogQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs"
                />
              </div>
            </div>

            {/* Audit Table */}
            <div className="flex-1 overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-500 uppercase tracking-widest text-[9px]">
                    <th className="p-3 w-36">Timestamp</th>
                    <th className="p-3 w-32">Investigator</th>
                    <th className="p-3 w-40">Action</th>
                    <th className="p-3">Target Node</th>
                    <th className="p-3 w-28">IP Target</th>
                    <th className="p-3 w-24 text-right">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-150 last:border-0 hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-[9px] text-slate-450">{log.timestamp}</td>
                      <td className="p-3 font-semibold text-slate-700">{log.user.split(' ')[1] || log.user}</td>
                      <td className="p-3 font-bold text-slate-800">{log.action}</td>
                      <td className="p-3 text-slate-500 truncate max-w-[150px]">{log.target}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-400">{log.ip}</td>
                      <td className="p-3 text-right">
                        <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECURITY SETTINGS PREFERENCE */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="font-bold text-slate-850 text-sm">Security Controls</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Toggle multi-factor verification settings and auto-lock parameters.</p>
            </div>

            <div className="space-y-5 border-t border-slate-100 pt-5 text-xs">
              
              {/* Toggle 1: MFA */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Two-Factor Authentication (MFA)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Requires a secure mobile verification code before editing or signing files.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    mfaEnabled ? 'bg-blue-600' : 'bg-slate-350'
                  }`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    mfaEnabled ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Toggle 2: Signature PIN requirement */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Cryptographic PIN validation</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Requests a personal 4-digit PIN before applying electronic signatures to notebook lines.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPinRequired(!pinRequired)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    pinRequired ? 'bg-blue-600' : 'bg-slate-350'
                  }`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    pinRequired ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Input: Session Timeout */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Session Timeout (minutes)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Auto-locks the browser research vault during inactivity.</p>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="bg-white border border-slate-200 text-xs rounded-lg p-1.5 font-bold text-slate-700"
                >
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
