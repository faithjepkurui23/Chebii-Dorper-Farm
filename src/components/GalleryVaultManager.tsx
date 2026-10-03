import React, { useState, useRef } from 'react';
import { FarmRecordFile, FarmDocCategory, Sheep, Shareholder, SiblingId } from '../types';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Eye, 
  Tag, 
  Calendar, 
  User, 
  UploadCloud, 
  X, 
  Check, 
  ExternalLink,
  Sparkles,
  Camera,
  Layers,
  Heart,
  FileCheck,
  ShieldCheck,
  Receipt
} from 'lucide-react';

interface GalleryVaultManagerProps {
  files: FarmRecordFile[];
  setFiles: React.Dispatch<React.SetStateAction<FarmRecordFile[]>>;
  sheep: Sheep[];
  shareholders: Shareholder[];
  activeSibling: SiblingId;
}

export const normalizeCategory = (cat: string): FarmDocCategory => {
  if (cat === 'Photos & Memories' || cat.includes('Photo') || cat.includes('Pasture') || cat.includes('Memories')) {
    return 'Photos & Memories';
  }
  if (cat === 'Receipts & Invoices' || cat.includes('Receipt') || cat.includes('Invoice')) {
    return 'Receipts & Invoices';
  }
  return 'Health & Farm Records';
};

const CATEGORIES: { id: FarmDocCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Records', icon: FolderOpen },
  { id: 'Photos & Memories', label: 'Photos & Memories', icon: ImageIcon },
  { id: 'Receipts & Invoices', label: 'Receipts & Invoices', icon: Receipt },
  { id: 'Health & Farm Records', label: 'Health & Farm Records', icon: FileCheck },
];

export const GalleryVaultManager: React.FC<GalleryVaultManagerProps> = ({
  files,
  setFiles,
  sheep,
  shareholders,
  activeSibling,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FarmDocCategory | 'all'>('all');
  const [selectedSheep, setSelectedSheep] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<FarmRecordFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FarmRecordFile | null>(null);

  // Form states for new file upload
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<FarmDocCategory>('Photos & Memories');
  const [formFileType, setFormFileType] = useState<'image' | 'pdf' | 'document'>('image');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formSheepTag, setFormSheepTag] = useState<string>('All Flock (Iten - 4 Dorpers)');
  const [formUploadedBy, setFormUploadedBy] = useState<string>('Faith Jepkurui (Chebii Family)');
  const [formNotes, setFormNotes] = useState('');
  const [formTags, setFormTags] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter files
  const filteredFiles = files.filter((file) => {
    const fileCategory = normalizeCategory(file.category);
    if (selectedCategory !== 'all' && fileCategory !== selectedCategory) return false;
    if (selectedSheep !== 'all' && file.sheepTag !== selectedSheep && file.sheepId !== selectedSheep) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = file.title.toLowerCase().includes(q);
      const matchNotes = (file.notes || '').toLowerCase().includes(q);
      const matchTags = (file.tags || []).some(t => t.toLowerCase().includes(q));
      const matchCategory = fileCategory.toLowerCase().includes(q);
      const matchSheep = (file.sheepTag || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchTags && !matchCategory && !matchSheep) return false;
    }
    return true;
  });

  // Handle local file selection / drag-and-drop
  const processUploadedFile = (file: File) => {
    const isImg = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    setFormFileType(isImg ? 'image' : isPdf ? 'pdf' : 'document');
    setFormTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormFileUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRecord: FarmRecordFile = {
      id: `file-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      fileType: formFileType,
      fileUrl: formFileUrl.trim() || 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=800&auto=format&fit=crop&q=80',
      dateAdded: formDate,
      sheepTag: formSheepTag,
      sheepId: formSheepTag.startsWith('All') ? 'all' : formSheepTag.split(' - ')[0],
      uploadedBy: formUploadedBy,
      notes: formNotes.trim() || undefined,
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    setFiles(prev => [newRecord, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('Photos & Memories');
    setFormFileType('image');
    setFormFileUrl('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormSheepTag('All Flock (Iten - 4 Dorpers)');
    setFormNotes('');
    setFormTags('');
  };

  const confirmDelete = () => {
    if (!fileToDelete) return;
    setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
    if (previewFile?.id === fileToDelete.id) {
      setPreviewFile(null);
    }
    setFileToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Chebii Farm Archives & Media
              </span>
              <span className="text-xs text-slate-400">• {files.length} Stored Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
              Gallery & Records Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Preserve memory of progress, photographic growth logs for Kalya, Terter, Tui Kel & Lel Kel, financial receipts, and official veterinary records in one secure hub.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-2xl shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Record / Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Quick Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' ? files.length : files.filter(f => normalizeCategory(f.category) === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-amber-400 shadow-md shadow-slate-950/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400/60 hover:bg-amber-50/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${
                isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memory, sheep tag, receipt, vet cert, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white"
          />
        </div>

        {/* Sheep Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSheep}
            onChange={(e) => setSelectedSheep(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
          >
            <option value="all">All Animals & Flock</option>
            <option value="All Flock (Iten - 4 Dorpers)">Flock-wide Records</option>
            {sheep.map((s) => (
              <option key={s.id} value={`${s.name} (${s.tagId})`}>
                {s.name} ({s.tagId})
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 ml-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Gallery Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Table List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm text-slate-400 space-y-3">
          <div className="w-14 h-14 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="font-bold text-slate-800 text-base font-serif">No records found matching your filters</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload sheep photos, medical certificates, grazing land receipts, or partnership documents to begin building your farm archive.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            + Upload First Record
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode (Visual Gallery & Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const isImage = file.fileType === 'image' || (file.fileUrl && !file.fileUrl.endsWith('.pdf'));

            return (
              <div
                key={file.id}
                onClick={() => setPreviewFile(file)}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400/80 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer overflow-hidden flex flex-col group"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={file.fileUrl}
                      alt={file.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider font-mono">
                        {file.fileType.toUpperCase()} DOCUMENT
                      </span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                      {normalizeCategory(file.category)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileToDelete(file);
                      }}
                      className="pointer-events-auto p-1.5 rounded-full bg-slate-950/70 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors backdrop-blur-xs shadow"
                      title="Delete record"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Quick View Hover overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 bg-slate-900/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-400/50 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Record</span>
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 line-clamp-1">
                      {file.title}
                    </h3>
                    {file.notes && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {file.notes}
                      </p>
                    )}
                  </div>

                  {/* Meta details */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{file.dateAdded}</span>
                      </span>
                      {file.sheepTag && (
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {file.sheepTag.split(' (')[0]}
                        </span>
                      )}
                    </div>

                    {file.tags && file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {file.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode (Table View) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Record Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Associated Sheep</th>
                  <th className="py-3 px-4">Date Recorded</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-amber-50/20 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={file.fileUrl}
                            alt={file.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div 
                            onClick={() => setPreviewFile(file)}
                            className="font-bold text-slate-900 group-hover:text-emerald-800 cursor-pointer"
                          >
                            {file.title}
                          </div>
                          {file.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{file.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-slate-200">
                        {normalizeCategory(file.category)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-800 whitespace-nowrap">
                      {file.sheepTag || 'All Flock'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {file.dateAdded}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {file.uploadedBy || 'Chebii Family'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Preview record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setFileToDelete(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lightbox / Document Reader Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-4xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-white font-serif truncate">{previewFile.title}</h3>
                  <p className="text-xs text-amber-400">{normalizeCategory(previewFile.category)} • Recorded {previewFile.dateAdded}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center bg-slate-950 rounded-2xl p-2 border border-slate-800 min-h-[300px]">
              <img
                src={previewFile.fileUrl}
                alt={previewFile.title}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs shrink-0">
              <div>
                <span className="text-slate-400 block text-[11px]">Associated Sheep:</span>
                <span className="font-bold text-amber-300">{previewFile.sheepTag || 'All Flock (General)'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Uploaded By:</span>
                <span className="font-bold text-emerald-400">{previewFile.uploadedBy || 'Chebii Family Member'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Notes & Context:</span>
                <span className="text-slate-300 italic">{previewFile.notes || 'No additional notes provided.'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setFileToDelete(previewFile)}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={previewFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size</span>
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div>
              <h3 className="text-xl font-bold font-serif text-white">Save Record, Photo or Document</h3>
              <p className="text-xs text-amber-400">Keep verifiable farm memories, receipts, and vaccine documents on file.</p>
            </div>

            <form onSubmit={handleSaveFile} className="space-y-3.5 text-xs">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-amber-400 bg-amber-500/10' 
                    : formFileUrl 
                    ? 'border-emerald-500/60 bg-emerald-500/5' 
                    : 'border-slate-700 hover:border-amber-500/50 bg-slate-950'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                {formFileUrl ? (
                  <div className="space-y-2">
                    <img
                      src={formFileUrl}
                      alt="Preview"
                      className="w-24 h-24 object-cover mx-auto rounded-xl ring-2 ring-emerald-500/60"
                    />
                    <span className="text-[11px] text-emerald-400 font-bold block">File Loaded Successfully! Click to replace.</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <UploadCloud className="w-8 h-8 mx-auto text-amber-400" />
                    <div className="font-bold text-slate-200">Click to browse or drag & drop file here</div>
                    <p className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP photos and PDF documents</p>
                  </div>
                )}
              </div>

              {/* Or Direct Image URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image or Document URL (Optional Alternative)</label>
                <input
                  type="url"
                  placeholder="https://... or paste image link"
                  value={formFileUrl.startsWith('data:') ? '' : formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Record Title / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalya & Terter Grazing in Iten Pastures, Deworming Receipt"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category & Associated Sheep */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="Photos & Memories">Photos & Memories</option>
                    <option value="Receipts & Invoices">Receipts & Invoices</option>
                    <option value="Health & Farm Records">Health & Farm Records</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Associated Sheep</label>
                  <select
                    value={formSheepTag}
                    onChange={(e) => setFormSheepTag(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="All Flock (Iten - 4 Dorpers)">All Flock (General)</option>
                    {sheep.map((s) => (
                      <option key={s.id} value={`${s.name} (${s.tagId})`}>
                        {s.name} ({s.tagId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Uploaded By */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date of Record</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Recorded By</label>
                  <select
                    value={formUploadedBy}
                    onChange={(e) => setFormUploadedBy(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    {shareholders.map(sh => (
                      <option key={sh.id} value={`${sh.name} (Chebii Family)`}>
                        {sh.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Context Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Record Notes / Memory Context</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Taken during the morning flock inspection after rain. Notice the coat condition and weight gain."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. dorper, pasture, iten, weight-check"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
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
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg hover:from-amber-300 hover:to-amber-400"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Vault Record?</h3>
                <p className="text-xs text-slate-400">This photo or file will be removed from the farm archives.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="font-bold text-sm text-slate-100">{fileToDelete.title}</div>
              <div className="text-[11px] text-amber-400 font-semibold">{normalizeCategory(fileToDelete.category)}</div>
              <div className="text-[10px] text-slate-500">Date: {fileToDelete.dateAdded}</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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
