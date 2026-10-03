import React, { useState } from 'react';
import { Shareholder, SiblingId } from '../types';
import { ChebiiLogo } from './ChebiiLogo';
import { StakeholderAvatar } from './StakeholderAvatar';
import { Lock, KeyRound, ShieldCheck, ArrowRight, X, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareholders: Shareholder[];
  activeSibling: SiblingId;
  onLoginSuccess: (siblingId: SiblingId) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  shareholders,
  activeSibling,
  onLoginSuccess,
  isLoggedIn,
  onLogout,
}) => {
  const [selectedSibling, setSelectedSibling] = useState<SiblingId>(activeSibling || 'faith');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentSiblingObj = shareholders.find(s => s.id === selectedSibling) || shareholders[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check PIN: default is '1234' or sibling's custom pin
    const validPin = currentSiblingObj.pin || '1234';
    if (pin === validPin || pin === '1234') {
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(selectedSibling);
        setSuccess(false);
        setPin('');
        onClose();
      }, 500);
    } else {
      setError('Incorrect 4-digit PIN. Try default PIN: 1234');
    }
  };

  const handleQuickLogin = (siblingId: SiblingId) => {
    setSelectedSibling(siblingId);
    setPin('1234');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
        {/* Subtle decorative background gradient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <ChebiiLogo variant="full" size="md" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn ? (
          /* Already logged in screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-white">
                Logged in as {currentSiblingObj.name}
              </h3>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                {currentSiblingObj.role}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                You have full authorized access to the Chebii Dorper Sheep personal shareholder portal.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all"
              >
                Continue to My Portal
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setPin('');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
              >
                Switch Account / Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="pt-4 space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Sibling Shareholder Authentication</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                Sign In to Personal Portal
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Access your personal equity, reimbursed feeds/vaccine expenses, and profit dividends.
              </p>
            </div>

            {/* Sibling Quick Select Cards */}
            <div className="grid grid-cols-2 gap-2">
              {shareholders.map((s) => {
                const isSelected = selectedSibling === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleQuickLogin(s.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-slate-800 to-slate-800/90 border-emerald-500/70 ring-1 ring-emerald-500 shadow-md'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <StakeholderAvatar shareholder={s} size="sm" showBadge={false} />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-white truncate">{s.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-400 truncate">{s.role.split(' ')[0]}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Selected Sibling: <span className="text-emerald-400 font-bold">{currentSiblingObj.name}</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Enter 4-digit PIN (Default: 1234)"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Standard sibling default PIN: <strong className="text-emerald-400">1234</strong></span>
                  <button
                    type="button"
                    onClick={() => setPin('1234')}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Auto-Fill PIN
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  success
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-950/50'
                }`}
              >
                {success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Access Granted! Loading...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Access {currentSiblingObj.name.split(' ')[0]}'s Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
