import React, { useState } from 'react';
import { Sheep, SheepGender, SheepStatus } from '../types';
import { X, Plus, Sparkles, Tag, Check, Calendar } from 'lucide-react';

interface AddSheepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSheep: (newSheep: Sheep) => void;
  existingSheep: Sheep[];
}

export const AddSheepModal: React.FC<AddSheepModalProps> = ({
  isOpen,
  onClose,
  onAddSheep,
  existingSheep,
}) => {
  const nextNum = existingSheep.length + 1;
  const defaultTag = `CF-DOR-00${nextNum}`;

  const [tagId, setTagId] = useState(defaultTag);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<SheepGender>('Ewe');
  const [breed, setBreed] = useState('Purebred South African Dorper');
  const [dob, setDob] = useState(new Date().toISOString().slice(0, 10));
  const [acquisitionCost, setAcquisitionCost] = useState<number>(0);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(18.5);
  const [status, setStatus] = useState<SheepStatus>('Healthy');
  const [damTag, setDamTag] = useState('');
  const [sireTag, setSireTag] = useState('');
  const [origin, setOrigin] = useState<'Born in Iten' | 'Purchased'>('Born in Iten');
  const [notes, setNotes] = useState('');

  const [photoUrl, setPhotoUrl] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagId.trim()) return;

    const defaultFallbackPhoto = gender === 'Ram'
      ? 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80';

    const newSheep: Sheep = {
      id: `sheep-${Date.now()}`,
      tagId: tagId.trim().toUpperCase(),
      name: name.trim(),
      gender,
      breed,
      dob,
      acquisitionDate: new Date().toISOString().slice(0, 10),
      acquisitionCost: Number(acquisitionCost) || 0,
      currentWeightKg: Number(currentWeightKg) || 10,
      weightHistory: [
        { date: new Date().toISOString().slice(0, 10), weightKg: Number(currentWeightKg) || 10 },
      ],
      status,
      damTag: damTag || undefined,
      sireTag: sireTag || undefined,
      notes: notes.trim() || (origin === 'Born in Iten' ? 'Bred at Chebii Farm in Iten' : 'Acquired for genetic expansion'),
      photoUrl: photoUrl.trim() || defaultFallbackPhoto,
    };

    onAddSheep(newSheep);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl shadow-emerald-950/40 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                Flock Expansion ({existingSheep.length} → {existingSheep.length + 1})
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white mt-1">
              Add Dorper Sheep / Lamb (Dopa)
            </h3>
            <p className="text-xs text-slate-400">Register new lamb born in Iten or new breeding stock.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-xs">
          {/* Tag & Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ear Tag ID *</label>
              <input
                type="text"
                required
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
                placeholder="e.g. CF-DOR-005"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Dorper Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kiptoo, Amani, Neema"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Gender & Breed */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as SheepGender)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="Ewe">Ewe (Female)</option>
                <option value="Ram">Ram (Male)</option>
                <option value="Wether">Wether (Castrated)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Breed Variety</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Purebred South African Dorper">Purebred South African Dorper</option>
                <option value="Purebred Blackhead Dorper">Purebred Blackhead Dorper</option>
                <option value="White Dorper">White Dorper</option>
                <option value="F1 Dorper Cross">F1 Dorper Cross</option>
              </select>
            </div>
          </div>

          {/* Weight & Date of Birth */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Weight (kg) *</label>
              <input
                type="number"
                step="any"
                required
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Origin & Acquisition Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Origin Source</label>
              <select
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value as any);
                  if (e.target.value === 'Born in Iten') setAcquisitionCost(0);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Born in Iten">Born at Iten Farm (KES 0 Cost)</option>
                <option value="Purchased">Purchased Breeding Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cost (KES)</label>
              <input
                type="number"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(Number(e.target.value))}
                disabled={origin === 'Born in Iten'}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white disabled:opacity-50 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pedigree (Sire & Dam) */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Mother (Dam)</label>
              <select
                value={damTag}
                onChange={(e) => setDamTag(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
              >
                <option value="">Unknown / External</option>
                {existingSheep.filter(s => s.gender === 'Ewe').map(e => (
                  <option key={e.id} value={e.tagId}>{e.tagId} - {e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Father (Sire)</label>
              <select
                value={sireTag}
                onChange={(e) => setSireTag(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
              >
                <option value="">Unknown / External</option>
                {existingSheep.filter(s => s.gender === 'Ram').map(r => (
                  <option key={r.id} value={r.tagId}>{r.tagId} - {r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload / URL */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-slate-300 font-semibold text-xs">
              Sheep Progress Photo (Optional)
            </label>
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-xl text-xs cursor-pointer transition-colors shrink-0">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <input
                type="url"
                placeholder="Or paste image URL link..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            {photoUrl && (
              <div className="flex items-center gap-2 pt-1">
                <img
                  src={photoUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-emerald-500"
                />
                <span className="text-[11px] text-emerald-400">Photo attached successfully</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Health Notes / Markings</label>
            <input
              type="text"
              placeholder="e.g. Robust lamb, vaccinated, healthy coat"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Add to Flock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
