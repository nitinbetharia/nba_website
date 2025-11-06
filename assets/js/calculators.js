/* Deposit calculator: FD and RD
   - FD formula: A = P * (1 + r/n)^(n*t)
   - RD formula with general frequencies:
       m = D * t years  // number of deposits
       i_p = (1 + r/C)^(C/D) - 1  // effective rate per deposit period
       A = I * [((1 + i_p)^m - 1) / i_p] * (timing === 'due' ? (1 + i_p) : 1)
   Where:
     r = nominal annual rate as decimal
     C = compounding periods per year
     D = deposit frequency per year (RD)
     t = term in years (can be fractional)
*/
(function () {
   'use strict';

   const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
   const rupee = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

   const el = (id) => document.getElementById(id);
   const $ = {
      depositType: el('depositType'),
      compounding: el('compounding'),
      principal: el('principal'),
      installment: el('installment'),
      rate: el('rate'),
      periodValue: el('periodValue'),
      periodUnit: el('periodUnit'),
      depositFreq: el('depositFreq'),
      rdTiming: el('rdTiming'),
      maturity: el('maturity'),
      totalDeposit: el('totalDeposit'),
      interestEarned: el('interestEarned'),
      breakdown: el('breakdown'),
      scheduleWrap: el('scheduleWrap'),
      schedule: el('schedule'),
      error: el('error'),
      calcBtn: el('calcBtn'),
      resetBtn: el('resetBtn'),
      fdRdExportBtn: el('fdRdExportBtn'),
      fdRdPdfBtn: el('fdRdPdfBtn'),
   };

   function toggleRD() {
      const isRD = $.depositType.value === 'rd';
      document.querySelectorAll('.fd-only').forEach((n) => n.classList.toggle('hidden', isRD));
      document.querySelectorAll('.rd-only').forEach((n) => n.classList.toggle('hidden', !isRD));
      $.scheduleWrap.classList.toggle('hidden', !isRD);
   }

   function toYears(value, unit) {
      const v = Number(value);
      if (!(v >= 0)) return NaN;
      switch (unit) {
         case 'years':
            return v;
         case 'months':
            return v / 12;
         case 'days':
            return v / 365;
         default:
            return NaN;
      }
   }

   function calcFD(P, r, C, years) {
      const A = P * Math.pow(1 + r / C, C * years);
      return { maturity: A, totalDeposit: P, interest: A - P };
   }

   // Equivalent rate per deposit period when compounding differs
   function ratePerDeposit(r, C, D) {
      // guard D=0
      if (D <= 0) return NaN;
      return Math.pow(1 + r / C, C / D) - 1;
   }

   function calcRD(I, r, C, D, years, timing) {
      const m = Math.round(D * years); // number of installments, integer count
      const ip = ratePerDeposit(r, C, D);
      if (!isFinite(ip) || ip < -0.999999) return { error: 'Invalid effective rate' };
      let factor;
      if (Math.abs(ip) < 1e-12) {
         factor = m; // zero rate fallback
      } else {
         factor = (Math.pow(1 + ip, m) - 1) / ip;
      }
      const multiplier = timing === 'due' ? 1 + ip : 1;
      const A = I * factor * multiplier;
      const totalDeposit = I * m;
      return { maturity: A, totalDeposit, interest: A - totalDeposit, m, ip };
   }

   function renderSchedule(I, ip, m, timing) {
      // Simple geometric accumulation schedule at deposit frequency granularity
      const rows = [];
      let balance = 0;
      for (let k = 1; k <= m; k++) {
         if (timing === 'due') balance += I; // deposit at beginning
         const interest = balance * ip;
         balance += interest;
         if (timing === 'ordinary') balance += I; // deposit at end
         if (k <= 5 || k > m - 5) {
            rows.push({
               period: k,
               deposit: I,
               interest,
               balance,
            });
         }
      }
      // Build table
      const header = `<tr><th>Period</th><th>Deposit</th><th>Interest</th><th>Balance</th></tr>`;
      const body = rows
         .map(
            (r) =>
               `<tr><td>${r.period}</td><td>${rupee.format(r.deposit)}</td><td>${rupee.format(
                  r.interest
               )}</td><td>${rupee.format(r.balance)}</td></tr>`
         )
         .join('');
      $.schedule.innerHTML = header + body;
   }

   function reset() {
      $.principal.value = 100000;
      $.installment.value = 5000;
      $.rate.value = 7.5;
      $.periodValue.value = 24;
      $.periodUnit.value = 'months';
      $.compounding.value = '12';
      $.depositFreq.value = '12';
      $.rdTiming.value = 'ordinary';
      $.maturity.textContent = '—';
      $.totalDeposit.textContent = '—';
      $.interestEarned.textContent = '—';
      $.breakdown.innerHTML = '';
      $.schedule.innerHTML = '';
      $.scheduleWrap.classList.add('hidden');
      $.error.style.display = 'none';
      toggleRD();
   }

   function showError(msg) {
      $.error.textContent = msg;
      $.error.style.display = 'block';
   }

   function calc() {
      $.error.style.display = 'none';
      $.breakdown.innerHTML = '';
      $.schedule.innerHTML = '';

      const type = $.depositType.value;
      const C = Number($.compounding.value);
      const r = Number($.rate.value) / 100;
      const years = toYears($.periodValue.value, $.periodUnit.value);

      if (!isFinite(C) || C <= 0) return showError('Invalid compounding');
      if (!isFinite(r) || r < 0 || r > 1) return showError('Rate must be between 0 and 100');
      if (!isFinite(years) || years <= 0) return showError('Period must be positive');

      if (type === 'fd') {
         const P = Number($.principal.value);
         if (!isFinite(P) || P <= 0) return showError('Deposit amount must be positive');
         const res = calcFD(P, r, C, years);
         writeResult(res);
         $.breakdown.innerHTML = makeBreakdown({
            rows: [
               ['Type', 'Fixed Deposit'],
               ['Deposit amount', rupee.format(P)],
               ['Rate (p.a.)', `${fmt.format(r * 100)} %`],
               ['Compounding', compLabel(C)],
               ['Term (years)', fmt.format(years)],
            ],
         });
      } else {
         const I = Number($.installment.value);
         const D = Number($.depositFreq.value);
         const timing = $.rdTiming.value;
         if (!isFinite(I) || I <= 0) return showError('Installment amount must be positive');
         if (!isFinite(D) || D <= 0) return showError('Deposit frequency invalid');

         const res = calcRD(I, r, C, D, years, timing);
         if (res.error) return showError(res.error);
         writeResult(res);

         const ipPct = (res.ip ?? 0) * 100;
         $.breakdown.innerHTML = makeBreakdown({
            rows: [
               ['Type', 'Recurring Deposit'],
               ['Installment amount', rupee.format(I)],
               ['Rate (p.a.)', `${fmt.format(r * 100)} %`],
               ['Compounding', compLabel(C)],
               ['Deposit frequency', depLabel(D)],
               ['Payment timing', timing === 'due' ? 'Beginning (annuity due)' : 'End (ordinary)'],
               ['Installments', String(res.m)],
               ['Effective rate per deposit period', `${fmt.format(ipPct)} %`],
               ['Term (years)', fmt.format(years)],
            ],
         });

         $.scheduleWrap.classList.remove('hidden');
         renderSchedule(I, res.ip, res.m, timing);
      }
   }

   function compLabel(C) {
      switch (Number(C)) {
         case 1:
            return 'Yearly';
         case 2:
            return 'Half-yearly';
         case 4:
            return 'Quarterly';
         case 12:
            return 'Monthly';
         case 365:
            return 'Daily';
         default:
            return `${C} per year`;
      }
   }
   function depLabel(D) {
      switch (Number(D)) {
         case 1:
            return 'Yearly';
         case 4:
            return 'Quarterly';
         case 12:
            return 'Monthly';
         default:
            return `${D} / year`;
      }
   }

   function makeBreakdown({ rows }) {
      const cells = rows
         .map(([k, v]) => `<div class="metric"><div class="k">${k}</div><div class="v">${v}</div></div>`)
         .join('');
      return `<div class="result">${cells}</div>`;
   }

   function writeResult({ maturity, totalDeposit, interest }) {
      $.maturity.textContent = rupee.format(maturity);
      $.totalDeposit.textContent = rupee.format(totalDeposit);
      $.interestEarned.textContent = rupee.format(interest);
   }

   function exportToExcel() {
      try {
         if (typeof XLSX === 'undefined') {
            showError('Excel export library not loaded. Please refresh the page and try again.');
            return;
         }

         const type = $.depositType.value;
         const C = Number($.compounding.value);
         const r = Number($.rate.value) / 100;
         const years = toYears($.periodValue.value, $.periodUnit.value);

         if (!isFinite(C) || C <= 0) return showError('Invalid compounding');
         if (!isFinite(r) || r < 0 || r > 1) return showError('Rate must be between 0 and 100');
         if (!isFinite(years) || years <= 0) return showError('Period must be positive');

         // Create workbook and worksheet
         const wb = XLSX.utils.book_new();
         const ws_data = [];

         // Add title
         ws_data.push([`${type.toUpperCase()} Calculation Details`]);
         ws_data.push([]); // Empty row for spacing

         if (type === 'fd') {
            const P = Number($.principal.value);
            if (!isFinite(P) || P <= 0) return showError('Deposit amount must be positive');
            const res = calcFD(P, r, C, years);

            // Add input parameters
            ws_data.push(['Fixed Deposit Details']);
            ws_data.push(['Deposit Amount', P]);
            ws_data.push(['Annual Interest Rate', r * 100 + '%']);
            ws_data.push(['Compounding Frequency', compLabel(C)]);
            ws_data.push(['Term (Years)', years]);
            ws_data.push(['Maturity Value', res.maturity]);
            ws_data.push(['Total Interest', res.interest]);
            ws_data.push([]); // Empty row for spacing
         } else {
            const I = Number($.installment.value);
            const D = Number($.depositFreq.value);
            const timing = $.rdTiming.value;
            if (!isFinite(I) || I <= 0) return showError('Installment amount must be positive');
            if (!isFinite(D) || D <= 0) return showError('Deposit frequency invalid');

            const res = calcRD(I, r, C, D, years, timing);
            if (res.error) return showError(res.error);

            // Add input parameters
            ws_data.push(['Recurring Deposit Details']);
            ws_data.push(['Installment Amount', I]);
            ws_data.push(['Annual Interest Rate', r * 100 + '%']);
            ws_data.push(['Compounding Frequency', compLabel(C)]);
            ws_data.push(['Deposit Frequency', depLabel(D)]);
            ws_data.push(['Payment Timing', timing === 'due' ? 'Beginning of period' : 'End of period']);
            ws_data.push(['Term (Years)', years]);
            ws_data.push(['Number of Installments', res.m]);
            ws_data.push(['Maturity Value', res.maturity]);
            ws_data.push(['Total Interest', res.interest]);
            ws_data.push([]); // Empty row for spacing

            // Add installment schedule
            ws_data.push(['Installment Schedule']);
            ws_data.push(['Period', 'Deposit', 'Interest', 'Balance']);

            // Generate schedule data
            const m = Math.round(D * years);
            const ip = ratePerDeposit(r, C, D);
            let balance = 0;
            for (let k = 1; k <= m; k++) {
               if (timing === 'due') balance += I; // deposit at beginning
               const interest = balance * ip;
               balance += interest;
               if (timing === 'ordinary') balance += I; // deposit at end

               if (k <= 5 || k > m - 5) {
                  // Show first and last 5 entries
                  ws_data.push([k, Number(I.toFixed(2)), Number(interest.toFixed(2)), Number(balance.toFixed(2))]);
               }
            }
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
         XLSX.utils.book_append_sheet(wb, ws, `${type.toUpperCase()} Details`);

         // Generate and download Excel file
         const fileName = `${type.toUpperCase()}_Calculation_${new Date().toISOString().split('T')[0]}.xlsx`;
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

         const type = $.depositType.value;
         const C = Number($.compounding.value);
         const r = Number($.rate.value) / 100;
         const years = toYears($.periodValue.value, $.periodUnit.value);

         if (!isFinite(C) || C <= 0) return showError('Invalid compounding');
         if (!isFinite(r) || r < 0 || r > 1) return showError('Rate must be between 0 and 100');
         if (!isFinite(years) || years <= 0) return showError('Period must be positive');

         // Add title
         doc.setFontSize(16);
         doc.text(`${type.toUpperCase()} Calculation Report`, 20, 20);
         doc.setFontSize(12);

         let yPos = 40;

         if (type === 'fd') {
            const P = Number($.principal.value);
            if (!isFinite(P) || P <= 0) return showError('Deposit amount must be positive');
            const res = calcFD(P, r, C, years);

            doc.text(`Deposit Amount: ₹${P.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Annual Interest Rate: ${(r * 100).toFixed(2)}%`, 20, yPos);
            yPos += 10;
            doc.text(`Compounding Frequency: ${compLabel(C)}`, 20, yPos);
            yPos += 10;
            doc.text(`Term: ${years} years`, 20, yPos);
            yPos += 20;

            doc.text(`Maturity Value: ₹${res.maturity.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Total Interest: ₹${res.interest.toLocaleString('en-IN')}`, 20, yPos);
         } else {
            const I = Number($.installment.value);
            const D = Number($.depositFreq.value);
            const timing = $.rdTiming.value;
            if (!isFinite(I) || I <= 0) return showError('Installment amount must be positive');
            if (!isFinite(D) || D <= 0) return showError('Deposit frequency invalid');

            const res = calcRD(I, r, C, D, years, timing);
            if (res.error) return showError(res.error);

            doc.text(`Installment Amount: ₹${I.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Annual Interest Rate: ${(r * 100).toFixed(2)}%`, 20, yPos);
            yPos += 10;
            doc.text(`Compounding Frequency: ${compLabel(C)}`, 20, yPos);
            yPos += 10;
            doc.text(`Deposit Frequency: ${depLabel(D)}`, 20, yPos);
            yPos += 10;
            doc.text(`Payment Timing: ${timing === 'due' ? 'Beginning of period' : 'End of period'}`, 20, yPos);
            yPos += 10;
            doc.text(`Term: ${years} years`, 20, yPos);
            yPos += 20;

            doc.text(`Number of Installments: ${res.m}`, 20, yPos);
            yPos += 10;
            doc.text(`Maturity Value: ₹${res.maturity.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Total Interest: ₹${res.interest.toLocaleString('en-IN')}`, 20, yPos);
         }

         // Add footer
         doc.setFontSize(10);
         doc.text('Generated by N. Betharia & Associates', 20, 280);
         doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

         // Save PDF
         const fileName = `${type.toUpperCase()}_Calculation_${new Date().toISOString().split('T')[0]}.pdf`;
         doc.save(fileName);
      } catch (error) {
         showError('Failed to export to PDF. Error: ' + error.message);
      }
   }

   // Initialize event listeners safely
   function initializeEventListeners() {
      if ($.depositType) $.depositType.addEventListener('change', toggleRD);
      if ($.calcBtn) $.calcBtn.addEventListener('click', calc);
      if ($.resetBtn) $.resetBtn.addEventListener('click', reset);
      if ($.fdRdExportBtn) $.fdRdExportBtn.addEventListener('click', exportToExcel);
      if ($.fdRdPdfBtn) $.fdRdPdfBtn.addEventListener('click', exportToPDF);
   }

   // Initialize when DOM is ready
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
         setTimeout(() => {
            initializeEventListeners();
            toggleRD();
         }, 100);
      });
   } else {
      setTimeout(() => {
         initializeEventListeners();
         toggleRD();
      }, 100);
   }
})();
