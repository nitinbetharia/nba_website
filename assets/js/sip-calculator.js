// SIP Calculator
(function () {
   const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
   const rupee = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

   const el = (id) => document.getElementById(id);
   const $ = {
      monthlyInvestment: el('sipMonthlyInvestment'),
      expectedReturn: el('sipExpectedReturn'),
      investmentPeriod: el('sipInvestmentPeriod'),
      frequency: el('sipFrequency'),
      totalInvestment: el('sipTotalInvestment'),
      wealthGained: el('sipWealthGained'),
      futureValue: el('sipFutureValue'),
      breakdown: el('sipBreakdown'),
      error: el('sipError'),
      calcBtn: el('sipCalcBtn'),
      resetBtn: el('sipResetBtn'),
   };

   function calculateSIP(monthlyInvestment, annualReturn, years, frequency) {
      const monthlyRate = annualReturn / 100 / 12;
      const totalMonths = years * 12;

      let futureValue = 0;
      let totalInvested = 0;

      // Calculate based on frequency
      if (frequency === 'monthly') {
         // Standard SIP formula: FV = P * [(1+r)^n - 1] * (1+r)/r
         futureValue =
            monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
         totalInvested = monthlyInvestment * totalMonths;
      } else if (frequency === 'quarterly') {
         const quarterlyInvestment = monthlyInvestment * 3;
         const quarterlyRate = annualReturn / 100 / 4;
         const totalQuarters = years * 4;
         futureValue =
            quarterlyInvestment *
            ((Math.pow(1 + quarterlyRate, totalQuarters) - 1) / quarterlyRate) *
            (1 + quarterlyRate);
         totalInvested = quarterlyInvestment * totalQuarters;
      } else if (frequency === 'yearly') {
         const yearlyInvestment = monthlyInvestment * 12;
         const yearlyRate = annualReturn / 100;
         futureValue = yearlyInvestment * ((Math.pow(1 + yearlyRate, years) - 1) / yearlyRate) * (1 + yearlyRate);
         totalInvested = yearlyInvestment * years;
      }

      const wealthGained = futureValue - totalInvested;

      return {
         futureValue,
         totalInvested,
         wealthGained,
         monthlyRate,
         totalMonths,
      };
   }

   function createBreakdown(result, monthlyInvestment, annualReturn, years, frequency) {
      const rows = [
         ['Monthly Investment', rupee.format(monthlyInvestment)],
         ['Expected Annual Return', `${fmt.format(annualReturn)} %`],
         ['Investment Period', `${years} years`],
         ['Investment Frequency', frequency.charAt(0).toUpperCase() + frequency.slice(1)],
         ['Total Investment', rupee.format(result.totalInvested)],
         ['Wealth Gained', rupee.format(result.wealthGained)],
         ['Future Value', rupee.format(result.futureValue)],
      ];

      const cells = rows
         .map(([k, v]) => `<div class="metric"><div class="k">${k}</div><div class="v">${v}</div></div>`)
         .join('');
      return `<div class="result">${cells}</div>`;
   }

   function reset() {
      $.monthlyInvestment.value = 5000;
      $.expectedReturn.value = 12;
      $.investmentPeriod.value = 10;
      $.frequency.value = 'monthly';
      $.totalInvestment.textContent = '—';
      $.wealthGained.textContent = '—';
      $.futureValue.textContent = '—';
      $.breakdown.innerHTML = '';
      $.error.style.display = 'none';
   }

   function calculate() {
      $.error.style.display = 'none';
      $.breakdown.innerHTML = '';

      const monthlyInvestment = Number($.monthlyInvestment.value);
      const annualReturn = Number($.expectedReturn.value);
      const years = Number($.investmentPeriod.value);
      const frequency = $.frequency.value;

      if (!isFinite(monthlyInvestment) || monthlyInvestment < 100) {
         showError('Monthly investment must be at least ₹100');
         return;
      }
      if (!isFinite(annualReturn) || annualReturn < 1 || annualReturn > 30) {
         showError('Expected return must be between 1% and 30%');
         return;
      }
      if (!isFinite(years) || years < 1 || years > 50) {
         showError('Investment period must be between 1 and 50 years');
         return;
      }

      const result = calculateSIP(monthlyInvestment, annualReturn, years, frequency);

      $.totalInvestment.textContent = rupee.format(result.totalInvested);
      $.wealthGained.textContent = rupee.format(result.wealthGained);
      $.futureValue.textContent = rupee.format(result.futureValue);

      $.breakdown.innerHTML = createBreakdown(result, monthlyInvestment, annualReturn, years, frequency);
   }

   function exportToExcel() {
      try {
         if (typeof XLSX === 'undefined') {
            showError('Excel export library not loaded. Please refresh the page and try again.');
            return;
         }

         const monthlyInvestment = Number($.monthlyInvestment.value);
         const annualReturn = Number($.expectedReturn.value);
         const years = Number($.investmentPeriod.value);
         const frequency = $.frequency.value;

         if (!isFinite(monthlyInvestment) || monthlyInvestment < 100) {
            showError('Monthly investment must be at least ₹100');
            return;
         }
         if (!isFinite(annualReturn) || annualReturn < 1 || annualReturn > 30) {
            showError('Expected return must be between 1% and 30%');
            return;
         }
         if (!isFinite(years) || years < 1 || years > 50) {
            showError('Investment period must be between 1 and 50 years');
            return;
         }

         const result = calculateSIP(monthlyInvestment, annualReturn, years, frequency);

         // Create workbook and worksheet
         const wb = XLSX.utils.book_new();
         const ws_data = [];

         // Add title
         ws_data.push(['SIP Calculation Details']);
         ws_data.push([]); // Empty row for spacing

         // Add input parameters
         ws_data.push(['SIP Investment Details']);
         ws_data.push(['Monthly Investment', monthlyInvestment]);
         ws_data.push(['Expected Annual Return', annualReturn + '%']);
         ws_data.push(['Investment Period', years + ' years']);
         ws_data.push(['Investment Frequency', frequency.charAt(0).toUpperCase() + frequency.slice(1)]);
         ws_data.push([]); // Empty row for spacing

         // Add results
         ws_data.push(['Results']);
         ws_data.push(['Total Investment', result.totalInvested]);
         ws_data.push(['Wealth Gained', result.wealthGained]);
         ws_data.push(['Future Value', result.futureValue]);
         ws_data.push([]); // Empty row for spacing

         // Add yearly breakdown
         ws_data.push(['Yearly Breakdown']);
         ws_data.push(['Year', 'Investment Made', 'Interest Earned', 'Balance']);

         let cumulativeInvestment = 0;
         let balance = 0;

         for (let year = 1; year <= years; year++) {
            let yearlyInvestment = 0;
            let yearlyInterest = 0;

            if (frequency === 'monthly') {
               yearlyInvestment = monthlyInvestment * 12;
            } else if (frequency === 'quarterly') {
               yearlyInvestment = monthlyInvestment * 3 * 4;
            } else if (frequency === 'yearly') {
               yearlyInvestment = monthlyInvestment * 12;
            }

            cumulativeInvestment += yearlyInvestment;

            // Calculate interest for this year
            const startBalance = balance;
            balance = cumulativeInvestment * Math.pow(1 + annualReturn / 100, year);
            yearlyInterest = balance - cumulativeInvestment;

            ws_data.push([
               year,
               Number(yearlyInvestment.toFixed(2)),
               Number(yearlyInterest.toFixed(2)),
               Number(balance.toFixed(2)),
            ]);
         }

         // Create worksheet and add to workbook
         const ws = XLSX.utils.aoa_to_sheet(ws_data);

         // Set column widths
         const wscols = [
            { wch: 20 }, // Column 1
            { wch: 15 }, // Column 2
            { wch: 15 }, // Column 3
            { wch: 15 }, // Column 4
         ];
         ws['!cols'] = wscols;

         // Add the worksheet to workbook
         XLSX.utils.book_append_sheet(wb, ws, 'SIP Details');

         // Generate and download Excel file
         const fileName = `SIP_Calculation_${new Date().toISOString().split('T')[0]}.xlsx`;
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

         const monthlyInvestment = Number($.monthlyInvestment.value);
         const annualReturn = Number($.expectedReturn.value);
         const years = Number($.investmentPeriod.value);
         const frequency = $.frequency.value;

         if (!isFinite(monthlyInvestment) || monthlyInvestment < 100) {
            showError('Monthly investment must be at least ₹100');
            return;
         }
         if (!isFinite(annualReturn) || annualReturn < 1 || annualReturn > 30) {
            showError('Expected return must be between 1% and 30%');
            return;
         }
         if (!isFinite(years) || years < 1 || years > 50) {
            showError('Investment period must be between 1 and 50 years');
            return;
         }

         const result = calculateSIP(monthlyInvestment, annualReturn, years, frequency);

         // Add title
         doc.setFontSize(16);
         doc.text('SIP Calculation Report', 20, 20);
         doc.setFontSize(12);

         let yPos = 40;

         // Input details
         doc.text(`Monthly Investment: ₹${monthlyInvestment.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Expected Annual Return: ${annualReturn}%`, 20, yPos);
         yPos += 10;
         doc.text(`Investment Period: ${years} years`, 20, yPos);
         yPos += 10;
         doc.text(`Investment Frequency: ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`, 20, yPos);
         yPos += 20;

         // Results
         doc.text(`Total Investment: ₹${result.totalInvested.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Wealth Gained: ₹${result.wealthGained.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Future Value: ₹${result.futureValue.toLocaleString('en-IN')}`, 20, yPos);

         // Add footer
         doc.setFontSize(10);
         doc.text('Generated by N. Betharia & Associates', 20, 280);
         doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

         // Save PDF
         const fileName = `SIP_Calculation_${new Date().toISOString().split('T')[0]}.pdf`;
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
   el('sipExportBtn').addEventListener('click', exportToExcel);
   el('sipPdfBtn').addEventListener('click', exportToPDF);

   // Initialize
   reset();

   // Make functions globally available
   window.sipCalculator = {
      calculate,
      reset,
   };
})();
