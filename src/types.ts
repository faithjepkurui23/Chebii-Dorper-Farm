export type SiblingId = 'nathan' | 'evans' | 'faith' | 'mercy';

export interface Shareholder {
  id: SiblingId;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarColor: string;
  avatarIcon?: string; // Emblem icon: 'coins', 'sprout', 'heart', 'sparkles', 'crown', 'shield', 'user'
  avatarUrl?: string; // Optional legacy fallback
  initialInvestment: number; // KES
  baseEquityPercentage: number; // e.g., 25%
  pin?: string;
  responsibilities?: string[];
}

export type SheepGender = 'Ram' | 'Ewe' | 'Wether';
export type SheepStatus = 'Healthy' | 'Under Treatment' | 'Pregnant' | 'Lactating' | 'Sold';

export interface WeightRecord {
  date: string;
  weightKg: number;
}

export interface Sheep {
  id: string;
  tagId: string;
  name: string;
  gender: SheepGender;
  breed: string; // e.g., "Purebred Dorper"
  dob: string;
  acquisitionDate: string;
  acquisitionCost: number; // KES
  currentWeightKg: number;
  weightHistory: WeightRecord[];
  status: SheepStatus;
  damTag?: string; // Mother
  sireTag?: string; // Father
  notes: string;
  photoUrl?: string;
}

export type ExpenseCategory = 
  | 'Feeds & Nutrition'
  | 'Vaccines & Dewormers'
  | 'Veterinary Care'
  | 'Shelter, Fencing & Equipment'
  | 'Livestock Acquisition'
  | 'Transport & Logistics'
  | 'Other Operations';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number; // KES
  date: string;
  paidBy: SiblingId | 'farm_pool';
  receiptNote?: string;
  attachedSheepId?: string; // if expense was for specific sheep
}

export type SaleCategory = 
  | 'Livestock / Lamb Sale'
  | 'Organic Fertilizer / Manure'
  | 'Dorper Breeding Service'
  | 'Sheep Wool / Skins'
  | 'Farm Consultation';

export interface Revenue {
  id: string;
  title: string;
  category: SaleCategory;
  amount: number; // KES
  date: string;
  buyerName: string;
  buyerContact?: string;
  directCostBasis: number; // Direct expenses attributable to this sale
  quantity?: string; // e.g. "2 Bags", "1 Ram Lamb"
  notes?: string;
  recordedBy: SiblingId;
}

export interface VaccinationRecord {
  id: string;
  sheepId: string; // or 'all'
  sheepTag?: string;
  treatmentName: string; // e.g. "Albendazole Dewormer", "Enterotoxaemia 10-in-1", "CCPP Vaccine"
  treatmentType: 'Vaccine' | 'Dewormer' | 'Vitamin & Booster' | 'Antibiotic' | 'Dip / Spray';
  dateAdministered: string;
  nextDueDate?: string;
  dosage: string;
  administeredBy: string;
  status: 'Completed' | 'Upcoming' | 'Overdue';
  cost: number;
  notes?: string;
}

export interface FarmSettings {
  currency: 'KES' | 'USD' | 'EUR';
  currencySymbol: string;
  conversionRateToKES: number; // 1 for KES
  farmName: string;
  location: string;
  establishedDate: string;
  splitMethod: 'equal' | 'capital_weighted'; // 25% equal or based on total capital & expense contributions
}

export type FarmDocCategory = 
  | 'Photos & Memories'
  | 'Receipts & Invoices'
  | 'Health & Farm Records';

export interface FarmRecordFile {
  id: string;
  title: string;
  category: FarmDocCategory;
  date?: string;
  dateAdded?: string;
  fileUrl: string; // Base64 data url or hosted image/doc URL
  fileType: 'image' | 'pdf' | 'document' | 'other';
  fileName?: string;
  fileSizeFormatted?: string;
  uploadedBy?: string;
  relatedSheepTag?: string; // e.g. "5489 - Kalya", "4126 - Terter", "Tui Kel", "Lel Kel", "All Flock"
  sheepTag?: string;
  sheepId?: string;
  notes?: string;
  tags?: string[];
}
