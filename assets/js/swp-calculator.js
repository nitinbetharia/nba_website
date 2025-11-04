// SWP Calculator
(function () {
   const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
   const rupee = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

   const el = (id) => document.getElementById(id);
   const $ = {
      initialInvestment: el('swpInitialInvestment'),
      expectedReturn: el('swpExpectedReturn'),
      monthlyWithdrawal: el('swpMonthlyWithdrawal'),
      withdrawalPeriod: el('swpWithdrawalPeriod'),
      totalWithdrawn: el('swpTotalWithdrawn'),
      remainingBalance: el('swpRemainingBalance'),
      yearsOfWithdrawal: el('swpYearsOfWithdrawal'),
      breakdown: el('swpBreakdown'),
      error: el('swpError'),
      calcBtn: el('swpCalcBtn'),
      resetBtn: el('swpResetBtn'),
   };

   function calculateSWP(initialInvestment, annualReturn, monthlyWithdrawal, maxYears) {
      const monthlyRate = annualReturn / 100 / 12;
      let balance = initialInvestment;
      let totalWithdrawn = 0;
      let months = 0;
      let yearlyBreakdown = [];

      while (balance > monthlyWithdrawal && months < maxYears * 12) {
         // Calculate interest for the month
         const monthlyInterest = balance * monthlyRate;
         balance += monthlyInterest;

         // Withdraw amount
         if (balance >= monthlyWithdrawal) {
            balance -= monthlyWithdrawal;
            totalWithdrawn += monthlyWithdrawal;
         } else {
            // Withdraw remaining balance
            totalWithdrawn += balance;
            balance = 0;
         }

         months++;

         // Record yearly data
         if (months % 12 === 0) {
            yearlyBreakdown.push({
               year: months / 12,
               balance: balance,
               withdrawn: totalWithdrawn,
               interest: monthlyInterest * 12,
            });
         }
      }

      const yearsOfWithdrawal = months / 12;

      return {
         totalWithdrawn,
         remainingBalance: balance,
         yearsOfWithdrawal,
         monthlyRate,
         yearlyBreakdown,
      };
   }

   function createBreakdown(result, initialInvestment, annualReturn, monthlyWithdrawal, maxYears) {
      const rows = [
         ['Initial Investment', rupee.format(initialInvestment)],
         ['Expected Annual Return', `${fmt.format(annualReturn)} %`],
         ['Monthly Withdrawal', rupee.format(monthlyWithdrawal)],
         ['Maximum Period', `${maxYears} years`],
         ['Total Withdrawn', rupee.format(result.totalWithdrawn)],
         ['Remaining Balance', rupee.format(result.remainingBalance)],
         ['Years of Withdrawal', `${fmt.format(result.yearsOfWithdrawal)} years`],
      ];

      const cells = rows
         .map(([k, v]) => `<div class="metric"><div class="k">${k}</div><div class="v">${v}</div></div>`)
         .join('');
      return `<div class="result">${cells}</div>`;
   }

   function reset() {
      $.initialInvestment.value = 1000000;
      $.expectedReturn.value = 8;
      $.monthlyWithdrawal.value = 20000;
      $.withdrawalPeriod.value = 20;
      $.totalWithdrawn.textContent = '—';
      $.remainingBalance.textContent = '—';
      $.yearsOfWithdrawal.textContent = '—';
      $.breakdown.innerHTML = '';
      $.error.style.display = 'none';
   }

   function calculate() {
      $.error.style.display = 'none';
      $.breakdown.innerHTML = '';

      const initialInvestment = Number($.initialInvestment.value);
      const annualReturn = Number($.expectedReturn.value);
      const monthlyWithdrawal = Number($.monthlyWithdrawal.value);
      const maxYears = Number($.withdrawalPeriod.value);

      if (!isFinite(initialInvestment) || initialInvestment < 10000) {
         showError('Initial investment must be at least ₹10,000');
         return;
      }
      if (!isFinite(annualReturn) || annualReturn < 1 || annualReturn > 30) {
         showError('Expected return must be between 1% and 30%');
         return;
      }
      if (!isFinite(monthlyWithdrawal) || monthlyWithdrawal < 1000) {
         showError('Monthly withdrawal must be at least ₹1,000');
         return;
      }
      if (!isFinite(maxYears) || maxYears < 1 || maxYears > 50) {
         showError('Withdrawal period must be between 1 and 50 years');
         return;
      }
      if (monthlyWithdrawal >= initialInvestment * (annualReturn / 100 / 12)) {
         showError('Monthly withdrawal is too high relative to expected returns');
         return;
      }

      const result = calculateSWP(initialInvestment, annualReturn, monthlyWithdrawal, maxYears);

      $.totalWithdrawn.textContent = rupee.format(result.totalWithdrawn);
      $.remainingBalance.textContent = rupee.format(result.remainingBalance);
      $.yearsOfWithdrawal.textContent = `${fmt.format(result.yearsOfWithdrawal)} years`;

      $.breakdown.innerHTML = createBreakdown(result, initialInvestment, annualReturn, monthlyWithdrawal, maxYears);
   }

   function exportToExcel() {
      try {
         if (typeof XLSX === 'undefined') {
            showError('Excel export library not loaded. Please refresh the page and try again.');
            return;
         }

         const initialInvestment = Number($.initialInvestment.value);
         const annualReturn = Number($.expectedReturn.value);
         const monthlyWithdrawal = Number($.monthlyWithdrawal.value);
         const maxYears = Number($.withdrawalPeriod.value);

         if (!isFinite(initialInvestment) || initialInvestment < 10000) {
            showError('Initial investment must be at least ₹10,000');
            return;
         }
         if (!isFinite(annualReturn) || annualReturn < 1 || annualReturn > 30) {
            showError('Expected return must be between 1% and 30%');
            return;
         }
         if (!isFinite(monthlyWithdrawal) || monthlyWithdrawal < 1000) {
            showError('Monthly withdrawal must be at least ₹1,000');
            return;
         }
         if (!isFinite(maxYears) || maxYears < 1 || maxYears > 50) {
            showError('Withdrawal period must be between 1 and 50 years');
            return;
         }

         const result = calculateSWP(initialInvestment, annualReturn, monthlyWithdrawal, maxYears);

         // Create workbook and worksheet
         const wb = XLSX.utils.book_new();
         const ws_data = [];

         // Add title
         ws_data.push(['SWP Calculation Details']);
         ws_data.push([]); // Empty row for spacing

         // Add input parameters
         ws_data.push(['SWP Investment Details']);
         ws_data.push(['Initial Investment', initialInvestment]);
         ws_data.push(['Expected Annual Return', annualReturn + '%']);
         ws_data.push(['Monthly Withdrawal', monthlyWithdrawal]);
         ws_data.push(['Maximum Period', maxYears + ' years']);
         ws_data.push([]); // Empty row for spacing

         // Add results
         ws_data.push(['Results']);
         ws_data.push(['Total Withdrawn', result.totalWithdrawn]);
         ws_data.push(['Remaining Balance', result.remainingBalance]);
         ws_data.push(['Years of Withdrawal', result.yearsOfWithdrawal]);
         ws_data.push([]); // Empty row for spacing

         // Add yearly breakdown
         ws_data.push(['Yearly Breakdown']);
         ws_data.push(['Year', 'Starting Balance', 'Interest Earned', 'Withdrawal', 'Ending Balance']);

         const monthlyRate = annualReturn / 100 / 12;
         let balance = initialInvestment;
         let totalWithdrawn = 0;

         for (let year = 1; year <= Math.ceil(result.yearsOfWithdrawal); year++) {
            let yearlyInterest = 0;
            let yearlyWithdrawal = 0;
            const startingBalance = balance;

            for (let month = 1; month <= 12 && balance > 0; month++) {
               // Calculate interest for the month
               const monthlyInterest = balance * monthlyRate;
               balance += monthlyInterest;
               yearlyInterest += monthlyInterest;

               // Withdraw amount
               if (balance >= monthlyWithdrawal) {
                  balance -= monthlyWithdrawal;
                  yearlyWithdrawal += monthlyWithdrawal;
                  totalWithdrawn += monthlyWithdrawal;
               } else if (balance > 0) {
                  // Withdraw remaining balance
                  yearlyWithdrawal += balance;
                  totalWithdrawn += balance;
                  balance = 0;
               }
            }

            ws_data.push([
               year,
               Number(startingBalance.toFixed(2)),
               Number(yearlyInterest.toFixed(2)),
               Number(yearlyWithdrawal.toFixed(2)),
               Number(balance.toFixed(2)),
            ]);

            if (balance <= 0) break;
         }

         // Create worksheet and add to workbook
         const ws = XLSX.utils.aoa_to_sheet(ws_data);

         // Set column widths
         const wscols = [
            { wch: 15 }, // Column 1
            { wch: 15 }, // Column 2
            { wch: 15 }, // Column 3
            { wch: 15 }, // Column 4
            { wch: 15 }, // Column 5
         ];
         ws['!cols'] = wscols;

         // Add the worksheet to workbook
         XLSX.utils.book_append_sheet(wb, ws, 'SWP Details');

         // Generate and download Excel file
         const fileName = `SWP_Calculation_${new Date().toISOString().split('T')[0]}.xlsx`;
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

         const initialInvestment = Number($.initialInvestment.value);
         const annualReturn = Number($.expectedReturn.value);
         const monthlyWithdrawal = Number($.monthlyWithdrawal.value);
         const maxYears = Number($.withdrawalPeriod.value);

         if (!isFinite(initialInvestment) || initialInvestment < 10000) {
            showError('Initial investment must be at least ₹10,000');
            return;
         }
         if (!isFinite(annualReturn) || annualReturn < 1 || annualReturn > 30) {
            showError('Expected return must be between 1% and 30%');
            return;
         }
         if (!isFinite(monthlyWithdrawal) || monthlyWithdrawal < 1000) {
            showError('Monthly withdrawal must be at least ₹1,000');
            return;
         }
         if (!isFinite(maxYears) || maxYears < 1 || maxYears > 50) {
            showError('Withdrawal period must be between 1 and 50 years');
            return;
         }

         const result = calculateSWP(initialInvestment, annualReturn, monthlyWithdrawal, maxYears);

         // Add title
         doc.setFontSize(16);
         doc.text('SWP Calculation Report', 20, 20);
         doc.setFontSize(12);

         let yPos = 40;

         // Input details
         doc.text(`Initial Investment: ₹${initialInvestment.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Expected Annual Return: ${annualReturn}%`, 20, yPos);
         yPos += 10;
         doc.text(`Monthly Withdrawal: ₹${monthlyWithdrawal.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Maximum Period: ${maxYears} years`, 20, yPos);
         yPos += 20;

         // Results
         doc.text(`Total Withdrawn: ₹${result.totalWithdrawn.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Remaining Balance: ₹${result.remainingBalance.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Years of Withdrawal: ${result.yearsOfWithdrawal.toFixed(1)} years`, 20, yPos);

         // Add footer
         doc.setFontSize(10);
         doc.text('Generated by N. Betharia & Associates', 20, 280);
         doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

         // Save PDF
         const fileName = `SWP_Calculation_${new Date().toISOString().split('T')[0]}.pdf`;
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
   el('swpExportBtn').addEventListener('click', exportToExcel);
   el('swpPdfBtn').addEventListener('click', exportToPDF);

   // Initialize
   reset();

   // Make functions globally available
   window.swpCalculator = {
      calculate,
      reset,
   };
})();
