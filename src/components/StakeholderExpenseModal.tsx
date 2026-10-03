import React from 'react';
import { Shareholder, Expense, FarmSettings } from '../types';
import { StakeholderAvatar } from './StakeholderAvatar';
import { 
  X, 
  Receipt, 
  Plus, 
  Calendar, 
  Tag, 
  PieChart as PieIcon, 
  TrendingUp, 
  ExternalLink,
  ShieldCheck, 
  ArrowUpRight,
  Edit3,
  Mail,
  Phone,
  ListChecks
} from 'lucide-react';

interface StakeholderExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareholder: Shareholder | null;
  expenses: Expense[];
  settings?: FarmSettings;
  currencySymbol?: string;
  onOpenAddExpenseForSibling?: (siblingId: string) => void;
  onViewFullLedger?: (siblingId: string) => void;
  onOpenEditMemberModal?: (shareholder: Shareholder) => void;
}

export const StakeholderExpenseModal: React.FC<StakeholderExpenseModalProps> = ({
  isOpen,
  onClose,
  shareholder,
  expenses,
  settings,
  currencySymbol,
  onOpenAddExpenseForSibling,
  onViewFullLedger,
  onOpenEditMemberModal,
}) => {
  if (!isOpen || !shareholder) return null;

  const symbol = settings?.currencySymbol || currencySymbol || 'KES';

  // Filter expenses paid by this specific sibling
  const siblingExpenses = expenses.filter(e => e.paidBy === shareholder.id);
  const totalOutPocket = siblingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalContributed = shareholder.initialInvestment + totalOutPocket;

  // Group by category
  const categoryBreakdown = siblingExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl shadow-amber-950/50 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <StakeholderAvatar
              shareholder={shareholder}
              size="lg"
              showBadge={true}
              ringClass="ring-2 ring-amber-400 shadow-md shadow-amber-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif">{shareholder.name}</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {shareholder.baseEquityPercentage}% Base Share
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium">{shareholder.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenEditMemberModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditMemberModal(shareholder);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold rounded-xl border border-amber-500/30 transition-all cursor-pointer"
                title="Edit member role and profile details"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Role</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member Details Bar (Email, Phone, Responsibilities if available) */}
        {(shareholder.email || shareholder.phone || (shareholder.responsibilities && shareholder.responsibilities.length > 0)) && (
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5">
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              {shareholder.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{shareholder.email}</span>
                </div>
              )}
              {shareholder.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{shareholder.phone}</span>
                </div>
              )}
            </div>
            {shareholder.responsibilities && shareholder.responsibilities.length > 0 && (
              <div className="pt-1 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Key Responsibilities:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                  {shareholder.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Financial Highlights Pill cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30">
            <span className="text-[11px] text-emerald-300 font-medium block">Out-of-Pocket Expenses</span>
            <div className="text-lg font-bold text-white mt-1 font-mono">
              {symbol} {totalOutPocket.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{siblingExpenses.length} payments recorded</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30">
            <span className="text-[11px] text-amber-300 font-medium block">Foundation Capital</span>
            <div className="text-lg font-bold text-white mt-1 font-mono">
              {symbol} {shareholder.initialInvestment.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Baseline Seed Capital</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-slate-700">
            <span className="text-[11px] text-slate-300 font-medium block">Total Contributed</span>
            <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
              {symbol} {totalContributed.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Capital + Out-of-Pocket</span>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        {Object.keys(categoryBreakdown).length > 0 && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5 mb-2.5">
              <PieIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Spending Breakdown by Category</span>
            </div>
            <div className="space-y-2">
              {Object.entries(categoryBreakdown).map(([category, rawAmount]) => {
                const amount = Number(rawAmount);
                const pct = totalOutPocket > 0 ? Math.round((amount / totalOutPocket) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{category}</span>
                      <span className="font-mono text-white font-semibold">
                        {symbol} {amount.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Itemized Expense Records List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[120px]">
          <div className="flex items-center justify-between sticky top-0 bg-slate-900 py-1 z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Itemized Payment Records ({siblingExpenses.length})
            </span>
          </div>

          {siblingExpenses.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800/60 p-4">
              <Receipt className="w-6 h-6 mx-auto mb-2 opacity-40 text-amber-400" />
              <p>No out-of-pocket expenses logged yet by {shareholder.name}.</p>
              {onOpenAddExpenseForSibling && (
                <button
                  onClick={() => onOpenAddExpenseForSibling(shareholder.id)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log First Expense for {shareholder.name.split(' ')[0]}</span>
                </button>
              )}
            </div>
          ) : (
            siblingExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">{expense.title}</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>{expense.date}</span>
                    <span>•</span>
                    <span className="text-amber-400/90">{expense.category}</span>
                  </div>
                  {expense.receiptNote && (
                    <p className="text-[10px] text-slate-500 italic">"{expense.receiptNote}"</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 font-mono text-xs">
                    {symbol} {expense.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {onViewFullLedger ? (
            <button
              onClick={() => onViewFullLedger(shareholder.id)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View in Farm Ledger</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {onOpenAddExpenseForSibling && (
              <button
                onClick={() => onOpenAddExpenseForSibling(shareholder.id)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Expense for {shareholder.name.split(' ')[0]}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
