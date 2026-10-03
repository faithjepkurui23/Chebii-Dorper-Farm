import React, { useState } from 'react';
import { Shareholder, Sheep, Expense, Revenue, VaccinationRecord, FarmSettings, SiblingId } from '../types';
import { 
  exportFarmReportPDF, 
  exportFullFinancialsCSV, 
  exportExpensesCSV, 
  exportFlockCSV,
  exportVaccinationsCSV
} from '../utils/exportUtils';
import { formatCurrency } from '../utils/calculations';
import { ChebiiLogo } from './ChebiiLogo';
import { 
  Download, 
  FileText, 
  Table, 
  X, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  DollarSign, 
  Layers,
  Syringe
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareholders: Shareholder[];
  sheep: Sheep[];
  expenses: Expense[];
  revenue: Revenue[];
  vaccinations: VaccinationRecord[];
  settings: FarmSettings;
  activeSibling: SiblingId;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  shareholders,
  sheep,
  expenses,
  revenue,
  vaccinations,
  settings,
  activeSibling,
}) => {
  const [selectedSibling, setSelectedSibling] = useState<SiblingId>(activeSibling);
  const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <ChebiiLogo variant="full" size="md" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white font-serif">Export Farm Reports & Financials</h3>
          <p className="text-xs text-slate-400">Download formatted PDF reports or Excel-compatible CSV sheets with live synchronized records.</p>
        </div>

        {/* Live Records Snapshot Badge */}
        <div className="bg-slate-950/80 border border-emerald-500/30 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Live Records Ready for Audit:</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-700">
              {expenses.length} Itemized Expenses ({formatCurrency(totalExp, settings.currency)})
            </span>
            <span className="bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-700">
              {sheep.length} Dorpers
            </span>
            <span className="bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-700">
              4 Siblings (100% Equity)
            </span>
          </div>
        </div>

        {/* Export Options Grid */}
        <div className="space-y-3">
          {/* PDF Comprehensive Report */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">Full Farm PDF Statement</div>
                <div className="text-[11px] text-slate-400">Complete audit report: 4 siblings, {sheep.length} Dorpers, {expenses.length} itemized receipts & asset equity</div>
              </div>
            </div>
            <button
              onClick={() => exportFarmReportPDF(shareholders, sheep, expenses, revenue, vaccinations, settings)}
              className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Report</span>
            </button>
          </div>

          {/* Sibling Individual Statement */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Sibling Individual Statement (PDF)</div>
                  <div className="text-[11px] text-slate-400">Custom statement + all individual receipts for selected partner</div>
                </div>
              </div>
              <button
                onClick={() => exportFarmReportPDF(shareholders, sheep, expenses, revenue, vaccinations, settings, selectedSibling)}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Sibling PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-slate-400 text-[11px]">Select Sibling:</span>
              <select
                value={selectedSibling}
                onChange={(e) => setSelectedSibling(e.target.value as SiblingId)}
                className="bg-slate-900 text-emerald-300 text-xs py-1 px-2 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
              >
                {shareholders.map(s => {
                  const sExpCount = expenses.filter(e => e.paidBy === s.id).length;
                  const sExpSum = expenses.filter(e => e.paidBy === s.id).reduce((sum, e) => sum + e.amount, 0);
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatCurrency(sExpSum, settings.currency)} • {sExpCount} receipts)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* CSV Excel Sheets */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Table className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">Excel CSV Spreadsheets (Exact Records)</div>
                <div className="text-[11px] text-slate-400">Download raw data for Excel, Google Sheets, or local audit</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <button
                onClick={() => exportExpensesCSV(expenses, shareholders)}
                className="py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl text-center cursor-pointer transition-colors"
                title={`Export all ${expenses.length} itemized expenses`}
              >
                Expenses ({expenses.length})
              </button>
              <button
                onClick={() => exportFlockCSV(sheep)}
                className="py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl text-center cursor-pointer transition-colors"
                title={`Export ${sheep.length} Dorper sheep flock records`}
              >
                Flock ({sheep.length})
              </button>
              <button
                onClick={() => exportVaccinationsCSV(vaccinations, sheep)}
                className="py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl text-center cursor-pointer transition-colors"
                title={`Export ${vaccinations.length} vaccine and health records`}
              >
                Vaccines ({vaccinations.length})
              </button>
              <button
                onClick={() => exportFullFinancialsCSV(shareholders, sheep, expenses, revenue, settings)}
                className="py-2 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl text-center cursor-pointer transition-colors"
                title="Export complete farm financial and audit statement"
              >
                Full Statement (CSV)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
