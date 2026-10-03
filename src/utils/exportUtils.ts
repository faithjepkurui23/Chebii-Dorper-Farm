import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Shareholder, Sheep, Expense, Revenue, VaccinationRecord, FarmSettings, SiblingId } from '../types';
import { calculateFarmFinancials, formatCurrency } from './calculations';

export function exportFarmReportPDF(
  shareholders: Shareholder[],
  sheep: Sheep[],
  expenses: Expense[],
  revenue: Revenue[],
  vaccinations: VaccinationRecord[],
  settings: FarmSettings,
  specificSibling?: SiblingId
) {
  const financials = calculateFarmFinancials(shareholders, sheep, expenses, revenue, settings);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const currency = settings.currency || 'KES';

  // Header Banner
  doc.setFillColor(16, 88, 56); // Deep Forest Emerald
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('CHEBII FAMILY DORPER SHEEP FARM', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Official Financial & Livestock Statement • Location: ${settings.location} (2,400m) • Generated: ${new Date().toLocaleDateString('en-GB')}`,
    14,
    20
  );

  let currentY = 35;

  // Case A: Sibling Specific Individual Statement
  if (specificSibling) {
    const siblingSummary = financials.siblingSummaries[specificSibling];
    const sName = siblingSummary?.shareholder?.name || specificSibling.toUpperCase();
    const siblingExpenses = expenses.filter(e => e.paidBy === specificSibling);
    const siblingExpensesTotal = siblingExpenses.reduce((sum, e) => sum + e.amount, 0);

    doc.setTextColor(22, 101, 52);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`INDIVIDUAL SHAREHOLDER STATEMENT: ${sName.toUpperCase()}`, 14, currentY);
    currentY += 5;

    doc.setTextColor(70, 70, 70);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Role: ${siblingSummary.shareholder.role} | Dynamic Ownership Equity: ${siblingSummary.equityPercentage}%`, 14, currentY);
    currentY += 7;

    // Summary Table
    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      head: [['Financial Metric', 'Amount (KES)', 'Notes & Breakdown']],
      body: [
        ['Foundation Capital Recorded', formatCurrency(siblingSummary.initialInvestment, currency), `Initial seed capital recorded`],
        ['Out-of-Pocket Expenses Logged', formatCurrency(siblingSummary.expensesPaidOutOfPocket, currency), `${siblingExpenses.length} receipts itemized below`],
        ['Total Cash Contributed', formatCurrency(siblingSummary.totalFinancialContribution, currency), `Direct investment into farm operations`],
        ['Dynamic Ownership Share %', `${siblingSummary.equityPercentage}%`, `Proportionate to total farm cash used`],
        ['Flock & Farm Asset Equity', formatCurrency(siblingSummary.totalAccountValue, currency), `Share of total farm net worth (${formatCurrency(financials.totalFarmNetWorth, currency)})`],
        ['Estimated Livestock Growth Gain', formatCurrency(siblingSummary.shareOfNetProfit, currency), `Biological flock appreciation`],
      ],
      headStyles: { fillColor: [16, 88, 56], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // Itemized Sibling Expenses Table
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`ITEMIZED EXPENSES PAID BY ${sName.toUpperCase()} (${siblingExpenses.length} RECEIPTS)`, 14, currentY);
    currentY += 5;

    const siblingExpRows = siblingExpenses.map(e => [
      e.date,
      e.title,
      e.category,
      formatCurrency(e.amount, currency),
      e.receiptNote || '—'
    ]);

    autoTable(doc, {
      startY: currentY,
      theme: 'striped',
      head: [['Date', 'Expense Item', 'Category', 'Amount (KES)', 'Receipt Notes']],
      body: [
        ...siblingExpRows,
        ['', 'TOTAL PAID BY ' + sName.toUpperCase(), '', formatCurrency(siblingExpensesTotal, currency), `${siblingExpenses.length} Receipts`]
      ],
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      footStyles: { fillColor: [241, 245, 249], fontStyle: 'bold' },
      styles: { fontSize: 7.5, cellPadding: 2.2 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    // Case B: Executive Full Farm Report
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. EXECUTIVE FINANCIAL HEALTH & METRICS', 14, currentY);
    currentY += 5;

    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      head: [['Metric', 'Value (KES)', 'Status / Insights']],
      body: [
        ['Total Cash Used So Far', formatCurrency(financials.totalCashUsed, currency), 'Dynamic total across all 4 sibling contributions'],
        ['Total Cumulative Expenses', formatCurrency(financials.totalExpenses, currency), `${expenses.length} itemized receipts recorded`],
        ['Animal Feeds & Nutrition Spent', formatCurrency(financials.totalFeedsExpenses, currency), 'Rhodes hay, sunflower, dairy meal, molasses & mineral licks'],
        ['Vaccines, Dewormers & Vet Care', formatCurrency(financials.totalVaccinesAndVetExpenses, currency), 'Clostridial, CCPP, wound spray, syringes & dewormers'],
        ['Livestock Acquisition Cost', formatCurrency(financials.totalAcquisitionExpenses, currency), 'Foundation Dorper sheep stock'],
        ['Shelter, Fencing & Equipment', formatCurrency(financials.totalShelterAndEquipExpenses, currency), 'Slatted housing, fencing & veterinary equipment'],
        ['Labour & Other Farm Operations', formatCurrency(financials.totalOtherExpenses, currency), 'Farm setup, ram breeding service & maintenance labour'],
        ['Estimated Live Flock Valuation', formatCurrency(financials.estimatedFlockAssetValue, currency), `${sheep.length} Dorpers (${sheep.reduce((acc, s) => acc + s.currentWeightKg, 0).toFixed(1)} kg total live biomass)`],
        ['Total Farm Net Worth', formatCurrency(financials.totalFarmNetWorth, currency), 'Live flock asset equity + equipment & infrastructure'],
      ],
      headStyles: { fillColor: [16, 88, 56], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.3 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // Sibling Ownership Equity Table
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('2. SIBLING SHAREHOLDERS INVESTOR SHARES & CONTRIBUTIONS', 14, currentY);
    currentY += 5;

    const totalCashUsedSum = Object.values(financials.siblingSummaries).reduce((acc, s) => acc + s.totalFinancialContribution, 0);

    const siblingRows = Object.values(financials.siblingSummaries).map(s => [
      s.shareholder.name,
      s.shareholder.role,
      formatCurrency(s.expensesPaidOutOfPocket, currency),
      formatCurrency(s.totalFinancialContribution, currency),
      `${s.equityPercentage}%`,
      formatCurrency(s.totalAccountValue, currency)
    ]);

    autoTable(doc, {
      startY: currentY,
      theme: 'striped',
      head: [['Shareholder (Sibling)', 'Farm Role', 'Out-of-Pocket', 'Total Invested', 'Share %', 'Asset Valuation Equity']],
      body: [
        ...siblingRows,
        ['TOTAL', '4 SIBLINGS', formatCurrency(financials.totalExpenses, currency), formatCurrency(totalCashUsedSum, currency), '100.0%', formatCurrency(financials.totalFarmNetWorth, currency)]
      ],
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
      styles: { fontSize: 7.5, cellPadding: 2.2 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Section: Flock Registry
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`3. DORPER FLOCK REGISTRY (${sheep.length} HEAD)`, 14, currentY);
  currentY += 5;

  const sheepRows = sheep.map(s => [
    s.tagId,
    s.name,
    s.gender,
    s.breed,
    `${s.currentWeightKg} kg`,
    s.acquisitionDate,
    formatCurrency(s.acquisitionCost, currency),
    s.status,
  ]);

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Tag ID', 'Sheep Name', 'Gender', 'Breed', 'Weight', 'Acquired', 'Cost (KES)', 'Status']],
    body: sheepRows,
    headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontSize: 7.5 },
    styles: { fontSize: 7.5, cellPadding: 2.2 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Section: COMPLETE EXPENSES LEDGER (ALL expenses, not truncated)
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`4. COMPLETE ITEMIZED EXPENSES LEDGER (${expenses.length} ENTRIES)`, 14, currentY);
  currentY += 5;

  const allExpenseRows = expenses.map(e => {
    const payerName = e.paidBy === 'farm_pool' 
      ? 'Farm Pool' 
      : shareholders.find(s => s.id === e.paidBy)?.name || e.paidBy;
    return [
      e.date,
      e.title,
      e.category,
      formatCurrency(e.amount, currency),
      payerName,
      e.receiptNote || '—'
    ];
  });

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  autoTable(doc, {
    startY: currentY,
    theme: 'striped',
    head: [['Date', 'Expense Item', 'Category', 'Amount (KES)', 'Paid By', 'Notes / Receipt']],
    body: [
      ...allExpenseRows,
      ['', `GRAND TOTAL (${expenses.length} ENTRIES)`, '', formatCurrency(totalExpenseAmount, currency), '', '']
    ],
    headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontSize: 7.5 },
    styles: { fontSize: 7.5, cellPadding: 2 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Chebii Family Dorper Sheep Farm • Official Farm Audit Report • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  const filename = specificSibling 
    ? `Chebii_Farm_${specificSibling.toUpperCase()}_Statement_${new Date().toISOString().slice(0, 10)}.pdf`
    : `Chebii_Farm_Official_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

  doc.save(filename);
}

export function exportExpensesCSV(expenses: Expense[], shareholders: Shareholder[]) {
  const headers = ['ID', 'Date', 'Expense Item', 'Category', 'Amount (KES)', 'Paid By', 'Paid By ID', 'Receipt Notes'];
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const rows = expenses.map(e => [
    `"${e.id}"`,
    `"${e.date}"`,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    `"${e.category}"`,
    e.amount,
    `"${e.paidBy === 'farm_pool' ? 'Farm Pool' : shareholders.find(s => s.id === e.paidBy)?.name || e.paidBy}"`,
    `"${e.paidBy}"`,
    `"${(e.receiptNote || '').replace(/"/g, '""')}"`,
  ]);

  // Grand total row
  rows.push([
    '"TOTAL"',
    '""',
    `"GRAND TOTAL (${expenses.length} ENTRIES)"`,
    '""',
    totalAmount as any,
    '""',
    '""',
    '""'
  ]);

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), `Chebii_Farm_Expenses_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportRevenueCSV(revenue: Revenue[], shareholders: Shareholder[]) {
  const headers = ['ID', 'Date', 'Sale Item / Produce', 'Category', 'Amount (KES)', 'Direct Cost (KES)', 'Net Profit (KES)', 'Buyer Name', 'Quantity', 'Recorded By', 'Notes'];
  const totalRev = revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalCost = revenue.reduce((sum, r) => sum + r.directCostBasis, 0);
  const totalNet = totalRev - totalCost;

  const rows = revenue.map(r => [
    `"${r.id}"`,
    `"${r.date}"`,
    `"${(r.title || '').replace(/"/g, '""')}"`,
    `"${r.category}"`,
    r.amount,
    r.directCostBasis,
    r.amount - r.directCostBasis,
    `"${(r.buyerName || '').replace(/"/g, '""')}"`,
    `"${(r.quantity || '').replace(/"/g, '""')}"`,
    `"${shareholders.find(s => s.id === r.recordedBy)?.name || r.recordedBy}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
  ]);

  rows.push([
    '"TOTAL"',
    '""',
    `"TOTAL SALES (${revenue.length} TRANSACTIONS)"`,
    '""',
    totalRev as any,
    totalCost as any,
    totalNet as any,
    '""',
    '""',
    '""',
    '""'
  ]);

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), `Chebii_Farm_Sales_Revenue_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportFlockCSV(sheep: Sheep[]) {
  const headers = ['Tag ID', 'Sheep Name', 'Gender', 'Breed', 'DOB', 'Acquisition Date', 'Acquisition Cost (KES)', 'Current Weight (kg)', 'Status', 'Mother (Dam)', 'Father (Sire)', 'Notes'];
  const totalCost = sheep.reduce((sum, s) => sum + s.acquisitionCost, 0);
  const totalWeight = sheep.reduce((sum, s) => sum + s.currentWeightKg, 0);

  const rows = sheep.map(s => [
    `"${s.tagId}"`,
    `"${s.name}"`,
    `"${s.gender}"`,
    `"${s.breed}"`,
    `"${s.dob}"`,
    `"${s.acquisitionDate}"`,
    s.acquisitionCost,
    s.currentWeightKg,
    `"${s.status}"`,
    `"${s.damTag || 'Foundation'}"`,
    `"${s.sireTag || 'Foundation'}"`,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  rows.push([
    '"TOTAL"',
    `"FLOCK TOTAL (${sheep.length} HEAD)"`,
    '""',
    '""',
    '""',
    '""',
    totalCost as any,
    totalWeight as any,
    '""',
    '""',
    '""',
    '""'
  ]);

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), `Chebii_Farm_Dorper_Flock_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportVaccinationsCSV(vaccinations: VaccinationRecord[], sheep: Sheep[]) {
  const headers = ['ID', 'Sheep Tag / Flock', 'Sheep Name', 'Treatment / Vaccine Name', 'Treatment Type', 'Date Administered', 'Next Due Date', 'Administered By', 'Status', 'Notes'];

  const rows = vaccinations.map(v => {
    const sName = sheep.find(s => s.tagId === v.sheepTag)?.name || 'Flock-wide';
    return [
      `"${v.id}"`,
      `"${v.sheepTag || 'Flock-wide'}"`,
      `"${sName}"`,
      `"${v.treatmentName}"`,
      `"${v.treatmentType || 'Vaccine'}"`,
      `"${v.dateAdministered}"`,
      `"${v.nextDueDate || '—'}"`,
      `"${v.administeredBy}"`,
      `"${v.status}"`,
      `"${(v.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  downloadCSV([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), `Chebii_Farm_Vaccine_Health_Records_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportFullFinancialsCSV(
  shareholders: Shareholder[],
  sheep: Sheep[],
  expenses: Expense[],
  revenue: Revenue[],
  settings: FarmSettings
) {
  const fin = calculateFarmFinancials(shareholders, sheep, expenses, revenue, settings);

  const lines = [
    'CHEBII FAMILY DORPER SHEEP FARM - OFFICIAL FINANCIAL STATEMENT',
    `Location: ${settings.location} (2,400m)`,
    `Generated Date: ${new Date().toISOString()}`,
    '',
    '--- 1. EXECUTIVE FINANCIAL HEALTH SUMMARY ---',
    'Metric,Amount (KES),Details',
    `Total Cash Contributed & Used,${fin.totalCashUsed},Dynamic total across all 4 sibling contributions`,
    `Total Incurred Expenses,${fin.totalExpenses},${expenses.length} itemized receipts recorded`,
    `Feeds & Nutrition Expenses,${fin.totalFeedsExpenses},Hay & supplements`,
    `Vaccines & Vet Expenses,${fin.totalVaccinesAndVetExpenses},Medications & vaccines`,
    `Shelter & Equipment Expenses,${fin.totalShelterAndEquipExpenses},Housing & supplies`,
    `Livestock Acquisition Expenses,${fin.totalAcquisitionExpenses},Dorper sheep foundation stock`,
    `Labour & Other Operating Expenses,${fin.totalOtherExpenses},Labour & operations`,
    `Estimated Livestock Asset Valuation,${fin.estimatedFlockAssetValue},${sheep.length} Dorper sheep`,
    `Total Farm Net Worth,${fin.totalFarmNetWorth},Live flock asset equity + infrastructure`,
    '',
    '--- 2. SIBLING SHAREHOLDERS INVESTOR SHARES ---',
    'Shareholder,Farm Role,Out-of-Pocket Expenses (KES),Total Invested (KES),Dynamic Share %,Asset Valuation Equity (KES)',
    ...Object.values(fin.siblingSummaries).map(s => 
      `"${s.shareholder.name}","${s.shareholder.role}",${s.expensesPaidOutOfPocket},${s.totalFinancialContribution},${s.equityPercentage}%,${s.totalAccountValue}`
    ),
    '',
    '--- 3. COMPLETE ITEMIZED EXPENSES LEDGER ---',
    'Date,Expense Item,Category,Amount (KES),Paid By,Notes',
    ...expenses.map(e => {
      const payer = e.paidBy === 'farm_pool' ? 'Farm Pool' : shareholders.find(s => s.id === e.paidBy)?.name || e.paidBy;
      return `"${e.date}","${(e.title || '').replace(/"/g, '""')}","${e.category}",${e.amount},"${payer}","${(e.receiptNote || '').replace(/"/g, '""')}"`;
    }),
    `"","TOTAL EXPENSES","",${fin.totalExpenses},"","${expenses.length} Receipts"`,
  ];

  downloadCSV(lines.join('\n'), `Chebii_Farm_Full_Financial_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
}

function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
