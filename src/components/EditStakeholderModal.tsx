import React, { useState, useEffect } from 'react';
import { Shareholder, SiblingId } from '../types';
import { StakeholderAvatar } from './StakeholderAvatar';
import { 
  X, 
  Check, 
  Sparkles, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Percent, 
  Coins, 
  ListChecks, 
  HeartPulse,
  Sprout,
  Crown,
  ShieldCheck,
  Palette
} from 'lucide-react';

interface EditStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareholder: Shareholder | null;
  onSaveStakeholder: (updated: Shareholder) => void;
  onSaveAvatar?: (shareholderId: SiblingId, avatarUrl: string) => void;
}

const AVATAR_COLORS = [
  { id: 'bg-emerald-600', label: 'Emerald Green', bgClass: 'bg-emerald-600' },
  { id: 'bg-emerald-800', label: 'Forest Pine', bgClass: 'bg-emerald-800' },
  { id: 'bg-amber-600', label: 'Amber Gold', bgClass: 'bg-amber-600' },
  { id: 'bg-amber-700', label: 'Warm Copper', bgClass: 'bg-amber-700' },
  { id: 'bg-orange-600', label: 'Sunset Orange', bgClass: 'bg-orange-600' },
  { id: 'bg-rose-600', label: 'Crimson Ruby', bgClass: 'bg-rose-600' },
  { id: 'bg-indigo-600', label: 'Royal Indigo', bgClass: 'bg-indigo-600' },
  { id: 'bg-teal-600', label: 'Highland Teal', bgClass: 'bg-teal-600' },
  { id: 'bg-violet-600', label: 'Violet Velvet', bgClass: 'bg-violet-600' },
  { id: 'bg-sky-600', label: 'Ocean Blue', bgClass: 'bg-sky-600' },
  { id: 'bg-stone-700', label: 'Earth Bronze', bgClass: 'bg-stone-700' },
  { id: 'bg-slate-700', label: 'Slate Steel', bgClass: 'bg-slate-700' },
];

const AVATAR_EMBLEMS = [
  { id: 'heart', label: 'Healthcare & Vet', icon: HeartPulse, desc: 'Flock Health' },
  { id: 'coins', label: 'Finance & Records', icon: Coins, desc: 'Capital & Accounts' },
  { id: 'sprout', label: 'Feeds & Operations', icon: Sprout, desc: 'Nutrition & Pasture' },
  { id: 'sparkles', label: 'Marketing & Admin', icon: Sparkles, desc: 'Livestock Lead' },
  { id: 'crown', label: 'Founder & Partner', icon: Crown, desc: 'Executive' },
  { id: 'shield', label: 'Governance & Security', icon: ShieldCheck, desc: 'Farm Lead' },
  { id: 'user', label: 'Classic Monogram', icon: User, desc: 'Initials Only' },
];

const PRESET_ROLES = [
  'Healthcare & Operations Super User',
  'Breeding, Genetics & Flock Director',
  'Financial & Records Manager',
  'Operations & Feed Specialist',
  'Livestock Marketing & Administration Lead',
  'Managing Partner & Strategic Lead',
  'Agronomy & Nutrition Supervisor',
  'Livestock Records & Vet Coordinator',
];

export const EditStakeholderModal: React.FC<EditStakeholderModalProps> = ({
  isOpen,
  onClose,
  shareholder,
  onSaveStakeholder,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarColor, setAvatarColor] = useState('bg-emerald-600');
  const [avatarIcon, setAvatarIcon] = useState('user');
  const [initialInvestment, setInitialInvestment] = useState<string>('0');
  const [baseEquityPercentage, setBaseEquityPercentage] = useState<string>('25');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (shareholder) {
      setName(shareholder.name || '');
      setRole(shareholder.role || '');
      setEmail(shareholder.email || '');
      setPhone(shareholder.phone || '');
      setAvatarColor(shareholder.avatarColor || 'bg-emerald-600');
      setAvatarIcon(shareholder.avatarIcon || (
        shareholder.id === 'faith' ? 'heart' :
        shareholder.id === 'nathan' ? 'coins' :
        shareholder.id === 'evans' ? 'sprout' :
        shareholder.id === 'mercy' ? 'sparkles' : 'user'
      ));
      setInitialInvestment(shareholder.initialInvestment ? shareholder.initialInvestment.toString() : '0');
      setBaseEquityPercentage(shareholder.baseEquityPercentage ? shareholder.baseEquityPercentage.toString() : '25');
      
      const duties = Array.isArray(shareholder.responsibilities) 
        ? shareholder.responsibilities.join('\n') 
        : '';
      setResponsibilitiesText(duties);
      setSavedSuccess(false);
    }
  }, [shareholder, isOpen]);

  if (!isOpen || !shareholder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareholder) return;

    const respList = responsibilitiesText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const parsedInitialInv = parseFloat(initialInvestment);
    const parsedEquity = parseFloat(baseEquityPercentage);

    const updated: Shareholder = {
      ...shareholder,
      name: name.trim() || shareholder.name,
      role: role.trim() || shareholder.role,
      email: email.trim() || shareholder.email,
      phone: phone.trim() || shareholder.phone,
      avatarColor,
      avatarIcon,
      avatarUrl: undefined, // Clear any photo URL to enforce pure avatar
      initialInvestment: !isNaN(parsedInitialInv) ? parsedInitialInv : (shareholder.initialInvestment ?? 0),
      baseEquityPercentage: !isNaN(parsedEquity) ? parsedEquity : (shareholder.baseEquityPercentage ?? 25),
      responsibilities: respList.length > 0 ? respList : undefined,
    };

    onSaveStakeholder(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const previewStakeholder: Shareholder = {
    ...shareholder,
    name: name || shareholder.name,
    role: role || shareholder.role,
    avatarColor,
    avatarIcon,
    avatarUrl: undefined,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl shadow-amber-950/60 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">Member Avatar & Founder Profile</h3>
              <p className="text-xs text-amber-400 font-medium">{shareholder.name} • Chebii Family Partner</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Profile Avatar Designer Banner */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <StakeholderAvatar
              shareholder={previewStakeholder}
              size="2xl"
              showBadge={true}
              ringClass="ring-4 ring-amber-400/80 shadow-xl shadow-amber-500/20"
            />
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Live Avatar Preview
            </span>
          </div>

          <div className="flex-1 w-full space-y-3 text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Avatar Theme Color</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Select a distinctive background color for this founder:</p>
              
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setAvatarColor(c.id)}
                    title={c.label}
                    className={`h-7 rounded-xl ${c.bgClass} flex items-center justify-center border-2 transition-all cursor-pointer ${
                      avatarColor === c.id
                        ? 'border-white ring-2 ring-amber-400 scale-110 shadow-md'
                        : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {avatarColor === c.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Emblem selection */}
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Role Emblem Badge</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {AVATAR_EMBLEMS.map((emblem) => {
                  const Icon = emblem.icon;
                  const isSelected = avatarIcon === emblem.id;
                  return (
                    <button
                      type="button"
                      key={emblem.id}
                      onClick={() => setAvatarIcon(emblem.id)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/15 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-semibold truncate">{emblem.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Member Role / Title Field */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Member Role Title *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-amber-500/60 focus:border-amber-400 text-amber-300 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none"
              placeholder="e.g. Healthcare & Operations Super User, Breeding Director..."
            />

            {/* Role Preset Chips */}
            <div className="mt-2 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Quick Role Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ROLES.map((preset, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRole(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                      role === preset
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-amber-400/60 hover:text-amber-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Full Member Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-xs focus:outline-none pl-8 font-semibold"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-xs focus:outline-none pl-8"
                  placeholder="name@chebiifarm.co.ke"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Phone Contact
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-xs focus:outline-none pl-8"
                  placeholder="+254 700 000 000"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Base Equity Percentage */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Base Equity Share (%)</span>
                <Percent className="w-3.5 h-3.5 text-amber-400" />
              </label>
              <input
                type="number"
                step="any"
                min="0"
                max="100"
                value={baseEquityPercentage}
                onChange={(e) => setBaseEquityPercentage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                placeholder="Exact calculated % (e.g. 40.01, 33.22, 12.14, 14.64)"
              />
            </div>

            {/* Initial Investment */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Foundation Capital Contribution (KES)</span>
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-emerald-300 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Key Duties & Responsibilities */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Operational Duties & Responsibilities (One per line)</span>
              <ListChecks className="w-3.5 h-3.5 text-amber-400" />
            </label>
            <textarea
              rows={3}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-xs focus:outline-none resize-none leading-relaxed"
              placeholder="e.g. Overseeing livestock health & vaccine protocols&#10;Purchasing dewormers and nutritional supplements&#10;Quarterly financial auditing"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 hover:from-amber-300 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved!' : 'Save Member Avatar & Info'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
