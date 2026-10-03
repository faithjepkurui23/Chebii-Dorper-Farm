import React from 'react';
import { Shareholder, FarmSettings, SiblingId } from '../types';
import { ChebiiLogo } from './ChebiiLogo';
import { StakeholderAvatar } from './StakeholderAvatar';
import { 
  BarChart3, 
  Layers, 
  Wallet, 
  Syringe, 
  FolderOpen,
  Download, 
  MapPin, 
  Globe
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSibling: SiblingId;
  setActiveSibling: (id: SiblingId) => void;
  shareholders: Shareholder[];
  settings: FarmSettings;
  setSettings: React.Dispatch<React.SetStateAction<FarmSettings>>;
  onOpenExportModal: () => void;
  flockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeSibling,
  setActiveSibling,
  shareholders,
  settings,
  setSettings,
  onOpenExportModal,
  flockCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'flock', label: `Dorper Sheep (${flockCount})`, icon: Layers },
    { id: 'health', label: 'Vaccine & Health', icon: Syringe },
    { id: 'finance', label: 'Farm Financials', icon: Wallet },
    { id: 'gallery', label: 'Gallery & Records', icon: FolderOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md text-white border-b border-emerald-900/50 shadow-xl shadow-emerald-950/40">
      {/* Top Highland Brand & Location Ribbon with warm glow */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 text-xs px-4 py-1.5 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white">Chebii Dorper Sheep Farm</span>
            <span className="text-amber-400 font-medium text-[11px] hidden sm:inline">• Iten, Elgeyo-Marakwet (2,400m)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Active Sibling Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-300 text-[11px]">
            {(() => {
              const activeUser = shareholders.find(s => s.id === activeSibling);
              return activeUser ? <StakeholderAvatar shareholder={activeUser} size="xs" showBadge={false} /> : null;
            })()}
            <span className="text-slate-400">User:</span>
            <select
              value={activeSibling}
              onChange={(e) => setActiveSibling(e.target.value as SiblingId)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              {shareholders.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} ({s.id === 'faith' ? 'Super User' : s.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Currency selector */}
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Globe className="w-3 h-3 text-emerald-400" />
            <select
              aria-label="Currency"
              value={settings.currency}
              onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value as any }))}
              className="bg-slate-900 text-emerald-300 font-medium text-xs py-0.5 px-1.5 rounded-md border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="KES">KES (KSh)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Calligraphed Chebii Logo */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <ChebiiLogo variant="full" size="md" />
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="export-reports-btn"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title="Export CSV / PDF"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Export Reports</span>
          </button>
        </div>
      </div>
    </header>
  );
};
