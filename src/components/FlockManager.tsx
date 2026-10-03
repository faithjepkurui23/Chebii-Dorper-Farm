import React, { useState } from 'react';
import { Sheep, SiblingId, FarmSettings } from '../types';
import { formatCurrency } from '../utils/calculations';
import { 
  Layers, 
  Plus, 
  TrendingUp, 
  Scale, 
  Calendar, 
  Tag, 
  HeartPulse, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  ChevronRight,
  Camera,
  Edit3,
  CheckCircle2,
  Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface FlockManagerProps {
  sheep: Sheep[];
  setSheep: React.Dispatch<React.SetStateAction<Sheep[]>>;
  settings: FarmSettings;
  activeSibling: SiblingId;
  onOpenAddSheepModal: () => void;
  onOpenAddExpense: () => void;
  onOpenEditSheepModal: (sheep: Sheep) => void;
}

export const FlockManager: React.FC<FlockManagerProps> = ({
  sheep,
  setSheep,
  settings,
  activeSibling,
  onOpenAddSheepModal,
  onOpenAddExpense,
  onOpenEditSheepModal,
}) => {
  const [selectedSheepId, setSelectedSheepId] = useState<string>(sheep[0]?.id || '');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(45);
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().slice(0, 10));

  const selectedSheep = sheep.find(s => s.id === selectedSheepId) || sheep[0];
  const totalFlockWeight = sheep.reduce((sum, s) => sum + s.currentWeightKg, 0);
  const avgWeight = sheep.length > 0 ? (totalFlockWeight / sheep.length).toFixed(1) : 0;

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSheep || !newWeight) return;

    setSheep(prev => prev.map(s => {
      if (s.id === selectedSheep.id) {
        const updatedHistory = [...s.weightHistory, { date: newWeightDate, weightKg: Number(newWeight) }];
        return {
          ...s,
          currentWeightKg: Number(newWeight),
          weightHistory: updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        };
      }
      return s;
    }));

    setShowWeightModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 p-6 rounded-3xl border border-emerald-500/30 text-white shadow-xl shadow-emerald-950/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
              📍 Iten Highlands Flock (2,400m)
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Currently {sheep.length} Registered Dorpers (Dopa)
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-white">
            Dorper Sheep Registry & Progress Photos
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live weight records, pedigree lineage, health statuses, and photographic of our Dorper sheep.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddSheepModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Dorper (Dopa)</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 font-semibold block mb-1">Total Flock Head</span>
          <span className="text-2xl font-bold font-serif text-slate-900">{sheep.length}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold">2 Foundation • {sheep.length - 2} Bred/Expanded</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 font-semibold block mb-1">Flock Total Biomass</span>
          <span className="text-2xl font-bold font-serif text-emerald-700">{totalFlockWeight.toFixed(1)} kg</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Total live herd weight</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 font-semibold block mb-1">Average Weight</span>
          <span className="text-2xl font-bold font-serif text-amber-600">{avgWeight} kg</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold">Highland Growth Rate</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 font-semibold block mb-1">Phase 1 Target</span>
          <span className="text-2xl font-bold font-serif text-slate-900">{sheep.length} / 10 Head</span>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-bold">Target by Year End</span>
        </div>
      </div>

      {/* Main Flock Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: List of Dorper Sheep */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Dorper ({sheep.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {sheep.map((s) => {
              const isSelected = s.id === selectedSheep?.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSheepId(s.id)}
                  className={`p-3.5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-900 to-emerald-950 text-white border-amber-400 shadow-xl shadow-slate-950/20'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-amber-400/60 hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      referrerPolicy="no-referrer"
                      className={`w-12 h-12 rounded-2xl object-cover ring-2 transition-all shrink-0 ${
                        isSelected ? 'ring-amber-400' : 'ring-slate-300'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">{s.name}</div>
                      <div className={`text-[11px] font-mono ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                        {s.tagId} • {s.gender}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-emerald-300' : 'text-slate-900'}`}>
                      {s.currentWeightKg} kg
                    </span>
                    <span className={`block text-[10px] ${isSelected ? 'text-emerald-400' : 'text-emerald-600 font-bold'}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expansion CTA Card */}
          <button
            onClick={onOpenAddSheepModal}
            className="w-full p-3.5 rounded-3xl border-2 border-dashed border-amber-400/80 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>+ Add Next Dorper (CF-DOR-00{sheep.length + 1})</span>
          </button>
        </div>

        {/* Right 2 Cols: Selected Dorper Deep Profile */}
        {selectedSheep && (
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Top Header of Selected Sheep with Photo & Edit Button */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img
                    src={selectedSheep.photoUrl}
                    alt={selectedSheep.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-3xl object-cover ring-2 ring-emerald-500 shadow-md shadow-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => onOpenEditSheepModal(selectedSheep)}
                    title="Change / update sheep progress photo"
                    className="absolute -bottom-1 -right-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-serif text-slate-900">{selectedSheep.name}</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      {selectedSheep.gender}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                      {selectedSheep.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Tag ID: <strong className="text-emerald-700 font-bold">{selectedSheep.tagId}</strong> • {selectedSheep.breed}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenEditSheepModal(selectedSheep)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit Profile & Photo</span>
                </button>

                <button
                  onClick={() => {
                    setNewWeight(selectedSheep.currentWeightKg);
                    setShowWeightModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-300" />
                  <span>Log New Weight</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-semibold block">Current Weight</span>
                <span className="text-xl font-bold text-slate-900 font-mono">{selectedSheep.currentWeightKg} kg</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-semibold block">Date of Birth</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{selectedSheep.dob || '2024'}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-semibold block">Sire (Father)</span>
                <span className="text-xs font-bold text-emerald-800 font-mono">{selectedSheep.sireTag || 'Foundation Stud'}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-semibold block">Dam (Mother)</span>
                <span className="text-xs font-bold text-teal-800 font-mono">{selectedSheep.damTag || 'Foundation Ewe'}</span>
              </div>
            </div>

            {/* Weight Progression Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Growth Trajectory & Weight History (kg)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedSheep.weightHistory.length} Weigh-in Records
                </span>
              </div>

              <div className="h-48 w-full bg-slate-950 p-3.5 rounded-3xl border border-slate-800 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedSheep.weightHistory}>
                    <defs>
                      <linearGradient id="sheepWeightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['dataMin - 2', 'dataMax + 5']} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow border border-amber-500/40">
                            <div className="text-[10px] text-slate-400">{label}</div>
                            <div className="font-bold text-amber-300">{payload[0].value} kg</div>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Area type="monotone" dataKey="weightKg" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#sheepWeightGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Notes */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">Breeder Notes & Physical Conformation:</span>
              <p className="leading-relaxed">{selectedSheep.notes || 'Healthy Dorper stock thriving in Iten climate.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Log New Weight */}
      {showWeightModal && selectedSheep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold font-serif text-white mb-1">
              Log Weigh-In for {selectedSheep.name}
            </h3>
            <p className="text-xs text-amber-400 mb-4">Tag: {selectedSheep.tagId}</p>

            <form onSubmit={handleAddWeight} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-emerald-500 rounded-xl text-emerald-400 font-bold text-base focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Date of Weigh-in</label>
                <input
                  type="date"
                  value={newWeightDate}
                  onChange={(e) => setNewWeightDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 font-bold rounded-xl shadow"
                >
                  Save Weigh-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
