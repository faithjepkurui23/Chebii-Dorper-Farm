import React, { useState, useEffect } from 'react';
import { 
  Shareholder, 
  Sheep, 
  Expense, 
  Revenue, 
  VaccinationRecord, 
  FarmSettings, 
  SiblingId 
} from '../types';
import { calculateFarmFinancials, formatCurrency } from '../utils/calculations';
import { ChebiiLogo } from './ChebiiLogo';
import { StakeholderAvatar } from './StakeholderAvatar';
import { 
  TrendingUp, 
  Layers, 
  DollarSign, 
  Plus, 
  ArrowUpRight, 
  ShieldCheck, 
  HeartPulse, 
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Camera,
  Scale,
  Receipt,
  Users,
  PieChart as PieIcon,
  BarChart2,
  ChevronRight,
  Activity,
  Edit3,
  CloudSun,
  Droplets,
  Wind,
  Zap,
  Palette
} from 'lucide-react';
import { fetchItenWeather, ItenWeatherData } from '../services/freeApis';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DashboardOverviewProps {
  shareholders: Shareholder[];
  sheep: Sheep[];
  expenses: Expense[];
  revenue: Revenue[];
  vaccinations: VaccinationRecord[];
  settings: FarmSettings;
  activeSibling: SiblingId;
  onNavigate: (tab: string) => void;
  onOpenAddExpense: () => void;
  onOpenAddRevenue: () => void;
  onOpenAddSheep: () => void;
  onOpenStakeholderModal: (shareholder: Shareholder) => void;
  onOpenEditAvatarModal: (shareholder: Shareholder) => void;
  onOpenEditSheepModal: (sheep: Sheep) => void;
  onToggleVaccineStatus: (id: string) => void;
}

const GLOW_COLORS = ['#10B981', '#F59E0B', '#F97316', '#14B8A6', '#8B5CF6', '#3B82F6'];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  shareholders,
  sheep,
  expenses,
  revenue,
  vaccinations,
  settings,
  activeSibling,
  onNavigate,
  onOpenAddExpense,
  onOpenAddRevenue,
  onOpenAddSheep,
  onOpenStakeholderModal,
  onOpenEditAvatarModal,
  onOpenEditSheepModal,
  onToggleVaccineStatus,
}) => {
  const financials = calculateFarmFinancials(shareholders, sheep, expenses, revenue, settings);
  const totalFlockWeight = sheep.reduce((sum, s) => sum + s.currentWeightKg, 0);

  // Live Free Open-Meteo Highland Weather State
  const [weather, setWeather] = useState<ItenWeatherData | null>(null);

  useEffect(() => {
    fetchItenWeather()
      .then(data => setWeather(data))
      .catch(err => console.info('Weather fetch error handled:', err));
  }, []);

  // Data for 3D Bar chart of contributions
  const siblingContributionData = shareholders.map(s => {
    const summary = financials.siblingSummaries[s.id];
    return {
      name: s.name.split(' ')[0],
      fullName: s.name,
      initial: s.initialInvestment,
      expenses: summary?.expensesPaidOutOfPocket || 0,
      total: summary?.totalFinancialContribution || 0,
      role: s.role.split(' ')[0],
    };
  });

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-amber-500/40 text-white text-xs p-3 rounded-2xl shadow-xl shadow-slate-950/60 backdrop-blur-sm">
          <div className="font-bold text-amber-300 mb-1.5">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5 text-xs">
              <span className="font-medium text-slate-300">{entry.name}:</span>
              <span className="font-bold font-mono text-emerald-400">
                {formatCurrency(entry.value, settings.currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Highland Farm Banner with Green & Glowing Yellow / Orange Atmosphere */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 text-white shadow-2xl shadow-emerald-950/30 relative overflow-hidden">
        {/* Glowing atmospheric circles */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Chebii Family Dorper Sheep Farm</span>
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Iten, Elgeyo-Marakwet (2,400m)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              Flock Growth, Health & Shared Finances
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              We believe that true farming is built on patience, teamwork, and care for every animal. As farmers, we believe in growing together, feeding Kenya with quality, and leaving the land better than we found it.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAddExpense}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-2xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add My Expense</span>
            </button>
            <button
              onClick={onOpenAddSheep}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl border border-emerald-400/40 shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>+ Add Dopa Sheep</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE HIGHLAND WEATHER & DORPER GRAZING ADVICE CARD (100% Free Open API) */}
      {weather && (
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
              <CloudSun className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  Iten Highland Climate: {weather.condition}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {weather.elevation}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                <span className="font-semibold text-amber-300">Flock Grazing Tip: </span>
                {weather.livestockAdvice}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <span className="text-slate-400">Temp:</span>
              <span className="font-bold text-amber-400 font-mono">{weather.temperature}°C</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">Humidity:</span>
              <span className="font-bold text-sky-300 font-mono">{weather.humidity}%</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 hidden sm:flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Wind:</span>
              <span className="font-bold text-emerald-300 font-mono">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      )}

      {/* 4 STAKEHOLDERS FOUNDERS SECTION (Clickable + Super User Photo Edit) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">Farm Stakeholders & Investor Shares</h2>
              <p className="text-xs text-slate-500">Click any stakeholder to view their itemized cash breakdown and expense records.</p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            Total Cash: {formatCurrency(financials.totalCashUsed, settings.currency)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shareholders.map((shareholder) => {
            const summary = financials.siblingSummaries[shareholder.id];
            const totalInvested = summary?.totalFinancialContribution || 0;
            const equityPct = summary?.equityPercentage || shareholder.baseEquityPercentage;
            const isSuperUser = shareholder.id === 'faith';

            return (
              <div
                key={shareholder.id}
                onClick={() => onOpenStakeholderModal(shareholder)}
                className="group relative bg-white hover:bg-gradient-to-b hover:from-white hover:to-amber-50/50 p-4 rounded-3xl border-2 border-slate-200 hover:border-amber-400/80 shadow-md hover:shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer duration-200"
              >
                {/* Top header row inside card */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    Member #{shareholder.id.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isSuperUser && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                        Super User
                      </span>
                    )}
                    <button
                      type="button"
                      title={`Edit ${shareholder.name}'s role, duties and profile`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditAvatarModal(shareholder);
                      }}
                      className="p-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer hover:scale-105"
                    >
                      <Edit3 className="w-3 h-3 text-amber-600" />
                      <span>Edit Role</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  {/* Stakeholder Avatar with Palette Edit Button */}
                  <div className="relative shrink-0">
                    <StakeholderAvatar
                      shareholder={shareholder}
                      size="xl"
                      showBadge={true}
                      ringClass="ring-2 ring-emerald-500 shadow-md shadow-emerald-500/20 group-hover:ring-amber-400 transition-all"
                    />
                    {/* Customize Avatar / Role button */}
                    <button
                      type="button"
                      title={`Customize ${shareholder.name}'s avatar & role`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditAvatarModal(shareholder);
                      }}
                      className="absolute -bottom-1.5 -right-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Palette className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                      {shareholder.name}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold truncate">{shareholder.role}</p>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5 font-mono">
                      {equityPct}% Share
                    </span>
                  </div>
                </div>

                {/* Financial highlight */}
                <div className="bg-slate-50 group-hover:bg-amber-100/50 p-2.5 rounded-2xl border border-slate-100 group-hover:border-amber-200 transition-colors space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Total Cash Invested:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {settings.currencySymbol} {totalInvested.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Share % of Total:</span>
                    <span className="font-bold text-amber-700 font-mono">
                      {equityPct}%
                    </span>
                  </div>
                </div>

                {/* View Details Hint */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-emerald-600 font-bold group-hover:text-amber-700">
                  <span>View Breakdown & Ledger</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE FINANCIAL SCORECARDS (Including Dynamic Total Cash Used Card) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dynamic Card 1: Total Cash Used So Far */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4 sm:p-5 rounded-3xl border-2 border-amber-500/50 shadow-lg shadow-amber-950/20 text-white relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300">Total Cash Used So Far</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(financials.totalCashUsed, settings.currency)}
          </div>
          <p className="text-[11px] text-emerald-300/90 mt-1 font-medium">
            Dynamic total across all 4 sibling contributions
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Cumulative Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(financials.totalExpenses, settings.currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Feeds, vet, shelter & purchases</p>
        </div>

        {/* Live Flock Asset Valuation */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Flock Asset Valuation</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
            {formatCurrency(financials.estimatedFlockAssetValue, settings.currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{sheep.length} Dorpers live market value</p>
        </div>

        {/* Total Farm Net Worth */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-4 sm:p-5 rounded-3xl border border-emerald-500/40 text-white shadow-lg shadow-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-300">Total Farm Net Worth</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {formatCurrency(financials.totalFarmNetWorth, settings.currency)}
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">Flock assets + Cash balance + Infra</p>
        </div>
      </div>

      {/* DYNAMIC SHARES TABLE & DYNAMIC PIE CHART ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Sibling Shares Table */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif">Investor Shares & Equity Table</h3>
                <p className="text-xs text-slate-500">Live dynamic calculation: Share % = (Investor Total / Total Cash) * 100</p>
              </div>
            </div>
            <button
              onClick={onOpenAddExpense}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              + Add Investment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Investor</th>
                  <th className="py-2.5 px-3 text-right">Total Invested</th>
                  <th className="py-2.5 px-3 text-right">Share %</th>
                  <th className="py-2.5 px-3 text-center">Entries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {financials.investorShares.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-sans">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full shrink-0`} style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      {formatCurrency(item.totalInvested, settings.currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-700">
                      {item.sharePercentage.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-500">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <tr>
                  <td className="py-2.5 px-3 text-slate-900 font-sans">TOTAL CASH USED</td>
                  <td className="py-2.5 px-3 text-right text-emerald-800 font-mono">
                    {formatCurrency(financials.totalCashUsed, settings.currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-800 font-mono">100.00%</td>
                  <td className="py-2.5 px-3 text-center text-slate-600 font-mono">
                    {financials.investorShares.reduce((s, i) => s + i.count, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Dynamic Pie Chart for Shares (using recharts) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif">Investor Shares Distribution</h3>
                <p className="text-xs text-slate-500">Dynamic Pie Chart updating live with investments</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Recharts
            </span>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financials.investorShares}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="totalInvested"
                  nameKey="name"
                >
                  {financials.investorShares.map((entry) => (
                    <Cell 
                      key={`share-cell-${entry.id}`} 
                      fill={entry.color} 
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-amber-500/40 text-white text-xs p-3 rounded-2xl shadow-xl backdrop-blur-sm">
                        <div className="font-bold text-amber-300 mb-1">{data.name}</div>
                        <div className="flex items-center justify-between gap-4 py-0.5">
                          <span className="text-slate-300">Total Invested:</span>
                          <span className="font-bold font-mono text-emerald-400">
                            {formatCurrency(data.totalInvested, settings.currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-0.5">
                          <span className="text-slate-300">Share %:</span>
                          <span className="font-bold font-mono text-amber-400">
                            {data.sharePercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value, entry: any) => {
                    const item = financials.investorShares.find(i => i.name === value);
                    return (
                      <span className="text-xs font-semibold text-slate-700">
                        {value}: {item?.sharePercentage.toFixed(1)}%
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3D CHARTS & VISUAL ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Glowing Pie Chart: Expense Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif">Expenses by Category</h3>
                <p className="text-xs text-slate-500">Distribution of all operational & capital costs</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
            >
              View Ledger
            </button>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financials.categoryExpenses}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {financials.categoryExpenses.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GLOW_COLORS[index % GLOW_COLORS.length]} 
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3D Bar Chart: Sibling Capital & Out-of-Pocket Expense Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif">Sibling Financial Contributions</h3>
                <p className="text-xs text-slate-500">Initial capital vs out-of-pocket project spending</p>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={siblingContributionData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs font-medium text-slate-700">{value === 'initial' ? 'Start Capital (KES 35k)' : 'Out-of-Pocket Spent'}</span>}
                />
                <Bar dataKey="initial" fill="#10B981" radius={[6, 6, 0, 0]} name="Start Capital" />
                <Bar dataKey="expenses" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Out-of-Pocket Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DOPA SHEEP LIVE PROGRESS & VACCINE TIMETABLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4 Dopa Sheep Growth & Photo Snapshot (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif">Dopa Flock Snapshot ({sheep.length} Dorpers)</h3>
                <p className="text-xs text-slate-500">Live weights and photos of Kalya, Terter, Tui Kel & Lel Kel</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('flock')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage Flock</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sheep Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {sheep.map((s) => (
              <div
                key={s.id}
                onClick={() => onOpenEditSheepModal(s)}
                className="bg-slate-50 hover:bg-emerald-50/50 p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500/60 transition-all cursor-pointer flex items-center gap-3 group"
              >
                <div className="relative shrink-0">
                  {s.photoUrl ? (
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/60 group-hover:ring-amber-400 transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <Layers className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-xs">
                    <Camera className="w-2.5 h-2.5" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-800">
                      {s.name}
                    </span>
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {s.tagId}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{s.breed} • {s.gender}</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {s.currentWeightKg} kg
                    </span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                      {s.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccine & Dewormer Timetable Quick Checklist */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif">Vaccine Timetable</h3>
                <p className="text-xs text-slate-500">Check completed treatments</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('health')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
            >
              Full Schedule
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {vaccinations.slice(0, 5).map((vac) => {
              const isCompleted = vac.status === 'Completed';
              return (
                <div
                  key={vac.id}
                  onClick={() => onToggleVaccineStatus(vac.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-xs'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs truncate">{vac.treatmentName}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{vac.sheepTag || 'Flock-wide'} • Due: {vac.nextDueDate || vac.dateAdministered}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVaccineStatus(vac.id);
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border-2 border-amber-500 text-transparent hover:border-amber-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('health')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors mt-auto text-center"
          >
            Open Health & Vaccine Manager
          </button>
        </div>
      </div>
    </div>
  );
};
