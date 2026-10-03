import React, { useState } from 'react';
import { VaccinationRecord, Sheep, SiblingId } from '../types';
import { 
  Syringe, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText,
  Search,
  Filter,
  Edit2,
  Trash2,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Pill,
  Activity,
  Check
} from 'lucide-react';

interface HealthVaccineTrackerProps {
  vaccinations: VaccinationRecord[];
  setVaccinations: React.Dispatch<React.SetStateAction<VaccinationRecord[]>>;
  sheep: Sheep[];
  activeSibling: SiblingId;
}

export const HealthVaccineTracker: React.FC<HealthVaccineTrackerProps> = ({
  vaccinations,
  setVaccinations,
  sheep,
  activeSibling,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VaccinationRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<VaccinationRecord | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSheepFilter, setSelectedSheepFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    sheepTag: 'All Flock (Iten - 4 Dorpers)',
    treatmentName: 'Pulpy Kidney (Enterotoxaemia)',
    treatmentType: 'Vaccine' as VaccinationRecord['treatmentType'],
    dateAdministered: new Date().toISOString().slice(0, 10),
    nextDueDate: '',
    dosage: '2ml subcutaneous',
    administeredBy: 'Faith Jepkurui (Chebii Family - Self-Administered)',
    status: 'Upcoming' as VaccinationRecord['status'],
    cost: 1500,
    notes: 'DOPA (Dorper) Sheep Schedule - Administered every 6 months for adult sheep.',
  });

  const openAddModal = () => {
    setEditingRecord(null);
    setFormData({
      sheepTag: 'All Flock (Iten - 4 Dorpers)',
      treatmentName: 'Pulpy Kidney (Enterotoxaemia)',
      treatmentType: 'Vaccine',
      dateAdministered: new Date().toISOString().slice(0, 10),
      nextDueDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
      dosage: '2ml subcutaneous',
      administeredBy: 'Faith Jepkurui (Chebii Family - Self-Administered)',
      status: 'Upcoming',
      cost: 1500,
      notes: 'Administered on our own by Chebii Family.',
    });
    setShowAddModal(true);
  };

  const quickApplyProtocol = (protocol: {
    name: string;
    type: VaccinationRecord['treatmentType'];
    dosage: string;
    cost: number;
    notes: string;
    defaultIntervalDays?: number;
    sheepTarget?: string;
  }) => {
    setEditingRecord(null);
    const todayStr = new Date().toISOString().slice(0, 10);
    const nextDue = protocol.defaultIntervalDays 
      ? new Date(Date.now() + protocol.defaultIntervalDays * 86400000).toISOString().slice(0, 10)
      : '';
    setFormData({
      sheepTag: protocol.sheepTarget || 'All Flock (Iten - 4 Dorpers)',
      treatmentName: protocol.name,
      treatmentType: protocol.type,
      dateAdministered: todayStr,
      nextDueDate: nextDue,
      dosage: protocol.dosage,
      administeredBy: 'Faith Jepkurui (Chebii Family - Self-Administered)',
      status: 'Upcoming',
      cost: protocol.cost,
      notes: protocol.notes,
    });
    setShowAddModal(true);
  };

  const openEditModal = (rec: VaccinationRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRecord(rec);
    setFormData({
      sheepTag: rec.sheepTag || (rec.sheepId === 'all' ? 'All Flock (Iten - 4 Dorpers)' : rec.sheepId),
      treatmentName: rec.treatmentName,
      treatmentType: rec.treatmentType || 'Vaccine',
      dateAdministered: rec.dateAdministered,
      nextDueDate: rec.nextDueDate || '',
      dosage: rec.dosage,
      administeredBy: rec.administeredBy,
      status: rec.status,
      cost: rec.cost || 0,
      notes: rec.notes || '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.treatmentName.trim()) return;

    if (editingRecord) {
      // UPDATE existing record
      setVaccinations(prev => prev.map(v => {
        if (v.id === editingRecord.id) {
          return {
            ...v,
            treatmentName: formData.treatmentName.trim(),
            treatmentType: formData.treatmentType,
            sheepTag: formData.sheepTag,
            sheepId: formData.sheepTag.startsWith('All') ? 'all' : formData.sheepTag.split(' - ')[0],
            dateAdministered: formData.dateAdministered,
            nextDueDate: formData.nextDueDate || undefined,
            dosage: formData.dosage,
            administeredBy: formData.administeredBy,
            status: formData.status,
            cost: Number(formData.cost) || 0,
            notes: formData.notes.trim() || undefined,
          };
        }
        return v;
      }));
    } else {
      // CREATE new record
      const newRec: VaccinationRecord = {
        id: `vac-${Date.now()}`,
        treatmentName: formData.treatmentName.trim(),
        treatmentType: formData.treatmentType,
        sheepTag: formData.sheepTag,
        sheepId: formData.sheepTag.startsWith('All') ? 'all' : formData.sheepTag.split(' - ')[0],
        dateAdministered: formData.dateAdministered,
        nextDueDate: formData.nextDueDate || undefined,
        dosage: formData.dosage,
        administeredBy: formData.administeredBy,
        status: formData.status,
        cost: Number(formData.cost) || 0,
        notes: formData.notes.trim() || 'Standard Iten highland sheep health protocol',
      };
      setVaccinations(prev => [newRec, ...prev]);
    }

    setShowAddModal(false);
    setEditingRecord(null);
  };

  const handleDelete = (rec: VaccinationRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecordToDelete(rec);
  };

  const confirmDeleteRecord = () => {
    if (!recordToDelete) return;
    setVaccinations(prev => prev.filter(v => v.id !== recordToDelete.id));
    setRecordToDelete(null);
  };

  const handleToggleStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVaccinations(prev => prev.map(v => {
      if (v.id === id) {
        let nextStatus: VaccinationRecord['status'] = 'Completed';
        if (v.status === 'Completed') nextStatus = 'Upcoming';
        else if (v.status === 'Upcoming') nextStatus = 'Completed';
        else nextStatus = 'Completed';
        return { ...v, status: nextStatus };
      }
      return v;
    }));
  };

  // Filter and search logic
  const filteredVaccinations = vaccinations.filter(v => {
    // Status filter
    if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
    // Sheep filter
    if (selectedSheepFilter !== 'all') {
      if (selectedSheepFilter === 'flock' && v.sheepId !== 'all') return false;
      if (selectedSheepFilter !== 'flock' && v.sheepId !== selectedSheepFilter && v.sheepTag !== selectedSheepFilter) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.treatmentName.toLowerCase().includes(q);
      const matchTag = (v.sheepTag || '').toLowerCase().includes(q);
      const matchNotes = (v.notes || '').toLowerCase().includes(q);
      const matchAdmin = v.administeredBy.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchNotes && !matchAdmin) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalRecords = vaccinations.length;
  const completedCount = vaccinations.filter(v => v.status === 'Completed').length;
  const upcomingCount = vaccinations.filter(v => v.status === 'Upcoming').length;
  const overdueCount = vaccinations.filter(v => v.status === 'Overdue').length;

  // Days calculation helper
  const getDueStatusText = (dueDateStr?: string, status?: string) => {
    if (status === 'Completed') return { label: 'Completed', color: 'emerald' };
    if (!dueDateStr) return { label: 'Scheduled', color: 'blue' };
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: 'rose' };
    } else if (diffDays === 0) {
      return { label: 'Due Today', color: 'amber' };
    } else if (diffDays <= 14) {
      return { label: `Due in ${diffDays} days`, color: 'amber' };
    } else {
      return { label: `Due in ${diffDays} days`, color: 'blue' };
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 p-6 sm:p-7 rounded-3xl border border-emerald-500/30 text-white shadow-xl shadow-emerald-950/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-0.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 text-xs font-extrabold rounded-full border border-amber-500/40 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
              <span>DOPA (Dorper) Sheep Vaccine Schedule - Kenya</span>
            </span>
            <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Self-Administered by Chebii Family</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-2.5">
            <span>Vaccination & Health Timetable</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            PPR in full: Peste des Petits Ruminants. We administer vaccines and ensure health on our own to protect our 4 purebred Dorpers (Kalya, Terter, Tui Kel, Lel Kel) and all future lambs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Vaccine / Treatment</span>
          </button>
        </div>
      </div>

      {/* DOPA (DORPER) SHEEP VACCINE SCHEDULE - KENYA (Interactive Master Guide) */}
      <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-lg uppercase tracking-wider">
                Official Protocol
              </span>
              <h3 className="font-extrabold text-base text-slate-900 font-serif">
                DOPA (DORPER) SHEEP VACCINE SCHEDULE — KENYA
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              <strong className="text-emerald-700 font-bold">PPR in full:</strong> Peste des Petits Ruminants • <span className="text-amber-800 font-semibold">We administer vaccines and ensure health on our own.</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Quick Schedule</span>
            </span>
          </div>
        </div>

        {/* 3 Schedule Columns: LAMBS, ADULTS, DEWORMING */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Column 1: LAMBS */}
          <div className="bg-gradient-to-b from-amber-50/50 to-white p-4 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-xs">
                  🐑
                </div>
                <span className="font-bold text-slate-900 font-serif text-sm">LAMBS SCHEDULE</span>
              </div>
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Birth to 3 Mo
              </span>
            </div>

            <div className="space-y-2 font-sans">
              {/* Lamb 1 Mo */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs flex items-center justify-between gap-2 hover:border-amber-300 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>1 Month — PPR</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-3.5">Peste des Petits Ruminants</div>
                </div>
                <button
                  onClick={() => quickApplyProtocol({
                    name: 'Lamb PPR (Peste des Petits Ruminants)',
                    type: 'Vaccine',
                    dosage: '1ml Subcutaneous',
                    cost: 500,
                    notes: 'Lambs schedule: 1 Month - PPR (Peste des Petits Ruminants). Administered on our own.',
                    defaultIntervalDays: 30,
                  })}
                  className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  + Log
                </button>
              </div>

              {/* Lamb 2 Mo */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs flex items-center justify-between gap-2 hover:border-amber-300 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>2 Months — Pulpy Kidney + Sheep Pox</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-3.5">Enterotoxaemia & Sheep Pox primary</div>
                </div>
                <button
                  onClick={() => quickApplyProtocol({
                    name: 'Lamb: Pulpy Kidney + Sheep Pox',
                    type: 'Vaccine',
                    dosage: '2ml Subcutaneous',
                    cost: 700,
                    notes: 'Lambs schedule: 2 Months - Pulpy Kidney + Sheep Pox. Administered on our own.',
                    defaultIntervalDays: 30,
                  })}
                  className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  + Log
                </button>
              </div>

              {/* Lamb 3 Mo */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs flex items-center justify-between gap-2 hover:border-amber-300 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>3 Months — Pulpy Kidney + Sheep Pox Booster</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-3.5">Booster shot for full immunity</div>
                </div>
                <button
                  onClick={() => quickApplyProtocol({
                    name: 'Lamb: Pulpy Kidney + Sheep Pox Booster',
                    type: 'Vaccine',
                    dosage: '2ml Subcutaneous Booster',
                    cost: 700,
                    notes: 'Lambs schedule: 3 Months - Pulpy Kidney + Sheep Pox Booster. Administered on our own.',
                    defaultIntervalDays: 180,
                  })}
                  className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  + Log
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: ADULTS (All Sheep) */}
          <div className="bg-gradient-to-b from-emerald-50/50 to-white p-4 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  🛡️
                </div>
                <span className="font-bold text-slate-900 font-serif text-sm">ADULTS (All Sheep)</span>
              </div>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Maintenance
              </span>
            </div>

            <div className="space-y-2 font-sans">
              {/* Every 6 Months */}
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between gap-2 hover:border-emerald-300 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Every 6 Months — Pulpy Kidney</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-3.5">Enterotoxaemia (Clostridial protection)</div>
                </div>
                <button
                  onClick={() => quickApplyProtocol({
                    name: 'Adult: Pulpy Kidney (Enterotoxaemia)',
                    type: 'Vaccine',
                    dosage: '2ml Subcutaneous',
                    cost: 1500,
                    notes: 'Adults schedule: Every 6 Months - Pulpy Kidney. Administered on our own by Chebii Family.',
                    defaultIntervalDays: 180,
                  })}
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  + Log
                </button>
              </div>

              {/* Every 12 Months */}
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between gap-2 hover:border-emerald-300 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Every 12 Months — PPR + Sheep Pox + Anthrax</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-3.5">PPR (Peste des Petits Ruminants) + Pox + Anthrax</div>
                </div>
                <button
                  onClick={() => quickApplyProtocol({
                    name: 'Adult: PPR + Sheep Pox + Anthrax (PPR: Peste des Petits Ruminants)',
                    type: 'Vaccine',
                    dosage: 'Standard subcutaneous doses',
                    cost: 2400,
                    notes: 'Adults schedule: Every 12 Months - PPR (Peste des Petits Ruminants) + Sheep Pox + Anthrax. Administered on our own by Chebii Family.',
                    defaultIntervalDays: 365,
                  })}
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  + Log
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: DEWORMING */}
          <div className="bg-gradient-to-b from-blue-50/50 to-white p-4 rounded-2xl border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-bold text-xs">
                  💊
                </div>
                <span className="font-bold text-slate-900 font-serif text-sm">DEWORMING</span>
              </div>
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Quarterly
              </span>
            </div>

            <div className="space-y-2 font-sans">
              <div className="p-2.5 bg-white rounded-xl border border-blue-100 shadow-2xs flex items-center justify-between gap-2 hover:border-blue-300 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Every 3 Months — All Sheep</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-3.5">Broad-spectrum internal parasite control</div>
                </div>
                <button
                  onClick={() => quickApplyProtocol({
                    name: 'Routine Deworming (Quarterly Drench)',
                    type: 'Dewormer',
                    dosage: 'Oral drench per body weight',
                    cost: 800,
                    notes: 'Deworming schedule: Every 3 Months for all sheep. We administer vaccines and ensure health on our own.',
                    defaultIntervalDays: 90,
                  })}
                  className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-lg text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  + Log
                </button>
              </div>

              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-950 leading-relaxed font-medium">
                ✨ <strong>Farm Note:</strong> We administer vaccines and ensure health on our own. Routine rotation of anthelmintic classes helps prevent internal parasite resistance in the highland pastures.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Protocols</span>
            <Syringe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{totalRecords}</div>
          <span className="text-[10px] text-slate-500">Flock & Individual</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/70 shadow-sm bg-gradient-to-b from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{completedCount}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Administered & Verified</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/70 shadow-sm bg-gradient-to-b from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Upcoming Schedule</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">{upcomingCount}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Due in coming months</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200/70 shadow-sm bg-gradient-to-b from-white to-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Attention / Overdue</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono mt-1">{overdueCount}</div>
          <span className="text-[10px] text-rose-700 font-semibold">Immediate action</span>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search treatment, medicine, sheep tag, note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'Upcoming', label: `Upcoming (${upcomingCount})` },
            { id: 'Completed', label: `Completed (${completedCount})` },
            { id: 'Overdue', label: `Overdue (${overdueCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Target Sheep Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSheepFilter}
            onChange={(e) => setSelectedSheepFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
          >
            <option value="all">All Animals</option>
            <option value="flock">All Flock (General)</option>
            {sheep.map(s => (
              <option key={s.id} value={s.name}>{s.name} ({s.tagId})</option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 ml-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Timetable View */}
      {viewMode === 'timeline' ? (
        <div className="space-y-4">
          {filteredVaccinations.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm text-slate-400">
              <Syringe className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <div className="font-bold text-slate-700 text-sm">No vaccination records match your filter</div>
              <p className="text-xs text-slate-500 mt-1">Try resetting the status or search filter.</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                + Add Record Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVaccinations.map((rec) => {
                const isCompleted = rec.status === 'Completed';
                const isOverdue = rec.status === 'Overdue';
                const dueInfo = getDueStatusText(rec.nextDueDate, rec.status);

                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-3xl border p-5 shadow-sm transition-all hover:shadow-md relative overflow-hidden group ${
                      isCompleted
                        ? 'border-emerald-200/80 hover:border-emerald-300'
                        : isOverdue
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-amber-200/80 hover:border-amber-300'
                    }`}
                  >
                    {/* Left vertical color accent */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      isCompleted ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-amber-400'
                    }`} />

                    {/* Card Top Header */}
                    <div className="flex items-start justify-between gap-3 pl-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <Syringe className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm font-serif">
                              {rec.treatmentName}
                            </h3>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                              {rec.sheepTag || rec.sheepId}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs mt-0.5 font-medium">
                            {rec.notes || 'Standard Highland Protocol'}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isOverdue && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        {!isCompleted && !isOverdue && <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{rec.status}</span>
                      </span>
                    </div>

                    {/* Card Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs pl-2">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Date Given</span>
                        <span className="font-bold text-slate-800 font-mono">{rec.dateAdministered}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Next Due Booster</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 font-mono">{rec.nextDueDate || 'None'}</span>
                          {rec.nextDueDate && (
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                              dueInfo.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                              dueInfo.color === 'rose' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {dueInfo.label}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Dosage & Type</span>
                        <span className="font-medium text-slate-700">{rec.dosage} ({rec.treatmentType || 'Vaccine'})</span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Administered By</span>
                        <span className="font-medium text-slate-700 truncate block">{rec.administeredBy}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between pl-2">
                      <button
                        onClick={(e) => handleToggleStatus(rec.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Mark as Upcoming' : 'Mark as Completed'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => openEditModal(rec, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit Vaccine Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(rec, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Treatment / Vaccine</th>
                  <th className="py-3 px-4">Target Animal</th>
                  <th className="py-3 px-4">Date Given</th>
                  <th className="py-3 px-4">Next Due Booster</th>
                  <th className="py-3 px-4">Dosage</th>
                  <th className="py-3 px-4">Administered By</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVaccinations.map((rec) => {
                  const isCompleted = rec.status === 'Completed';
                  const isOverdue = rec.status === 'Overdue';
                  return (
                    <tr key={rec.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(rec.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isOverdue
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{rec.status}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{rec.treatmentName}</div>
                        {rec.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{rec.notes}</div>}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {rec.sheepTag || rec.sheepId}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{rec.dateAdministered}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-700">{rec.nextDueDate || '—'}</td>
                      <td className="py-3 px-4 text-slate-700">{rec.dosage}</td>
                      <td className="py-3 px-4 text-slate-700">{rec.administeredBy}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => openEditModal(rec, e)}
                            className="p-1 text-slate-400 hover:text-slate-900"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(rec, e)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete"
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

      {/* Modal: Add / Edit Vaccine Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-white mb-1">
              {editingRecord ? 'Edit Vaccine / Treatment Record' : 'Log New Vaccination / Treatment'}
            </h3>
            <p className="text-xs text-amber-300 mb-4">
              Iten Highland Dorper health protocol and preventive medicine schedule.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Animal(s) *</label>
                <select
                  value={formData.sheepTag}
                  onChange={(e) => setFormData({ ...formData, sheepTag: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="All Flock (Iten - 4 Dorpers)">All Flock (Kalya, Terter, Tui Kel, Lel Kel)</option>
                  {sheep.map(s => (
                    <option key={s.id} value={`${s.tagId} - ${s.name}`}>
                      {s.tagId} - {s.name} ({s.gender} • {s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-300 font-semibold mb-1">Treatment / Medicine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pulpy Kidney Vaccine, Albendazole"
                    value={formData.treatmentName}
                    onChange={(e) => setFormData({ ...formData, treatmentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-1 flex-wrap mt-1.5">
                    <span className="text-[10px] text-amber-400 font-bold">Quick DOPA Presets:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        treatmentName: 'Lamb PPR (Peste des Petits Ruminants)',
                        treatmentType: 'Vaccine',
                        dosage: '1ml Subcutaneous',
                        notes: 'Lambs: 1 Month - PPR (Peste des Petits Ruminants). Self-administered.',
                        nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                      })}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded"
                    >
                      1 Mo PPR
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        treatmentName: 'Lamb: Pulpy Kidney + Sheep Pox',
                        treatmentType: 'Vaccine',
                        dosage: '2ml Subcutaneous',
                        notes: 'Lambs: 2 Months - Pulpy Kidney + Sheep Pox. Self-administered.',
                        nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                      })}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded"
                    >
                      2 Mo PK+Pox
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        treatmentName: 'Adult: Pulpy Kidney (6 Mo)',
                        treatmentType: 'Vaccine',
                        dosage: '2ml Subcutaneous',
                        notes: 'Adults: Every 6 Months - Pulpy Kidney. Self-administered.',
                        nextDueDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
                      })}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-300 px-1.5 py-0.5 rounded"
                    >
                      Adult 6Mo PK
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        treatmentName: 'Adult: PPR + Sheep Pox + Anthrax (12 Mo)',
                        treatmentType: 'Vaccine',
                        dosage: 'Standard subcutaneous',
                        notes: 'Adults: Every 12 Months - PPR (Peste des Petits Ruminants) + Sheep Pox + Anthrax. Self-administered.',
                        nextDueDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
                      })}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-300 px-1.5 py-0.5 rounded"
                    >
                      Adult 12Mo PPR+Pox+Anthrax
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        treatmentName: 'Routine Deworming (3 Mo)',
                        treatmentType: 'Dewormer',
                        dosage: 'Oral drench per body weight',
                        notes: 'Deworming: Every 3 Months for all sheep. We administer vaccines and ensure health on our own.',
                        nextDueDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
                      })}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded"
                    >
                      3 Mo Deworming
                    </button>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-300 font-semibold mb-1">Treatment Type</label>
                  <select
                    value={formData.treatmentType}
                    onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Vaccine">Vaccine</option>
                    <option value="Dewormer">Dewormer</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Vitamin Booster">Vitamin Booster</option>
                    <option value="Tick / Dipping">Tick / External Parasite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dosage *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2ml subcutaneous, 5ml oral"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Upcoming">Upcoming (Scheduled)</option>
                    <option value="Completed">Completed (Administered)</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date Administered *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateAdministered}
                    onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Next Due Booster Date</label>
                  <input
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Administered By</label>
                  <input
                    type="text"
                    value={formData.administeredBy}
                    onChange={(e) => setFormData({ ...formData, administeredBy: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-1 flex-wrap mt-1">
                    {['Faith (Self)', 'Evans (Self)', 'Nathan (Self)', 'Mercy (Self)', 'Chebii Family'].map(name => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormData({ ...formData, administeredBy: `${name} (Self-Administered)` })}
                        className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Medicine Cost (KES)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Clinical Notes & Veterinary Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Injected in the neck area. Sheep rested for 2 hours afterwards."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {editingRecord ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Vaccine/Health Record?</h3>
                <p className="text-xs text-slate-400">This record will be permanently deleted from the sheep health log.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="font-bold text-sm text-slate-100">{recordToDelete.treatmentName}</div>
              <div className="text-[11px] text-amber-400 font-semibold">
                {recordToDelete.sheepTag || recordToDelete.sheepId} • {recordToDelete.treatmentType}
              </div>
              <div className="text-[10px] text-slate-500">
                Date: {recordToDelete.dateAdministered} • By: {recordToDelete.administeredBy}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteRecord}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/40 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
