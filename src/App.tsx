import React, { useState, useEffect } from 'react';
import { 
  Shareholder, 
  Sheep, 
  Expense, 
  Revenue, 
  VaccinationRecord, 
  FarmSettings, 
  SiblingId,
  FarmRecordFile
} from './types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_SHAREHOLDERS, 
  INITIAL_SHEEP, 
  INITIAL_EXPENSES, 
  INITIAL_REVENUE, 
  INITIAL_VACCINATIONS,
  INITIAL_FARM_FILES
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { FlockManager } from './components/FlockManager';
import { FinanceManager } from './components/FinanceManager';
import { HealthVaccineTracker } from './components/HealthVaccineTracker';
import { GalleryVaultManager } from './components/GalleryVaultManager';
import { AddSheepModal } from './components/AddSheepModal';
import { EditSheepModal } from './components/EditSheepModal';
import { EditStakeholderModal } from './components/EditStakeholderModal';
import { StakeholderExpenseModal } from './components/StakeholderExpenseModal';
import { ExportModal } from './components/ExportModal';
import { FreeApisAndDeployModal } from './components/FreeApisAndDeployModal';
import { ChebiiLogo } from './components/ChebiiLogo';
import { MapPin, Heart, Sparkles, Zap } from 'lucide-react';

export default function App() {
  // Version key to guarantee clean state initialization with pure avatars and 3 gallery/record categories
  const DATA_VERSION_KEY = 'chebii_farm_data_v8_pure_avatars_3_categories';
  
  useEffect(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion !== DATA_VERSION_KEY) {
      localStorage.setItem('chebii_farm_settings', JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem('chebii_farm_shareholders', JSON.stringify(INITIAL_SHAREHOLDERS));
      localStorage.setItem('chebii_farm_expenses', JSON.stringify(INITIAL_EXPENSES));
      localStorage.setItem('chebii_farm_sheep', JSON.stringify(INITIAL_SHEEP));
      localStorage.setItem('chebii_farm_vaccinations', JSON.stringify(INITIAL_VACCINATIONS));
      localStorage.setItem('chebii_farm_revenue', JSON.stringify([]));
      localStorage.setItem('chebii_farm_files', JSON.stringify(INITIAL_FARM_FILES));
      localStorage.setItem('chebii_data_version', DATA_VERSION_KEY);
    }
  }, []);

  // Persistence via localStorage with fallback to exact INITIAL constants
  const [settings, setSettings] = useState<FarmSettings>(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion === DATA_VERSION_KEY) {
      const saved = localStorage.getItem('chebii_farm_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          parsed.location = 'Iten, Elgeyo-Marakwet County, Kenya';
          return parsed;
        } catch (e) {
          return INITIAL_SETTINGS;
        }
      }
    }
    return INITIAL_SETTINGS;
  });

  const [shareholders, setShareholders] = useState<Shareholder[]>(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion === DATA_VERSION_KEY) {
      const saved = localStorage.getItem('chebii_farm_shareholders');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_SHAREHOLDERS;
        }
      }
    }
    return INITIAL_SHAREHOLDERS;
  });

  const [sheep, setSheep] = useState<Sheep[]>(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion === DATA_VERSION_KEY) {
      const saved = localStorage.getItem('chebii_farm_sheep');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_SHEEP;
        }
      }
    }
    return INITIAL_SHEEP;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion === DATA_VERSION_KEY) {
      const saved = localStorage.getItem('chebii_farm_expenses');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_EXPENSES;
        }
      }
    }
    return INITIAL_EXPENSES;
  });

  const [revenue, setRevenue] = useState<Revenue[]>(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion === DATA_VERSION_KEY) {
      const saved = localStorage.getItem('chebii_farm_revenue');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion === DATA_VERSION_KEY) {
      const saved = localStorage.getItem('chebii_farm_vaccinations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_VACCINATIONS;
        }
      }
    }
    return INITIAL_VACCINATIONS;
  });

  const [files, setFiles] = useState<FarmRecordFile[]>(() => {
    const currentVersion = localStorage.getItem('chebii_data_version');
    if (currentVersion === DATA_VERSION_KEY) {
      const saved = localStorage.getItem('chebii_farm_files');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_FARM_FILES;
        }
      }
    }
    return INITIAL_FARM_FILES;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSibling, setActiveSibling] = useState<SiblingId>('faith'); // Faith Jepkurui (Healthcare / Super User)

  // Modals state
  const [isAddSheepModalOpen, setIsAddSheepModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isFreeApisModalOpen, setIsFreeApisModalOpen] = useState<boolean>(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);

  // Dynamic Item Modals
  const [selectedStakeholderForExpenses, setSelectedStakeholderForExpenses] = useState<Shareholder | null>(null);
  const [selectedStakeholderForAvatar, setSelectedStakeholderForAvatar] = useState<Shareholder | null>(null);
  const [selectedSheepForEdit, setSelectedSheepForEdit] = useState<Sheep | null>(null);

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('chebii_farm_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('chebii_farm_shareholders', JSON.stringify(shareholders));
  }, [shareholders]);

  useEffect(() => {
    localStorage.setItem('chebii_farm_sheep', JSON.stringify(sheep));
  }, [sheep]);

  useEffect(() => {
    localStorage.setItem('chebii_farm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('chebii_farm_revenue', JSON.stringify(revenue));
  }, [revenue]);

  useEffect(() => {
    localStorage.setItem('chebii_farm_vaccinations', JSON.stringify(vaccinations));
  }, [vaccinations]);

  useEffect(() => {
    localStorage.setItem('chebii_farm_files', JSON.stringify(files));
  }, [files]);

  // Handlers
  const handleAddSheep = (newSheep: Sheep) => {
    setSheep(prev => [newSheep, ...prev]);
  };

  const handleUpdateSheep = (updatedSheep: Sheep) => {
    setSheep(prev => prev.map(s => s.id === updatedSheep.id ? updatedSheep : s));
  };

  const handleUpdateStakeholder = (updated: Shareholder) => {
    setShareholders(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleSaveAvatar = (shareholderId: SiblingId, newAvatarUrl: string) => {
    setShareholders(prev => prev.map(s => {
      if (s.id === shareholderId) {
        return { ...s, avatarUrl: newAvatarUrl };
      }
      return s;
    }));
  };

  const handleToggleVaccineStatus = (id: string) => {
    setVaccinations(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status: v.status === 'Completed' ? 'Upcoming' : 'Completed',
        };
      }
      return v;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 text-slate-100 font-sans flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header & Navigation with Calligraphed Chebii Logo */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSibling={activeSibling}
        setActiveSibling={setActiveSibling}
        shareholders={shareholders}
        settings={settings}
        setSettings={setSettings}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        flockCount={sheep.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            shareholders={shareholders}
            sheep={sheep}
            expenses={expenses}
            revenue={revenue}
            vaccinations={vaccinations}
            settings={settings}
            activeSibling={activeSibling}
            onNavigate={setActiveTab}
            onOpenAddExpense={() => {
              setActiveTab('finance');
              setShowAddExpenseModal(true);
            }}
            onOpenAddSheep={() => setIsAddSheepModalOpen(true)}
            onOpenStakeholderModal={(shareholder) => setSelectedStakeholderForExpenses(shareholder)}
            onOpenEditAvatarModal={(shareholder) => setSelectedStakeholderForAvatar(shareholder)}
            onOpenEditSheepModal={(s) => setSelectedSheepForEdit(s)}
            onToggleVaccineStatus={handleToggleVaccineStatus}
          />
        )}

        {activeTab === 'flock' && (
          <FlockManager
            sheep={sheep}
            setSheep={setSheep}
            settings={settings}
            activeSibling={activeSibling}
            onOpenAddSheepModal={() => setIsAddSheepModalOpen(true)}
            onOpenAddExpense={() => {
              setActiveTab('finance');
              setShowAddExpenseModal(true);
            }}
            onOpenEditSheepModal={(s) => setSelectedSheepForEdit(s)}
          />
        )}

        {activeTab === 'health' && (
          <HealthVaccineTracker
            vaccinations={vaccinations}
            setVaccinations={setVaccinations}
            sheep={sheep}
            activeSibling={activeSibling}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceManager
            expenses={expenses}
            setExpenses={setExpenses}
            revenue={revenue}
            setRevenue={setRevenue}
            shareholders={shareholders}
            sheep={sheep}
            settings={settings}
            activeSibling={activeSibling}
            showAddExpenseModal={showAddExpenseModal}
            setShowAddExpenseModal={setShowAddExpenseModal}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryVaultManager
            files={files}
            setFiles={setFiles}
            sheep={sheep}
            shareholders={shareholders}
            activeSibling={activeSibling}
          />
        )}
      </main>

      {/* MODALS */}

      {/* 1. Edit Stakeholder Role & Profile Modal */}
      {selectedStakeholderForAvatar && (
        <EditStakeholderModal
          isOpen={!!selectedStakeholderForAvatar}
          onClose={() => setSelectedStakeholderForAvatar(null)}
          shareholder={selectedStakeholderForAvatar}
          onSaveStakeholder={handleUpdateStakeholder}
          onSaveAvatar={handleSaveAvatar}
        />
      )}

      {/* 2. Stakeholder Individual Expense Breakdown Modal */}
      {selectedStakeholderForExpenses && (
        <StakeholderExpenseModal
          isOpen={!!selectedStakeholderForExpenses}
          onClose={() => setSelectedStakeholderForExpenses(null)}
          shareholder={selectedStakeholderForExpenses}
          expenses={expenses}
          settings={settings}
          currencySymbol={settings.currencySymbol}
          onOpenEditMemberModal={(shareholder) => setSelectedStakeholderForAvatar(shareholder)}
          onOpenAddExpenseForSibling={(siblingId) => {
            setSelectedStakeholderForExpenses(null);
            setActiveSibling(siblingId as SiblingId);
            setActiveTab('finance');
            setShowAddExpenseModal(true);
          }}
          onViewFullLedger={() => {
            setSelectedStakeholderForExpenses(null);
            setActiveTab('finance');
          }}
        />
      )}

      {/* 3. Edit Sheep Profile & Progress Photo Modal */}
      {selectedSheepForEdit && (
        <EditSheepModal
          isOpen={!!selectedSheepForEdit}
          onClose={() => setSelectedSheepForEdit(null)}
          sheep={selectedSheepForEdit}
          onUpdateSheep={handleUpdateSheep}
          onSaveSheep={handleUpdateSheep}
        />
      )}

      {/* 4. Add New Dorper Sheep Modal */}
      <AddSheepModal
        isOpen={isAddSheepModalOpen}
        onClose={() => setIsAddSheepModalOpen(false)}
        onAddSheep={handleAddSheep}
        existingSheep={sheep}
      />

      {/* 5. Export Reports Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        shareholders={shareholders}
        sheep={sheep}
        expenses={expenses}
        revenue={revenue}
        vaccinations={vaccinations}
        settings={settings}
        activeSibling={activeSibling}
      />

      {/* 6. Free APIs & Production Hosting Guide Modal */}
      <FreeApisAndDeployModal
        isOpen={isFreeApisModalOpen}
        onClose={() => setIsFreeApisModalOpen(false)}
      />

      {/* Clean Footer with Calligraphed Chebii Family Brand */}
      <footer className="bg-slate-950 text-slate-400 border-t border-emerald-900/40 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ChebiiLogo variant="compact" size="sm" />
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-semibold">Chebii Family: Nathan, Evans, Faith, Mercy</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Iten, Elgeyo-Marakwet (2,400m)</span>
            </div>

            <button
              onClick={() => setIsFreeApisModalOpen(true)}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold cursor-pointer bg-slate-900 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-xs"
              title="100% Free APIs & Production Hosting Guide"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free APIs & Deploy</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
