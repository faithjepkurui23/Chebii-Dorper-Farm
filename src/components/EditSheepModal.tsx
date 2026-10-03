import React, { useState, useEffect } from 'react';
import { Sheep, SheepStatus, SheepGender } from '../types';
import { 
  X, 
  Camera, 
  Upload, 
  Check, 
  Image as ImageIcon, 
  Scale, 
  Tag, 
  Calendar, 
  Layers, 
  Info,
  DollarSign,
  HeartPulse,
  Sparkles
} from 'lucide-react';

interface EditSheepModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheep: Sheep | null;
  onUpdateSheep?: (updatedSheep: Sheep) => void;
  onSaveSheep?: (updatedSheep: Sheep) => void;
}

const PRESET_SHEEP_PHOTOS = [
  { label: 'Dorper Ram (Black Head)', url: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dorper Ewe Grazing', url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Young Lamb in Pasture', url: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80' },
  { label: 'White Dorper Stud', url: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Highland Flock (Iten)', url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80' },
];

export const EditSheepModal: React.FC<EditSheepModalProps> = ({
  isOpen,
  onClose,
  sheep,
  onUpdateSheep,
  onSaveSheep,
}) => {
  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [gender, setGender] = useState<SheepGender>('Ram');
  const [breed, setBreed] = useState('Purebred Dorper');
  const [status, setStatus] = useState<SheepStatus>('Healthy');
  const [currentWeight, setCurrentWeight] = useState<string>('45');
  const [dob, setDob] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState<string>('0');
  const [damTag, setDamTag] = useState('');
  const [sireTag, setSireTag] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoError, setPhotoError] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (sheep) {
      setName(sheep.name || '');
      setTagId(sheep.tagId || '');
      setGender(sheep.gender || 'Ram');
      setBreed(sheep.breed || 'Purebred Dorper');
      setStatus(sheep.status || 'Healthy');
      setCurrentWeight(sheep.currentWeightKg ? sheep.currentWeightKg.toString() : '45');
      setDob(sheep.dob || '');
      setAcquisitionDate(sheep.acquisitionDate || '');
      setAcquisitionCost(sheep.acquisitionCost ? sheep.acquisitionCost.toString() : '0');
      setDamTag(sheep.damTag || '');
      setSireTag(sheep.sireTag || '');
      setNotes(sheep.notes || '');
      setPhotoUrl(sheep.photoUrl || '');
      setPhotoError(false);
      setSavedFeedback(false);
    }
  }, [sheep, isOpen]);

  if (!isOpen || !sheep) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          setPhotoError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheep) return;

    const weightNum = parseFloat(currentWeight) || sheep.currentWeightKg || 45;
    const costNum = parseFloat(acquisitionCost) || 0;
    
    // Weight history update if weight changed
    const history = Array.isArray(sheep.weightHistory) ? [...sheep.weightHistory] : [];
    if (weightNum !== sheep.currentWeightKg) {
      const today = new Date().toISOString().split('T')[0];
      history.push({ date: today, weightKg: weightNum });
    }

    const updated: Sheep = {
      ...sheep,
      name: name.trim() || sheep.name,
      tagId: tagId.trim() || sheep.tagId,
      gender,
      breed: breed.trim() || 'Purebred Dorper',
      status,
      currentWeightKg: weightNum,
      weightHistory: history,
      dob: dob || sheep.dob,
      acquisitionDate: acquisitionDate || sheep.acquisitionDate,
      acquisitionCost: costNum,
      damTag: damTag.trim() || undefined,
      sireTag: sireTag.trim() || undefined,
      notes: notes.trim(),
      photoUrl: photoUrl.trim() || sheep.photoUrl,
    };

    // Call either handler provided
    if (onUpdateSheep) {
      onUpdateSheep(updated);
    } else if (onSaveSheep) {
      onSaveSheep(updated);
    }

    setSavedFeedback(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl shadow-emerald-950/60 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">Edit Dorper Sheep Details & Photo</h3>
              <p className="text-xs text-amber-400 font-medium">Tag ID: {sheep.tagId} • {sheep.name}</p>
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

        {/* Current Photo & Live Upload */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative shrink-0">
            {photoUrl && !photoError ? (
              <img
                src={photoUrl}
                alt={name || sheep.name}
                referrerPolicy="no-referrer"
                onError={() => setPhotoError(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-amber-400 shadow-lg shadow-amber-950/50"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 ring-2 ring-slate-700">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 w-full space-y-2 text-xs">
            <label className="block font-semibold text-slate-300">
              Update Progress Photo
            </label>
            <label className="flex items-center justify-center gap-2 p-2.5 bg-slate-900 hover:bg-slate-800 border border-dashed border-emerald-500/40 hover:border-amber-400 text-emerald-300 hover:text-amber-300 rounded-xl cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span className="font-semibold">Browse Photo from Device</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <div>
              <input
                type="url"
                value={photoUrl.startsWith('data:') ? '' : photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setPhotoError(false);
                }}
                placeholder="Or paste direct image URL..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Preset Gallery */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            Quick Breed Photo Presets
          </label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_SHEEP_PHOTOS.map((item, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  setPhotoUrl(item.url);
                  setPhotoError(false);
                }}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                  photoUrl === item.url
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                    : 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                }`}
                title={item.label}
              >
                <img
                  src={item.url}
                  alt={item.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Editable Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Sheep Name / Call Sign *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-semibold"
                placeholder="e.g. Kalya, Terter, Tui Kel, Lel Kel"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Ear Tag ID *
              </label>
              <input
                type="text"
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-mono font-bold text-amber-300"
                placeholder="e.g. 5489, 4126, CF-DOR-003"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Current Weight (Kg) *</span>
                <Scale className="w-3.5 h-3.5 text-amber-400" />
              </label>
              <input
                type="number"
                step="any"
                min="1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/50 focus:border-amber-400 text-amber-300 font-bold rounded-xl px-3 py-2 focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Health Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SheepStatus)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-semibold"
              >
                <option value="Healthy">Healthy & Thriving</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Pregnant">Pregnant (Gestation)</option>
                <option value="Lactating">Lactating Ewe</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as SheepGender)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-semibold"
              >
                <option value="Ram">Ram (Male)</option>
                <option value="Ewe">Ewe (Female)</option>
                <option value="Wether">Wether (Castrated)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Breed Type
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none"
                placeholder="e.g. Purebred Dorper, White Dorper"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Date of Birth (DOB)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Acquisition / Entry Date
              </label>
              <input
                type="date"
                value={acquisitionDate}
                onChange={(e) => setAcquisitionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Acquisition Cost (KES)
              </label>
              <input
                type="number"
                min="0"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-mono"
                placeholder="0 if born on farm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Dam (Mother Tag)
              </label>
              <input
                type="text"
                value={damTag}
                onChange={(e) => setDamTag(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none font-mono"
                placeholder="e.g. 4126 (Terter)"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Notes & Physical Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 focus:outline-none resize-none"
              placeholder="e.g. Good muscle conformation, clean shedding coat, energetic in Iten pastures..."
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
              <span>{savedFeedback ? 'Saved!' : 'Save Sheep Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
