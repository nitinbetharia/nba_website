/* EMI Calculator
   Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
   where:
   P = Principal (loan amount)
   r = Monthly interest rate (annual rate / 12 / 100)
   n = Total number of months
*/
// Wait for both DOM and Bootstrap to be ready
(function () {
   'use strict';

   function initCalculator() {
      const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
      const rupee = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

      const el = (id) => document.getElementById(id);
      let $ = {};

      function initializeElements() {
         $ = {
            loanAmount: el('loanAmount'),
            loanRate: el('loanRate'),
            loanTerm: el('loanTerm'),
            loanTermUnit: el('loanTermUnit'),
            monthlyEmi: el('monthlyEmi'),
            totalPayment: el('totalPayment'),
            totalInterest: el('totalInterest'),
            emiBreakdown: el('emiBreakdown'),
            emiSchedule: el('emiSchedule'),
            emiError: el('emiError'),
            emiCalcBtn: el('emiCalcBtn'),
            emiResetBtn: el('emiResetBtn'),
            emiExportBtn: el('emiExportBtn'),
            emiPdfBtn: el('emiPdfBtn'),
         };

         // Set up event listeners after elements are initialized
         if ($.emiCalcBtn) $.emiCalcBtn.addEventListener('click', calculate);
         if ($.emiResetBtn) $.emiResetBtn.addEventListener('click', reset);
         if ($.emiExportBtn)
            $.emiExportBtn.addEventListener('click', () => {
               const P = Number($.loanAmount.value);
               const r = Number($.loanRate.value);
               const months = toMonths($.loanTerm.value, $.loanTermUnit.value);
               const { emi } = calculateEMI(P, r, months);
               const schedule = generateSchedule(P, emi, r, months);
               exportToExcel(P, r, schedule);
            });
         if ($.emiPdfBtn)
            $.emiPdfBtn.addEventListener('click', () => {
               const P = Number($.loanAmount.value);
               const r = Number($.loanRate.value);
               const months = toMonths($.loanTerm.value, $.loanTermUnit.value);
               const { emi } = calculateEMI(P, r, months);
               const schedule = generateSchedule(P, emi, r, months);
               exportToPDF(P, r, schedule);
            });
      }

      function toMonths(value, unit) {
         const v = Number(value);
         if (!(v >= 0)) return NaN;
         switch (unit) {
            case 'years':
               return v * 12;
            case 'months':
               return v;
            default:
               return NaN;
         }
      }

      function calculateEMI(P, r, n) {
         const monthlyRate = r / 12 / 100; // Convert annual rate to monthly decimal
         if (monthlyRate === 0) {
            // Special case: zero interest
            const emi = P / n;
            return {
               emi,
               totalPayment: emi * n,
               totalInterest: 0,
            };
         }
         const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
         const totalPayment = emi * n;
         return {
            emi,
            totalPayment,
            totalInterest: totalPayment - P,
         };
      }

      function generateSchedule(P, emi, r, n) {
         const monthlyRate = r / 12 / 100;
         const rows = [];
         let remainingPrincipal = P;

         for (let month = 1; month <= n; month++) {
            const interestPayment = remainingPrincipal * monthlyRate;
            const principalPayment = emi - interestPayment;
            remainingPrincipal -= principalPayment;

            if (month <= 5 || month > n - 5) {
               rows.push({
                  month,
                  emi,
                  principal: principalPayment,
                  interest: interestPayment,
                  balance: remainingPrincipal,
               });
            }
         }

         // Build table
         const header = `<tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>`;
         const body = rows
            .map(
               (r) =>
                  `<tr><td>${r.month}</td><td>${rupee.format(r.emi)}</td><td>${rupee.format(
                     r.principal
                  )}</td><td>${rupee.format(r.interest)}</td><td>${rupee.format(r.balance)}</td></tr>`
            )
            .join('');
         $.emiSchedule.innerHTML = header + body;
         return rows;
      }

      function exportToExcel(P, r, schedule) {
         try {
            if (typeof XLSX === 'undefined') {
               showError('Excel export library not loaded. Please refresh the page and try again.');
               return;
            }

            const months = schedule[schedule.length - 1].month;
            const monthlyRate = r / 12 / 100;
            let remainingPrincipal = P;
            const emi = schedule[0].emi;

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws_data = [];

            // Add title
            ws_data.push(['EMI Calculation Details']);
            ws_data.push([]); // Empty row for spacing

            // Add input parameters
            ws_data.push(['Loan Details']);
            ws_data.push(['Loan Amount', P]);
            ws_data.push(['Annual Interest Rate', r]);
            ws_data.push(['Loan Term', months]);
            ws_data.push(['Monthly Interest Rate', r / 12]);
            ws_data.push(['Monthly EMI', emi]);
            const totalAmount = emi * months;
            ws_data.push(['Total Payment', totalAmount]);
            ws_data.push(['Total Interest', totalAmount - P]);
            ws_data.push([]); // Empty row for spacing

            // Add amortization schedule header
            ws_data.push(['Monthly Amortization Schedule']);
            ws_data.push(['Month', 'EMI', 'Principal Payment', 'Interest Payment', 'Remaining Balance']);

            // Add monthly data
            for (let month = 1; month <= months; month++) {
               const interestPayment = remainingPrincipal * monthlyRate;
               const principalPayment = emi - interestPayment;
               remainingPrincipal -= principalPayment;

               ws_data.push([
                  month,
                  Number(emi.toFixed(2)),
                  Number(principalPayment.toFixed(2)),
                  Number(interestPayment.toFixed(2)),
                  Number(remainingPrincipal.toFixed(2)),
               ]);
            }

            // Create worksheet and add to workbook
            const ws = XLSX.utils.aoa_to_sheet(ws_data);

            // Set column widths
            const wscols = [
               { wch: 10 }, // Month
               { wch: 15 }, // EMI
               { wch: 15 }, // Principal
               { wch: 15 }, // Interest
               { wch: 15 }, // Balance
            ];
            ws['!cols'] = wscols;

            // Add the worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'EMI Schedule');

            // Generate and download Excel file
            XLSX.writeFile(wb, 'EMI_Calculation_Details.xlsx');
         } catch (error) {
            showError('Failed to export to Excel. Error: ' + error.message);
         }
      }

      function exportToPDF(P, r, schedule) {
         try {
            if (typeof jspdf === 'undefined') {
               showError('PDF export library not loaded. Please refresh the page and try again.');
               return;
            }

            const { jsPDF } = jspdf;
            const doc = new jsPDF();

            const months = schedule[schedule.length - 1].month;
            const emi = schedule[0].emi;
            const totalAmount = emi * months;
            const totalInterest = totalAmount - P;

            // Add title
            doc.setFontSize(16);
            doc.text('EMI Calculation Report', 20, 20);
            doc.setFontSize(12);

            let yPos = 40;

            // Loan details
            doc.text(`Loan Amount: ₹${P.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Annual Interest Rate: ${r.toFixed(2)}%`, 20, yPos);
            yPos += 10;
            doc.text(`Loan Term: ${months} months`, 20, yPos);
            yPos += 10;
            doc.text(`Monthly EMI: ₹${emi.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Total Payment: ₹${totalAmount.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Total Interest: ₹${totalInterest.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 20;

            // Add EMI schedule summary (first 5 and last 5 entries)
            doc.text('EMI Schedule Summary:', 20, yPos);
            yPos += 10;

            doc.setFontSize(10);
            doc.text('Month    EMI         Principal    Interest     Balance', 20, yPos);
            yPos += 10;

            schedule.forEach((row, index) => {
               if (yPos > 250) return; // Avoid page overflow
               const line = `${row.month.toString().padEnd(8)} ${row.emi.toFixed(0).padEnd(11)} ${row.principal
                  .toFixed(0)
                  .padEnd(12)} ${row.interest.toFixed(0).padEnd(12)} ${row.balance.toFixed(0)}`;
               doc.text(line, 20, yPos);
               yPos += 8;
            });

            // Add footer
            doc.setFontSize(10);
            doc.text('Generated by N. Betharia & Associates', 20, 280);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

            // Save PDF
            const fileName = `EMI_Calculation_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
         } catch (error) {
            showError('Failed to export to PDF. Error: ' + error.message);
         }
      }

      function reset() {
         $.loanAmount.value = 1000000;
         $.loanRate.value = 8.5;
         $.loanTerm.value = 20;
         $.loanTermUnit.value = 'months';
         $.monthlyEmi.textContent = '—';
         $.totalPayment.textContent = '—';
         $.totalInterest.textContent = '—';
         $.emiBreakdown.innerHTML = '';
         $.emiSchedule.innerHTML = '';
         $.emiError.style.display = 'none';
      }

      function showError(msg) {
         $.emiError.textContent = msg;
         $.emiError.style.display = 'block';
      }

      function calculate() {
         $.emiError.style.display = 'none';
         $.emiBreakdown.innerHTML = '';
         $.emiSchedule.innerHTML = '';

         const P = Number($.loanAmount.value);
         const r = Number($.loanRate.value);
         const months = toMonths($.loanTerm.value, $.loanTermUnit.value);

         if (!isFinite(P) || P <= 0) return showError('Loan amount must be positive');
         if (!isFinite(r) || r < 0 || r > 100) return showError('Rate must be between 0 and 100');
         if (!isFinite(months) || months <= 0) return showError('Term must be positive');

         const { emi, totalPayment, totalInterest } = calculateEMI(P, r, months);

         // Display results
         $.monthlyEmi.textContent = rupee.format(emi);
         $.totalPayment.textContent = rupee.format(totalPayment);
         $.totalInterest.textContent = rupee.format(totalInterest);

         $.emiBreakdown.innerHTML = makeBreakdown({
            rows: [
               ['Loan amount', rupee.format(P)],
               ['Interest rate (p.a.)', `${fmt.format(r)} %`],
               ['Term (months)', String(months)],
               ['Monthly rate', `${fmt.format(r / 12)} %`],
            ],
         });

         const schedule = generateSchedule(P, emi, r, months);

         // Store schedule for export
         $.emiExportBtn.onclick = () => exportToExcel(P, r, schedule);
      }

      function makeBreakdown({ rows }) {
         const cells = rows
            .map(([k, v]) => `<div class="metric"><div class="k">${k}</div><div class="v">${v}</div></div>`)
            .join('');
         return `<div class="result">${cells}</div>`;
      }

      // Initialize
      initializeElements();
      reset();
   }

   // Initialize when both DOM and Bootstrap are ready
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
         // Wait for Bootstrap to initialize
         setTimeout(initCalculator, 100);
      });
   } else {
      // DOM already loaded, wait for Bootstrap
      setTimeout(initCalculator, 100);
   }
})();
