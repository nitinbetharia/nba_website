// PPF Calculator
(function () {
   const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
   const rupee = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

   const el = (id) => document.getElementById(id);
   const $ = {
      yearlyInvestment: el('ppfYearlyInvestment'),
      interestRate: el('ppfInterestRate'),
      investmentPeriod: el('ppfInvestmentPeriod'),
      frequency: el('ppfFrequency'),
      totalInvestment: el('ppfTotalInvestment'),
      interestEarned: el('ppfInterestEarned'),
      maturityValue: el('ppfMaturityValue'),
      breakdown: el('ppfBreakdown'),
      error: el('ppfError'),
      calcBtn: el('ppfCalcBtn'),
      resetBtn: el('ppfResetBtn'),
   };

   function calculatePPF(yearlyInvestment, annualRate, years, frequency) {
      let totalInvested = 0;
      let currentBalance = 0;
      let yearlyBreakdown = [];

      for (let year = 1; year <= years; year++) {
         let yearlyDeposit = yearlyInvestment;

         if (frequency === 'monthly') {
            // For monthly deposits, distribute yearly amount across 12 months
            yearlyDeposit = yearlyInvestment / 12;
            for (let month = 1; month <= 12; month++) {
               // Add monthly deposit at beginning of month
               currentBalance += yearlyDeposit;
               // Apply monthly interest
               currentBalance *= 1 + annualRate / 100 / 12;
            }
            totalInvested += yearlyInvestment;
         } else {
            // Yearly deposits
            currentBalance += yearlyDeposit;
            currentBalance *= 1 + annualRate / 100;
            totalInvested += yearlyDeposit;
         }

         yearlyBreakdown.push({
            year,
            deposit: frequency === 'monthly' ? yearlyInvestment : yearlyDeposit,
            balance: currentBalance,
            interest: currentBalance - totalInvested,
         });
      }

      const interestEarned = currentBalance - totalInvested;

      return {
         totalInvested,
         interestEarned,
         maturityValue: currentBalance,
         yearlyBreakdown,
      };
   }

   function createBreakdown(result, yearlyInvestment, annualRate, years, frequency) {
      const rows = [
         ['Yearly Investment', rupee.format(yearlyInvestment)],
         ['Interest Rate', `${fmt.format(annualRate)} %`],
         ['Investment Period', `${years} years`],
         ['Deposit Frequency', frequency.charAt(0).toUpperCase() + frequency.slice(1)],
         ['Total Investment', rupee.format(result.totalInvested)],
         ['Interest Earned', rupee.format(result.interestEarned)],
         ['Maturity Value', rupee.format(result.maturityValue)],
      ];

      const cells = rows
         .map(([k, v]) => `<div class="metric"><div class="k">${k}</div><div class="v">${v}</div></div>`)
         .join('');
      return `<div class="result">${cells}</div>`;
   }

   function reset() {
      $.yearlyInvestment.value = 10000;
      $.interestRate.value = 7.1;
      $.investmentPeriod.value = 15;
      $.frequency.value = 'yearly';
      $.totalInvestment.textContent = '—';
      $.interestEarned.textContent = '—';
      $.maturityValue.textContent = '—';
      $.breakdown.innerHTML = '';
      $.error.style.display = 'none';
   }

   function calculate() {
      $.error.style.display = 'none';
      $.breakdown.innerHTML = '';

      const yearlyInvestment = Number($.yearlyInvestment.value);
      const annualRate = Number($.interestRate.value);
      const years = Number($.investmentPeriod.value);
      const frequency = $.frequency.value;

      if (!isFinite(yearlyInvestment) || yearlyInvestment < 500 || yearlyInvestment > 150000) {
         showError('Yearly investment must be between ₹500 and ₹1,50,000');
         return;
      }
      if (!isFinite(annualRate) || annualRate < 6 || annualRate > 8) {
         showError('Interest rate must be between 6% and 8%');
         return;
      }
      if (!isFinite(years) || years < 15 || years > 50) {
         showError('Investment period must be between 15 and 50 years');
         return;
      }

      const result = calculatePPF(yearlyInvestment, annualRate, years, frequency);

      $.totalInvestment.textContent = rupee.format(result.totalInvested);
      $.interestEarned.textContent = rupee.format(result.interestEarned);
      $.maturityValue.textContent = rupee.format(result.maturityValue);

      $.breakdown.innerHTML = createBreakdown(result, yearlyInvestment, annualRate, years, frequency);
   }

   function exportToExcel() {
      try {
         if (typeof XLSX === 'undefined') {
            showError('Excel export library not loaded. Please refresh the page and try again.');
            return;
         }

         const yearlyInvestment = Number($.yearlyInvestment.value);
         const annualRate = Number($.interestRate.value);
         const years = Number($.investmentPeriod.value);
         const frequency = $.frequency.value;

         if (!isFinite(yearlyInvestment) || yearlyInvestment < 500 || yearlyInvestment > 150000) {
            showError('Yearly investment must be between ₹500 and ₹1,50,000');
            return;
         }
         if (!isFinite(annualRate) || annualRate < 6 || annualRate > 8) {
            showError('Interest rate must be between 6% and 8%');
            return;
         }
         if (!isFinite(years) || years < 15 || years > 50) {
            showError('Investment period must be between 15 and 50 years');
            return;
         }

         const result = calculatePPF(yearlyInvestment, annualRate, years, frequency);

         // Create workbook and worksheet
         const wb = XLSX.utils.book_new();
         const ws_data = [];

         // Add title
         ws_data.push(['PPF Calculation Details']);
         ws_data.push([]); // Empty row for spacing

         // Add input parameters
         ws_data.push(['PPF Investment Details']);
         ws_data.push(['Yearly Investment', yearlyInvestment]);
         ws_data.push(['Interest Rate', annualRate + '%']);
         ws_data.push(['Investment Period', years + ' years']);
         ws_data.push(['Deposit Frequency', frequency.charAt(0).toUpperCase() + frequency.slice(1)]);
         ws_data.push([]); // Empty row for spacing

         // Add results
         ws_data.push(['Results']);
         ws_data.push(['Total Investment', result.totalInvested]);
         ws_data.push(['Interest Earned', result.interestEarned]);
         ws_data.push(['Maturity Value', result.maturityValue]);
         ws_data.push([]); // Empty row for spacing

         // Add yearly breakdown
         ws_data.push(['Yearly Breakdown']);
         ws_data.push(['Year', 'Deposit Made', 'Interest Earned', 'Balance']);

         result.yearlyBreakdown.forEach((item) => {
            ws_data.push([
               item.year,
               Number(item.deposit.toFixed(2)),
               Number(item.interest.toFixed(2)),
               Number(item.balance.toFixed(2)),
            ]);
         });

         // Create worksheet and add to workbook
         const ws = XLSX.utils.aoa_to_sheet(ws_data);

         // Set column widths
         const wscols = [
            { wch: 15 }, // Column 1
            { wch: 15 }, // Column 2
            { wch: 15 }, // Column 3
            { wch: 15 }, // Column 4
         ];
         ws['!cols'] = wscols;

         // Add the worksheet to workbook
         XLSX.utils.book_append_sheet(wb, ws, 'PPF Details');

         // Generate and download Excel file
         const fileName = `PPF_Calculation_${new Date().toISOString().split('T')[0]}.xlsx`;
         XLSX.writeFile(wb, fileName);
      } catch (error) {
         showError('Failed to export to Excel. Error: ' + error.message);
      }
   }

   function exportToPDF() {
      try {
         if (typeof jspdf === 'undefined') {
            showError('PDF export library not loaded. Please refresh the page and try again.');
            return;
         }

         const { jsPDF } = jspdf;
         const doc = new jsPDF();

         const yearlyInvestment = Number($.yearlyInvestment.value);
         const annualRate = Number($.interestRate.value);
         const years = Number($.investmentPeriod.value);
         const frequency = $.frequency.value;

         if (!isFinite(yearlyInvestment) || yearlyInvestment < 500 || yearlyInvestment > 150000) {
            showError('Yearly investment must be between ₹500 and ₹1,50,000');
            return;
         }
         if (!isFinite(annualRate) || annualRate < 6 || annualRate > 8) {
            showError('Interest rate must be between 6% and 8%');
            return;
         }
         if (!isFinite(years) || years < 15 || years > 50) {
            showError('Investment period must be between 15 and 50 years');
            return;
         }

         const result = calculatePPF(yearlyInvestment, annualRate, years, frequency);

         // Add title
         doc.setFontSize(16);
         doc.text('PPF Calculation Report', 20, 20);
         doc.setFontSize(12);

         let yPos = 40;

         // Input details
         doc.text(`Yearly Investment: ₹${yearlyInvestment.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Interest Rate: ${annualRate}%`, 20, yPos);
         yPos += 10;
         doc.text(`Investment Period: ${years} years`, 20, yPos);
         yPos += 10;
         doc.text(`Deposit Frequency: ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`, 20, yPos);
         yPos += 20;

         // Results
         doc.text(`Total Investment: ₹${result.totalInvested.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Interest Earned: ₹${result.interestEarned.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Maturity Value: ₹${result.maturityValue.toLocaleString('en-IN')}`, 20, yPos);

         // Add footer
         doc.setFontSize(10);
         doc.text('Generated by N. Betharia & Associates', 20, 280);
         doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

         // Save PDF
         const fileName = `PPF_Calculation_${new Date().toISOString().split('T')[0]}.pdf`;
         doc.save(fileName);
      } catch (error) {
         showError('Failed to export to PDF. Error: ' + error.message);
      }
   }

   function showError(msg) {
      $.error.textContent = msg;
      $.error.style.display = 'block';
   }

   // Events
   $.calcBtn.addEventListener('click', calculate);
   $.resetBtn.addEventListener('click', reset);
   el('ppfExportBtn').addEventListener('click', exportToExcel);
   el('ppfPdfBtn').addEventListener('click', exportToPDF);

   // Initialize
   reset();

   // Make functions globally available
   window.ppfCalculator = {
      calculate,
      reset,
   };
})();
