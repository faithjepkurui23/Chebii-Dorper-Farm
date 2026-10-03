import { Shareholder, Sheep, Expense, Revenue, VaccinationRecord, SiblingId, FarmSettings } from '../types';

export interface SiblingFinancialSummary {
  shareholder: Shareholder;
  initialInvestment: number;
  expensesPaidOutOfPocket: number;
  totalFinancialContribution: number;
  equityPercentage: number;
  shareOfNetProfit: number;
  totalAccountValue: number;
  expensesLoggedCount: number;
  revenuesRecordedCount: number;
}

export interface InvestorShare {
  id: SiblingId;
  name: string;
  role: string;
  totalInvested: number;
  sharePercentage: number;
  color: string;
  avatarColor: string;
  count: number;
}

export interface FarmFinancialHealth {
  totalInitialCapital: number;
  totalExpenses: number;
  totalCashUsed: number; // Total cash used so far across all investments & expenses (62,130 KES baseline)
  investorShares: InvestorShare[]; // Dynamic shares: (investor total / total cash) * 100
  totalFeedsExpenses: number;
  totalVaccinesAndVetExpenses: number;
  totalShelterAndEquipExpenses: number;
  totalAcquisitionExpenses: number;
  totalOtherExpenses: number;
  totalRevenue: number;
  totalDirectCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMarginPercent: number;
  estimatedFlockAssetValue: number;
  totalFarmNetWorth: number; // Livestock Assets + Cash in pool + Shelter/Equipment Net
  siblingSummaries: Record<SiblingId, SiblingFinancialSummary>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    expenses: number;
    net: number;
  }>;
  categoryExpenses: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  revenueCategories: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function calculateFarmFinancials(
  shareholders: Shareholder[],
  sheep: Sheep[],
  expenses: Expense[],
  revenue: Revenue[],
  settings: FarmSettings
): FarmFinancialHealth {
  const totalInitialCapital = shareholders.reduce((sum, s) => sum + s.initialInvestment, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category breakdowns
  const totalFeedsExpenses = expenses
    .filter(e => e.category === 'Feeds & Nutrition')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalVaccinesAndVetExpenses = expenses
    .filter(e => e.category === 'Vaccines & Dewormers' || e.category === 'Veterinary Care')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalShelterAndEquipExpenses = expenses
    .filter(e => e.category === 'Shelter, Fencing & Equipment')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalAcquisitionExpenses = expenses
    .filter(e => e.category === 'Livestock Acquisition')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOtherExpenses = totalExpenses - (totalFeedsExpenses + totalVaccinesAndVetExpenses + totalShelterAndEquipExpenses + totalAcquisitionExpenses);

  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalDirectCosts = revenue.reduce((sum, r) => sum + r.directCostBasis, 0);

  const grossProfit = totalRevenue - totalDirectCosts;
  const operationalExpenses = totalFeedsExpenses + totalVaccinesAndVetExpenses + totalOtherExpenses;
  const netProfit = totalRevenue - operationalExpenses;
  const profitMarginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

  // Livestock current market asset valuation based on weight and pedigree
  const estimatedFlockAssetValue = sheep.reduce((sum, s) => {
    const baseValue = s.currentWeightKg * 650;
    const pedigreePremium = s.gender === 'Ram' ? 5000 : 3000;
    return sum + Math.max(s.acquisitionCost || 20000, baseValue + pedigreePremium);
  }, 0);

  // Total Farm Net Worth = Livestock Asset Valuation + Shelter & Infrastructure Net Value
  const totalFarmNetWorth = estimatedFlockAssetValue + totalShelterAndEquipExpenses;

  // Shareholder breakdowns
  const siblingSummaries: Record<SiblingId, SiblingFinancialSummary> = {
    nathan: {} as any,
    evans: {} as any,
    faith: {} as any,
    mercy: {} as any,
  };

  const siblingColors: Record<SiblingId, string> = {
    nathan: '#10B981', // Emerald
    evans: '#F59E0B',  // Amber
    faith: '#F97316',  // Orange
    mercy: '#065F46',  // Forest Emerald
  };

  // Calculate each shareholder's total cash invested (initial investment + out-of-pocket expenses/investments)
  const shareholderTotals = shareholders.map(s => {
    const outOfPocket = expenses
      .filter(e => e.paidBy === s.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const totalInvested = s.initialInvestment + outOfPocket;
    const expCount = expenses.filter(e => e.paidBy === s.id).length;
    return {
      shareholder: s,
      outOfPocket,
      totalInvested,
      expCount,
    };
  });

  // Total cash used so far across all sibling investments & farm pool expenses
  const poolExpenses = expenses.filter(e => e.paidBy === 'farm_pool').reduce((sum, e) => sum + e.amount, 0);
  const totalCashFromInvestors = shareholderTotals.reduce((sum, item) => sum + item.totalInvested, 0);
  const totalCashUsed = totalCashFromInvestors + poolExpenses;

  // Dynamic shares: Share % = (investor total / total cash) * 100
  const investorShares: InvestorShare[] = shareholderTotals.map(item => {
    const sharePct = totalCashUsed > 0 
      ? Number(((item.totalInvested / totalCashUsed) * 100).toFixed(2))
      : 0;

    return {
      id: item.shareholder.id,
      name: item.shareholder.name,
      role: item.shareholder.role,
      totalInvested: item.totalInvested,
      sharePercentage: sharePct,
      color: siblingColors[item.shareholder.id] || '#10B981',
      avatarColor: item.shareholder.avatarColor,
      count: item.expCount,
    };
  });

  shareholderTotals.forEach(item => {
    const s = item.shareholder;
    const totalContribution = item.totalInvested;
    
    // Dynamic Share % = (investor total / total cash) * 100
    const equityPct = totalCashUsed > 0 
      ? Number(((totalContribution / totalCashUsed) * 100).toFixed(2))
      : s.baseEquityPercentage;

    // Equity valuation of farm physical and flock assets
    const totalAccountValue = Number(((equityPct / 100) * totalFarmNetWorth).toFixed(0));
    const assetAppreciation = Math.max(0, totalAccountValue - totalContribution);

    siblingSummaries[s.id] = {
      shareholder: s,
      initialInvestment: s.initialInvestment,
      expensesPaidOutOfPocket: item.outOfPocket,
      totalFinancialContribution: totalContribution,
      equityPercentage: equityPct,
      shareOfNetProfit: assetAppreciation,
      totalAccountValue: totalAccountValue,
      expensesLoggedCount: item.expCount,
      revenuesRecordedCount: 0,
    };
  });

  // Category data for charts
  const categoryExpenses = [
    { name: 'Feeds & Nutrition', value: totalFeedsExpenses, percentage: totalExpenses ? Math.round((totalFeedsExpenses / totalExpenses) * 100) : 0, color: '#10B981' },
    { name: 'Vaccines & Dewormers', value: totalVaccinesAndVetExpenses, percentage: totalExpenses ? Math.round((totalVaccinesAndVetExpenses / totalExpenses) * 100) : 0, color: '#F59E0B' },
    { name: 'Shelter & Equipment', value: totalShelterAndEquipExpenses, percentage: totalExpenses ? Math.round((totalShelterAndEquipExpenses / totalExpenses) * 100) : 0, color: '#3B82F6' },
    { name: 'Livestock Acquisition', value: totalAcquisitionExpenses, percentage: totalExpenses ? Math.round((totalAcquisitionExpenses / totalExpenses) * 100) : 0, color: '#8B5CF6' },
    { name: 'Labour & Other Operations', value: totalOtherExpenses, percentage: totalExpenses ? Math.round((totalOtherExpenses / totalExpenses) * 100) : 0, color: '#64748B' },
  ].filter(c => c.value > 0);

  const revenueCategories: Array<{ name: string; value: number; color: string }> = [];

  // Group by months
  const monthlyMap: Record<string, { revenue: number; expenses: number }> = {};
  
  // Collect all months
  [...expenses.map(e => e.date), ...revenue.map(r => r.date)].forEach(d => {
    if (!d) return;
    const m = d.substring(0, 7); // YYYY-MM
    if (!monthlyMap[m]) monthlyMap[m] = { revenue: 0, expenses: 0 };
  });

  expenses.forEach(e => {
    const m = e.date.substring(0, 7);
    if (!monthlyMap[m]) monthlyMap[m] = { revenue: 0, expenses: 0 };
    monthlyMap[m].expenses += e.amount;
  });

  revenue.forEach(r => {
    const m = r.date.substring(0, 7);
    if (!monthlyMap[m]) monthlyMap[m] = { revenue: 0, expenses: 0 };
    monthlyMap[m].revenue += r.amount;
  });

  const sortedMonths = Object.keys(monthlyMap).sort();
  const monthlyTrends = sortedMonths.map(m => {
    const rev = monthlyMap[m].revenue;
    const exp = monthlyMap[m].expenses;
    const [year, monthNum] = m.split('-');
    const dateObj = new Date(Number(year), Number(monthNum) - 1, 1);
    const monthLabel = dateObj.toLocaleString('default', { month: 'short', year: '2-digit' });
    return {
      month: monthLabel,
      revenue: rev,
      expenses: exp,
      net: rev - exp,
    };
  });

  return {
    totalInitialCapital,
    totalExpenses,
    totalCashUsed,
    investorShares,
    totalFeedsExpenses,
    totalVaccinesAndVetExpenses,
    totalShelterAndEquipExpenses,
    totalAcquisitionExpenses,
    totalOtherExpenses,
    totalRevenue,
    totalDirectCosts,
    grossProfit,
    netProfit,
    profitMarginPercent,
    estimatedFlockAssetValue,
    totalFarmNetWorth,
    siblingSummaries,
    monthlyTrends,
    categoryExpenses,
    revenueCategories,
  };
}

export function formatCurrency(amount: number, currency: 'KES' | 'USD' | 'EUR' = 'KES'): string {
  if (currency === 'USD') {
    return `$${(amount / 130).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currency === 'EUR') {
    return `€${(amount / 140).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
