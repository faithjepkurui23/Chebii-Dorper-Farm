import React, { useState } from 'react';
import { Shareholder, Sheep, Expense, Revenue, FarmSettings, SiblingId, ExpenseCategory } from '../types';
import { calculateFarmFinancials, formatCurrency } from '../utils/calculations';
import { StakeholderAvatar } from './StakeholderAvatar';
import { 
  Receipt, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Calendar, 
  Filter, 
  Trash2, 
  PieChart as PieIcon, 
  CheckCircle2,
  Tag,
  ArrowUpRight,
  Sparkles,
  Layers,
  Users,
  Edit2,
  Search,
  Check
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

interface FinanceManagerProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  revenue?: Revenue[];
  setRevenue?: React.Dispatch<React.SetStateAction<Revenue[]>>;
  shareholders: Shareholder[];
  sheep: Sheep[];
  settings: FarmSettings;
  activeSibling: SiblingId;
  showAddExpenseModal: boolean;
  setShowAddExpenseModal: (show: boolean) => void;
  showAddRevenueModal?: boolean;
  setShowAddRevenueModal?: (show: boolean) => void;
}

const GLOW_COLORS = ['#10B981', '#F59E0B', '#F97316', '#14B8A6', '#8B5CF6', '#3B82F6', '#EC4899'];

export const FinanceManager: React.FC<FinanceManagerProps> = ({
  expenses,
  setExpenses,
  revenue = [],
  setRevenue,
  shareholders,
  sheep,
  settings,
  activeSibling,
  showAddExpenseModal,
  setShowAddExpenseModal,
}) => {
  const [subTab, setSubTab] = useState<'expenses' | 'summary'>('expenses');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayer, setSelectedPayer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing states
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Safe In-App Deletion State (Replaces browser window.confirm)
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'expense';
    id: string;
    title: string;
    amount: number;
    extraInfo?: string;
  } | null>(null);

  const financials = calculateFarmFinancials(shareholders, sheep, expenses, revenue, settings);

  // Form states for Expense (Add / Edit)
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Feeds & Nutrition');
  const [expAmount, setExpAmount] = useState<number>(3500);
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expPaidBy, setExpPaidBy] = useState<SiblingId | 'farm_pool'>(activeSibling);
  const [expNotes, setExpNotes] = useState('');

  // Open Edit Expense Modal
  const handleOpenEditExpense = (exp: Expense) => {
    setEditingExpense(exp);
    setExpTitle(exp.title);
    setExpCategory(exp.category);
    setExpAmount(exp.amount);
    setExpDate(exp.date);
    setExpPaidBy(exp.paidBy as any);
    setExpNotes(exp.receiptNote || '');
    setShowAddExpenseModal(true);
  };

  // Save / Update Expense (CRUD)
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    if (editingExpense) {
      // UPDATE
      setExpenses(prev => prev.map(item => {
        if (item.id === editingExpense.id) {
          return {
            ...item,
            title: expTitle.trim(),
            category: expCategory,
            amount: Number(expAmount),
            date: expDate,
            paidBy: expPaidBy,
            receiptNote: expNotes.trim() || undefined,
          };
        }
        return item;
      }));
    } else {
      // CREATE
      const newExp: Expense = {
        id: `exp-${Date.now()}`,
        title: expTitle.trim(),
        category: expCategory,
        amount: Number(expAmount),
        date: expDate,
        paidBy: expPaidBy,
        receiptNote: expNotes.trim() || undefined,
      };
      setExpenses(prev => [newExp, ...prev]);
    }

    setShowAddExpenseModal(false);
    setEditingExpense(null);
    setExpTitle('');
    setExpNotes('');
  };

  // DELETE Expense (CRUD) - Opens in-app safe confirmation modal
  const handleDeleteExpense = (exp: Expense, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItemToDelete({
      type: 'expense',
      id: exp.id,
      title: exp.title,
      amount: exp.amount,
      extraInfo: `${exp.category} • Paid by ${getPaidByName(exp.paidBy)} on ${exp.date}`,
    });
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'expense') {
      setExpenses(prev => prev.filter(e => e.id !== itemToDelete.id));
    }
    setItemToDelete(null);
  };

  // Filters
  const filteredExpenses = expenses.filter(e => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (selectedPayer !== 'all' && e.paidBy !== selectedPayer) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchNote = (e.receiptNote || '').toLowerCase().includes(q);
      const matchCat = e.category.toLowerCase().includes(q);
      if (!matchTitle && !matchNote && !matchCat) return false;
    }
    return true;
  });

  const getPaidByName = (id: string) => {
    if (id === 'farm_pool') return 'Farm Pool Fund';
    const sibling = shareholders.find(s => s.id === id);
    return sibling ? sibling.name.split(' ')[0] : id;
  };

  const getPaidByAvatar = (id: string) => {
    if (id === 'farm_pool') return null;
    return shareholders.find(s => s.id === id);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 p-6 sm:p-7 rounded-3xl border border-emerald-500/30 text-white shadow-xl shadow-emerald-950/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-0.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 text-xs font-extrabold rounded-full border border-amber-500/40">
              Chebii Farm Financial Ledger & Records
            </span>
            <span className="text-xs text-emerald-300 font-semibold">
              Iten, Kenya • 4 Siblings (Nathan, Evans, Faith, Mercy)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Farm Expenses, Feeds & Sibling Ledgers
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
            Itemized records with full Create, Edit, and Delete controls for feeds, Rhodes grass hay, veterinary costs, and sheep acquisitions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingExpense(null);
              setExpTitle('');
              setExpNotes('');
              setExpAmount(3500);
              setShowAddExpenseModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Log Expense</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 rounded-3xl border-2 border-amber-500/50 shadow-md text-white">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Total Cash Used So Far</span>
          <div className="text-2xl font-extrabold font-serif text-white font-mono">
            {formatCurrency(financials.totalCashUsed, settings.currency)}
          </div>
          <span className="text-[11px] text-emerald-300/90 font-medium block mt-1">Dynamic Sibling Contributions</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Incurred Expenses</span>
          <div className="text-2xl font-extrabold font-serif text-amber-600 font-mono">
            {formatCurrency(financials.totalExpenses, settings.currency)}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Feeds, Vaccines, Vet & Shelter</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Feeds & Nutrition Spent</span>
          <div className="text-2xl font-extrabold font-serif text-emerald-700 font-mono">
            {formatCurrency(financials.totalFeedsExpenses, settings.currency)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Hay, concentrates & supplements</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Flock Asset Valuation</span>
          <div className="text-2xl font-extrabold font-serif text-slate-900 font-mono">
            {formatCurrency(financials.estimatedFlockAssetValue, settings.currency)}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">{sheep.length} Dorper sheep market equity</span>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'expenses', label: `Expenses & Feeds (${expenses.length})`, icon: Receipt },
          { id: 'summary', label: 'Visual 3D & Sibling Analysis', icon: PieIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Expenses Ledger with Full CRUD */}
      {subTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4">
          {/* Filters and search */}
          <div className="flex items-center justify-between flex-wrap gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search expense title, receipt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  aria-label="Filter Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Feeds & Nutrition">Feeds & Nutrition</option>
                  <option value="Vaccines & Dewormers">Vaccines & Dewormers</option>
                  <option value="Shelter, Fencing & Equipment">Shelter & Equipment</option>
                  <option value="Livestock Acquisition">Livestock Acquisition</option>
                  <option value="Veterinary Care">Veterinary Care</option>
                  <option value="Transport & Logistics">Transport</option>
                  <option value="General Farm Overhead">Overhead</option>
                </select>
              </div>

              {/* Payer Filter */}
              <select
                aria-label="Filter Payer"
                value={selectedPayer}
                onChange={(e) => setSelectedPayer(e.target.value)}
                className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
              >
                <option value="all">All Payers</option>
                {shareholders.map(s => (
                  <option key={s.id} value={s.id}>{s.name.split(' ')[0]}</option>
                ))}
                <option value="farm_pool">Farm Pool Fund</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {filteredExpenses.length} Entries • Total: <strong className="text-slate-900 font-mono">{formatCurrency(filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0), settings.currency)}</strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expense Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Paid By</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => {
                  const sibling = getPaidByAvatar(exp.paidBy);
                  return (
                    <tr key={exp.id} className="hover:bg-amber-50/20 transition-colors group">
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">{exp.date}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-800">{exp.title}</div>
                        {exp.receiptNote && <div className="text-[11px] text-slate-400">{exp.receiptNote}</div>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-slate-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {sibling ? (
                            <StakeholderAvatar shareholder={sibling} size="xs" showBadge={false} />
                          ) : null}
                          <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[11px]">
                            {getPaidByName(exp.paidBy)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(exp.amount, settings.currency)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditExpense(exp)}
                            className="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteExpense(exp, e)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Visual 3D & Sibling Analysis */}
      {subTab === 'summary' && (
        <div className="space-y-6">
          {/* Dynamic Investor Shares Row (Table + Pie Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dynamic Sibling Shares Table */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 font-serif">Investor Dynamic Shares & Equity Table</h3>
                    <p className="text-xs text-slate-500">Formula: Share % = (Investor Total / Total Cash) * 100</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingExpense(null);
                    setExpTitle('');
                    setExpAmount(2000);
                    setShowAddExpenseModal(true);
                  }}
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
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
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
                    <p className="text-xs text-slate-500">Live Dynamic Recharts Pie Chart</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Live Shares
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
                          key={`share-fin-cell-${entry.id}`} 
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
                      formatter={(value) => {
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Expense Pie Chart */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 font-serif">Expenses by Category</h3>
              <div className="h-64">
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
                        <Cell key={`c-${index}`} fill={GLOW_COLORS[index % GLOW_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2 rounded-xl border border-slate-700 shadow-lg">
                            <div className="font-bold">{payload[0].name}</div>
                            <div className="text-emerald-400 font-mono">{formatCurrency(payload[0].value, settings.currency)}</div>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sibling Financial Ledger Breakdown */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 font-serif">Sibling Financial Ledgers</h3>
              <div className="space-y-2.5">
                {shareholders.map(s => {
                  const summary = financials.siblingSummaries[s.id];
                  return (
                    <div key={s.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <StakeholderAvatar shareholder={s} size="md" showBadge={true} ringClass="ring-1 ring-slate-300" />
                        <div>
                          <div className="font-bold text-xs text-slate-900">{s.name}</div>
                          <div className="text-[10px] text-slate-500">{s.role} • {summary?.equityPercentage || s.baseEquityPercentage}% Equity</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-xs text-emerald-700 font-mono">
                          {formatCurrency(summary?.totalFinancialContribution || s.initialInvestment, settings.currency)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Spent out-of-pocket: {settings.currencySymbol} {(summary?.expensesPaidOutOfPocket || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Expense (CRUD) */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-serif text-white mb-1">
              {editingExpense ? 'Edit Farm Expense' : 'Add Farm Expense'}
            </h3>
            <p className="text-xs text-amber-400 mb-4">Record animal feeds, vaccines, shelter, or livestock costs.</p>

            <form onSubmit={handleSaveExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Bales Rhodes Grass Hay, Dewormer bottles"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="Feeds & Nutrition">Feeds & Nutrition</option>
                    <option value="Vaccines & Dewormers">Vaccines & Dewormers</option>
                    <option value="Shelter, Fencing & Equipment">Shelter & Equipment</option>
                    <option value="Livestock Acquisition">Livestock Acquisition</option>
                    <option value="Veterinary Care">Veterinary Care</option>
                    <option value="Transport & Logistics">Transport</option>
                    <option value="General Farm Overhead">Overhead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount ({settings.currencySymbol}) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-emerald-500 rounded-xl text-emerald-400 font-bold text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Paid By *</label>
                  <select
                    value={expPaidBy}
                    onChange={(e) => setExpPaidBy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    {shareholders.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role.split(' ')[0]})</option>
                    ))}
                    <option value="farm_pool">Farm Pool Funds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Receipt / Supplier Note</label>
                <input
                  type="text"
                  placeholder="e.g. Iten Agrovet, Receipt #9842"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddExpenseModal(false);
                    setEditingExpense(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe In-App Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl shadow-rose-950/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Delete {itemToDelete.type === 'expense' ? 'Expense Record' : 'Sales Record'}?
                </h3>
                <p className="text-xs text-slate-400">This record will be permanently deleted from the farm ledger.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="font-bold text-sm text-slate-100">{itemToDelete.title}</div>
              {itemToDelete.extraInfo && (
                <div className="text-[11px] text-slate-400">{itemToDelete.extraInfo}</div>
              )}
              <div className="font-mono text-emerald-400 font-bold text-sm pt-1">
                {formatCurrency(itemToDelete.amount, settings.currency)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/40 transition-colors cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
