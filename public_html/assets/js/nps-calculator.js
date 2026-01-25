// NPS Calculator
(function () {
   const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
   const rupee = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

   const el = (id) => document.getElementById(id);
   const $ = {
      monthlyContribution: el('npsMonthlyContribution'),
      expectedReturn: el('npsExpectedReturn'),
      currentAge: el('npsCurrentAge'),
      retirementAge: el('npsRetirementAge'),
      annuityPercentage: el('npsAnnuityPercentage'),
      annuityRate: el('npsAnnuityRate'),
      totalContributions: el('npsTotalContributions'),
      investmentValue: el('npsInvestmentValue'),
      monthlyPension: el('npsMonthlyPension'),
      breakdown: el('npsBreakdown'),
      error: el('npsError'),
      calcBtn: el('npsCalcBtn'),
      resetBtn: el('npsResetBtn'),
   };

   function calculateNPS(monthlyContribution, annualReturn, currentAge, retirementAge, annuityPercentage, annuityRate) {
      const investmentYears = retirementAge - currentAge;
      const totalMonths = investmentYears * 12;
      const monthlyRate = annualReturn / 100 / 12;

      // Calculate future value of regular monthly investments
      const futureValue =
         monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      const totalContributions = monthlyContribution * totalMonths;

      // Calculate annuity amount (40-60% of corpus used for annuity)
      const annuityCorpus = futureValue * (annuityPercentage / 100);
      const annualAnnuityRate = annuityRate / 100;
      const monthlyPension = (annuityCorpus * annualAnnuityRate) / 12;

      return {
         totalContributions,
         investmentValue: futureValue,
         monthlyPension,
         annuityCorpus,
         investmentYears,
      };
   }

   function createBreakdown(
      result,
      monthlyContribution,
      annualReturn,
      currentAge,
      retirementAge,
      annuityPercentage,
      annuityRate
   ) {
      const investmentYears = retirementAge - currentAge;

      const rows = [
         ['Monthly Contribution', rupee.format(monthlyContribution)],
         ['Expected Annual Return', `${fmt.format(annualReturn)} %`],
         ['Current Age', `${currentAge} years`],
         ['Retirement Age', `${retirementAge} years`],
         ['Investment Period', `${investmentYears} years`],
         ['Annuity Percentage', `${fmt.format(annuityPercentage)} %`],
         ['Annuity Rate', `${fmt.format(annuityRate)} %`],
         ['Total Contributions', rupee.format(result.totalContributions)],
         ['Investment Value at Retirement', rupee.format(result.investmentValue)],
         ['Monthly Pension', rupee.format(result.monthlyPension)],
      ];

      const cells = rows
         .map(([k, v]) => `<div class="metric"><div class="k">${k}</div><div class="v">${v}</div></div>`)
         .join('');
      return `<div class="result">${cells}</div>`;
   }

   function reset() {
      $.monthlyContribution.value = 2000;
      $.expectedReturn.value = 10;
      $.currentAge.value = 30;
      $.retirementAge.value = 60;
      $.annuityPercentage.value = 50;
      $.annuityRate.value = 6;
      $.totalContributions.textContent = '—';
      $.investmentValue.textContent = '—';
      $.monthlyPension.textContent = '—';
      $.breakdown.innerHTML = '';
      $.error.style.display = 'none';
   }

   function calculate() {
      $.error.style.display = 'none';
      $.breakdown.innerHTML = '';

      const monthlyContribution = Number($.monthlyContribution.value);
      const annualReturn = Number($.expectedReturn.value);
      const currentAge = Number($.currentAge.value);
      const retirementAge = Number($.retirementAge.value);
      const annuityPercentage = Number($.annuityPercentage.value);
      const annuityRate = Number($.annuityRate.value);

      if (!isFinite(monthlyContribution) || monthlyContribution < 100 || monthlyContribution > 50000) {
         showError('Monthly contribution must be between ₹100 and ₹50,000');
         return;
      }
      if (!isFinite(annualReturn) || annualReturn < 8 || annualReturn > 12) {
         showError('Expected return must be between 8% and 12%');
         return;
      }
      if (!isFinite(currentAge) || currentAge < 18 || currentAge >= retirementAge) {
         showError('Current age must be at least 18 and less than retirement age');
         return;
      }
      if (!isFinite(retirementAge) || retirementAge < 60 || retirementAge > 70) {
         showError('Retirement age must be between 60 and 70');
         return;
      }
      if (!isFinite(annuityPercentage) || annuityPercentage < 40 || annuityPercentage > 60) {
         showError('Annuity percentage must be between 40% and 60%');
         return;
      }
      if (!isFinite(annuityRate) || annuityRate < 5 || annuityRate > 8) {
         showError('Annuity rate must be between 5% and 8%');
         return;
      }

      const result = calculateNPS(
         monthlyContribution,
         annualReturn,
         currentAge,
         retirementAge,
         annuityPercentage,
         annuityRate
      );

      $.totalContributions.textContent = rupee.format(result.totalContributions);
      $.investmentValue.textContent = rupee.format(result.investmentValue);
      $.monthlyPension.textContent = rupee.format(result.monthlyPension);

      $.breakdown.innerHTML = createBreakdown(
         result,
         monthlyContribution,
         annualReturn,
         currentAge,
         retirementAge,
         annuityPercentage,
         annuityRate
      );
   }

   function exportToExcel() {
      try {
         if (typeof XLSX === 'undefined') {
            showError('Excel export library not loaded. Please refresh the page and try again.');
            return;
         }

         const monthlyContribution = Number($.monthlyContribution.value);
         const annualReturn = Number($.expectedReturn.value);
         const currentAge = Number($.currentAge.value);
         const retirementAge = Number($.retirementAge.value);
         const annuityPercentage = Number($.annuityPercentage.value);
         const annuityRate = Number($.annuityRate.value);

         if (!isFinite(monthlyContribution) || monthlyContribution < 100 || monthlyContribution > 50000) {
            showError('Monthly contribution must be between ₹100 and ₹50,000');
            return;
         }
         if (!isFinite(annualReturn) || annualReturn < 8 || annualReturn > 12) {
            showError('Expected return must be between 8% and 12%');
            return;
         }
         if (!isFinite(currentAge) || currentAge < 18 || currentAge >= retirementAge) {
            showError('Current age must be at least 18 and less than retirement age');
            return;
         }
         if (!isFinite(retirementAge) || retirementAge < 60 || retirementAge > 70) {
            showError('Retirement age must be between 60 and 70');
            return;
         }
         if (!isFinite(annuityPercentage) || annuityPercentage < 40 || annuityPercentage > 60) {
            showError('Annuity percentage must be between 40% and 60%');
            return;
         }
         if (!isFinite(annuityRate) || annuityRate < 5 || annuityRate > 8) {
            showError('Annuity rate must be between 5% and 8%');
            return;
         }

         const result = calculateNPS(
            monthlyContribution,
            annualReturn,
            currentAge,
            retirementAge,
            annuityPercentage,
            annuityRate
         );

         // Create workbook and worksheet
         const wb = XLSX.utils.book_new();
         const ws_data = [];

         // Add title
         ws_data.push(['NPS Calculation Details']);
         ws_data.push([]); // Empty row for spacing

         // Add input parameters
         ws_data.push(['NPS Investment Details']);
         ws_data.push(['Monthly Contribution', monthlyContribution]);
         ws_data.push(['Expected Annual Return', annualReturn + '%']);
         ws_data.push(['Current Age', currentAge + ' years']);
         ws_data.push(['Retirement Age', retirementAge + ' years']);
         ws_data.push(['Investment Period', result.investmentYears + ' years']);
         ws_data.push(['Annuity Percentage', annuityPercentage + '%']);
         ws_data.push(['Annuity Rate', annuityRate + '%']);
         ws_data.push([]); // Empty row for spacing

         // Add results
         ws_data.push(['Results']);
         ws_data.push(['Total Contributions', result.totalContributions]);
         ws_data.push(['Investment Value at Retirement', result.investmentValue]);
         ws_data.push(['Annuity Corpus', result.annuityCorpus]);
         ws_data.push(['Monthly Pension', result.monthlyPension]);
         ws_data.push([]); // Empty row for spacing

         // Add yearly breakdown
         ws_data.push(['Yearly Projection']);
         ws_data.push(['Year', 'Age', 'Cumulative Contributions', 'Projected Value']);

         const investmentYears = retirementAge - currentAge;
         const monthlyRate = annualReturn / 100 / 12;
         let cumulativeContributions = 0;
         let projectedValue = 0;

         for (let year = 1; year <= investmentYears; year++) {
            const age = currentAge + year;
            cumulativeContributions = monthlyContribution * year * 12;

            // Calculate projected value using compound interest formula
            projectedValue =
               monthlyContribution * ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) * (1 + monthlyRate);

            ws_data.push([year, age, Number(cumulativeContributions.toFixed(2)), Number(projectedValue.toFixed(2))]);
         }

         // Create worksheet and add to workbook
         const ws = XLSX.utils.aoa_to_sheet(ws_data);

         // Set column widths
         const wscols = [
            { wch: 15 }, // Column 1
            { wch: 10 }, // Column 2
            { wch: 20 }, // Column 3
            { wch: 15 }, // Column 4
         ];
         ws['!cols'] = wscols;

         // Add the worksheet to workbook
         XLSX.utils.book_append_sheet(wb, ws, 'NPS Details');

         // Generate and download Excel file
         const fileName = `NPS_Calculation_${new Date().toISOString().split('T')[0]}.xlsx`;
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

         const monthlyContribution = Number($.monthlyContribution.value);
         const annualReturn = Number($.expectedReturn.value);
         const currentAge = Number($.currentAge.value);
         const retirementAge = Number($.retirementAge.value);
         const annuityPercentage = Number($.annuityPercentage.value);
         const annuityRate = Number($.annuityRate.value);

         if (!isFinite(monthlyContribution) || monthlyContribution < 100 || monthlyContribution > 50000) {
            showError('Monthly contribution must be between ₹100 and ₹50,000');
            return;
         }
         if (!isFinite(annualReturn) || annualReturn < 8 || annualReturn > 12) {
            showError('Expected return must be between 8% and 12%');
            return;
         }
         if (!isFinite(currentAge) || currentAge < 18 || currentAge >= retirementAge) {
            showError('Current age must be at least 18 and less than retirement age');
            return;
         }
         if (!isFinite(retirementAge) || retirementAge < 60 || retirementAge > 70) {
            showError('Retirement age must be between 60 and 70');
            return;
         }
         if (!isFinite(annuityPercentage) || annuityPercentage < 40 || annuityPercentage > 60) {
            showError('Annuity percentage must be between 40% and 60%');
            return;
         }
         if (!isFinite(annuityRate) || annuityRate < 5 || annuityRate > 8) {
            showError('Annuity rate must be between 5% and 8%');
            return;
         }

         const result = calculateNPS(
            monthlyContribution,
            annualReturn,
            currentAge,
            retirementAge,
            annuityPercentage,
            annuityRate
         );

         // Add title
         doc.setFontSize(16);
         doc.text('NPS Calculation Report', 20, 20);
         doc.setFontSize(12);

         let yPos = 40;

         // Input details
         doc.text(`Monthly Contribution: ₹${monthlyContribution.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Expected Annual Return: ${annualReturn}%`, 20, yPos);
         yPos += 10;
         doc.text(`Current Age: ${currentAge} years`, 20, yPos);
         yPos += 10;
         doc.text(`Retirement Age: ${retirementAge} years`, 20, yPos);
         yPos += 10;
         doc.text(`Investment Period: ${result.investmentYears} years`, 20, yPos);
         yPos += 10;
         doc.text(`Annuity Percentage: ${annuityPercentage}%`, 20, yPos);
         yPos += 10;
         doc.text(`Annuity Rate: ${annuityRate}%`, 20, yPos);
         yPos += 20;

         // Results
         doc.text(`Total Contributions: ₹${result.totalContributions.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Investment Value at Retirement: ₹${result.investmentValue.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Annuity Corpus: ₹${result.annuityCorpus.toLocaleString('en-IN')}`, 20, yPos);
         yPos += 10;
         doc.text(`Monthly Pension: ₹${result.monthlyPension.toLocaleString('en-IN')}`, 20, yPos);

         // Add footer
         doc.setFontSize(10);
         doc.text('Generated by N. Betharia & Associates', 20, 280);
         doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

         // Save PDF
         const fileName = `NPS_Calculation_${new Date().toISOString().split('T')[0]}.pdf`;
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
   el('npsExportBtn').addEventListener('click', exportToExcel);
   el('npsPdfBtn').addEventListener('click', exportToPDF);

   // Initialize
   reset();

   // Make functions globally available
   window.npsCalculator = {
      calculate,
      reset,
   };
})();
