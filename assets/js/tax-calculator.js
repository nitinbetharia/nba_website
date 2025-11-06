// Income Tax Calculator Implementation
window.addEventListener('DOMContentLoaded', function initTaxCalculator() {
   // Verify dependencies
   if (!window.TaxCalculator || !window.taxRates || !window.deductionLimits) {
      console.error('Required tax calculator dependencies not found:', {
         TaxCalculator: !!window.TaxCalculator,
         taxRates: !!window.taxRates,
         deductionLimits: !!window.deductionLimits,
      });
      return;
   }

   // Dependencies verified
   const calculator = {
      init: function () {
         // Initialize calculator even if some dependencies aren't loaded
         this.bindElements();
         this.setupFinancialYears();
         this.setupTooltips();
         this.bindEvents();
         this.setDefaults();

         // If tax rates aren't loaded yet, try again after a short delay
         if (!window.taxRates) {
            console.warn('Tax rates not loaded yet, retrying in 500ms...');
            setTimeout(() => {
               this.setupFinancialYears();
            }, 500);
         }
      },

      setDefaults: function () {
         // Set default values for form fields
         if (!this.form) {
            console.error('Form not found during setDefaults');
            return;
         }

         // Set default values

         // First set financial year
         const financialYear = document.getElementById('financialYear');
         if (financialYear && financialYear.options.length > 0) {
            // Try to select 2024-25 specifically
            for (let i = 0; i < financialYear.options.length; i++) {
               if (financialYear.options[i].value === '2024-25') {
                  financialYear.selectedIndex = i;
                  break;
               }
            }
            // If 2024-25 not found, select first non-empty option
            if (!financialYear.value && financialYear.options.length > 1) {
               financialYear.selectedIndex = 1;
            }
            // Default financial year set
         }

         // Set regime
         const regime = document.getElementById('regime');
         if (regime) {
            regime.value = 'new';
            // Default regime set to new
         }

         // Get form elements by ID to ensure we're setting the right ones
         const elements = {
            age: document.getElementById('age'),
            salary: document.getElementById('salary'),
            otherIncome: document.getElementById('otherIncome'),
            '80C': document.getElementById('80C'),
            '80D': document.getElementById('80D'),
            hra: document.getElementById('hra'),
            rentPaid: document.getElementById('rentPaid'),
         };

         // Set values only if elements exist
         if (elements.age) elements.age.value = '30';
         if (elements.salary) elements.salary.value = '750000';
         if (elements.otherIncome) elements.otherIncome.value = '0';
         if (elements['80C']) elements['80C'].value = '150000';
         if (elements['80D']) elements['80D'].value = '25000';
         if (elements.hra) elements.hra.value = '0';
         if (elements.rentPaid) elements.rentPaid.value = '0';

         // Update display based on regime
         this.toggleDeductionFields();
      },

      bindElements: function () {
         this.form = document.getElementById('taxCalculatorForm');
         this.resultDiv = document.getElementById('taxResult');
         this.breakdownDiv = document.getElementById('taxBreakdown');
         this.comparisonDiv = document.getElementById('regimeComparison');

         // Setup Bootstrap tooltips
         const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
         tooltips.forEach((tooltip) => {
            new bootstrap.Tooltip(tooltip);
         });
      },

      bindEvents: function () {
         this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateTax();
         });

         // Add export button event listener
         const exportBtn = document.getElementById('taxExportBtn');
         if (exportBtn) {
            exportBtn.addEventListener('click', () => {
               this.exportToExcel();
            });
         }

         const pdfBtn = document.getElementById('taxPdfBtn');
         if (pdfBtn) {
            pdfBtn.addEventListener('click', () => {
               this.exportToPDF();
            });
         }

         // Dynamic form updates based on selected options
         document.getElementById('assesseeType').addEventListener('change', () => {
            this.updateAgeField();
         });

         document.getElementById('hasRentalIncome').addEventListener('change', () => {
            this.toggleRentalIncomeFields();
         });

         document.getElementById('regime').addEventListener('change', () => {
            this.toggleDeductionFields();
         });
      },

      setupFinancialYears: function () {
         const fySelect = document.getElementById('financialYear');
         if (!fySelect) {
            console.error('Financial year select element not found');
            return;
         }

         // Clear existing options
         while (fySelect.firstChild) {
            fySelect.removeChild(fySelect.firstChild);
         }

         // Add an empty option first
         const emptyOption = document.createElement('option');
         emptyOption.value = '';
         emptyOption.textContent = '-- Select Financial Year --';
         fySelect.appendChild(emptyOption);

         // Check if tax rates are loaded, otherwise use fallback years
         if (window.taxRates && Object.keys(window.taxRates).length > 0) {
            const years = Object.keys(window.taxRates).sort().reverse();
            years.forEach((fy) => {
               const option = document.createElement('option');
               option.value = fy;
               option.textContent = fy;
               if (fy === '2025-26') {
                  option.selected = true;
               }
               fySelect.appendChild(option);
            });
         } else {
            // Fallback years if tax-rates.js doesn't load
            console.warn('Tax rates not loaded, using fallback years');
            const fallbackYears = ['2025-26', '2024-25', '2023-24'];
            fallbackYears.forEach((fy) => {
               const option = document.createElement('option');
               option.value = fy;
               option.textContent = fy;
               if (fy === '2025-26') {
                  option.selected = true;
               }
               fySelect.appendChild(option);
            });
         }

         // Set default financial year to latest
         if (years.length > 0) {
            fySelect.value = years[0];
         } else {
            console.error('No financial years found in tax rates');
         }
      },

      updateAgeField: function () {
         const assesseeType = document.getElementById('assesseeType').value;
         const ageField = document.getElementById('age');
         const ageGroup = document.getElementById('ageGroup');

         if (assesseeType === 'individual') {
            ageField.style.display = 'block';
            ageGroup.style.display = 'none';
         } else {
            ageField.style.display = 'none';
            ageGroup.style.display = 'block';
         }
      },

      toggleRentalIncomeFields: function () {
         const hasRental = document.getElementById('hasRentalIncome').checked;
         const rentalFields = document.getElementById('rentalIncomeFields');
         rentalFields.style.display = hasRental ? 'block' : 'none';
      },

      toggleDeductionFields: function () {
         const regime = document.getElementById('regime').value;
         const deductionFields = document.getElementById('deductionFields');
         deductionFields.style.display = regime === 'old' ? 'block' : 'none';
      },

      calculateTax: function () {
         // PROFESSIONAL LIABILITY PROTECTION: Validate user agreement
         const userAgreement = document.getElementById('userAgreement');
         if (!userAgreement || !userAgreement.checked) {
            this.displayError('Please accept the professional disclaimer agreement to proceed with calculations.');
            return;
         }

         const formData = this.getFormData();

         // PROFESSIONAL LIABILITY PROTECTION: Input validation and bounds checking
         const validationResult = this.validateInputs(formData);
         if (!validationResult.isValid) {
            this.displayError(validationResult.message);
            return;
         }

         // Calculate for both regimes
         const oldRegimeTax = this.calculateRegimeTax(formData, 'old');
         const newRegimeTax = this.calculateRegimeTax(formData, 'new');

         // Display results
         this.displayResults(oldRegimeTax, newRegimeTax, formData);
      },

      getFormData: function () {
         const form = this.form;
         return {
            fy: form.financialYear.value,
            assesseeType: form.assesseeType.value,
            age: parseInt(form.age.value) || 0,
            regime: form.regime.value,

            // Income
            salary: parseFloat(form.salary.value) || 0,
            rentalIncome: form.hasRentalIncome.checked ? parseFloat(form.rentalIncome.value) || 0 : 0,
            otherIncome: parseFloat(form.otherIncome.value) || 0,

            // Deductions
            section80C: parseFloat(form['80C'].value) || 0,
            section80D: parseFloat(form['80D'].value) || 0,
            standardDeduction: form.standardDeduction.checked,

            // HRA
            hra: parseFloat(form.hra.value) || 0,
            rentPaid: parseFloat(form.rentPaid.value) || 0,
            isMetroCity: form.isMetroCity.checked,
         };
      },

      // PROFESSIONAL LIABILITY PROTECTION: Input validation and bounds checking
      validateInputs: function (data) {
         const totalIncome = data.salary + data.rentalIncome + data.otherIncome;

         // Check for unrealistic income entries (professional liability protection)
         if (totalIncome > 100000000) {
            // ₹10 crores
            return {
               isValid: false,
               message:
                  '⚠️ PROFESSIONAL REVIEW REQUIRED: Income exceeds ₹10 crores. Please consult a Chartered Accountant for accurate high-value tax planning.',
            };
         }

         if (totalIncome > 50000000) {
            // ₹5 crores
            return {
               isValid: true,
               requiresProfessionalReview: true,
               message:
                  '⚠️ HIGH-VALUE CALCULATION: Income exceeds ₹5 crores. Professional CA consultation strongly recommended for accuracy.',
            };
         }

         // Check for negative values
         if (data.salary < 0 || data.rentalIncome < 0 || data.otherIncome < 0) {
            return {
               isValid: false,
               message: 'Income values cannot be negative. Please enter valid positive amounts.',
            };
         }

         // Check for unrealistic deduction claims
         if (data.section80C > 150000 || data.section80D > 100000) {
            return {
               isValid: false,
               message:
                  '⚠️ DEDUCTION LIMIT EXCEEDED: Please verify Section 80C (max ₹1.5L) and 80D limits with current provisions.',
            };
         }

         return { isValid: true };
      },

      calculateRegimeTax: function (data, regime) {
         let totalIncome = data.salary + data.rentalIncome + data.otherIncome;
         let deductions = 0;

         if (regime === 'old') {
            // Calculate HRA exemption
            const hraExemption = TaxCalculator.calculateHRAExemption(
               data.fy,
               data.salary,
               data.hra,
               data.rentPaid,
               data.isMetroCity
            );

            // Calculate deductions
            deductions = TaxCalculator.calculateDeductions(
               data.fy,
               {
                  '80C': data.section80C,
                  '80D': {
                     selfAmount: data.section80D,
                     selfAge: data.age,
                     parentsAmount: 0,
                     parentsAge: 0,
                  },
                  hasStandardDeduction: data.standardDeduction,
               },
               regime
            );

            totalIncome -= deductions + hraExemption;
         }

         // Calculate tax based on regime
         const tax = TaxCalculator.calculateTax(Math.max(0, totalIncome), data.fy, data.assesseeType, regime);

         if (isNaN(tax)) {
            console.error('Tax calculation resulted in NaN');
            return { totalIncome: 0, deductions: 0, tax: 0 };
         }

         return {
            totalIncome,
            deductions,
            tax,
         };
      },

      displayResults: function (oldRegimeTax, newRegimeTax, formData) {
         // Show the results div
         this.resultDiv.style.display = 'block';

         // Create comparison chart if both regimes are calculated
         this.createComparisonChart(oldRegimeTax, newRegimeTax);

         // Show detailed breakdown
         this.displayBreakdown(formData.regime === 'old' ? oldRegimeTax : newRegimeTax, formData);

         // Show recommendation
         this.displayRecommendation(oldRegimeTax, newRegimeTax);

         // Add professional consultation CTA
         this.addProfessionalConsultationCTA(formData);

         // Enable export buttons after successful calculation
         this.enableExportButtons();
      },

      addProfessionalConsultationCTA: function (formData) {
         const totalIncome = formData.salary + formData.rentalIncome + formData.otherIncome;
         const isHighValue = totalIncome >= 500000;
         const isVeryHighValue = totalIncome >= 5000000;

         const ctaDiv = document.createElement('div');
         ctaDiv.className = `alert ${
            isVeryHighValue ? 'alert-danger' : isHighValue ? 'alert-warning' : 'alert-info'
         } mt-4 border-left-4`;
         ctaDiv.innerHTML = `
            <div class="row align-items-center">
               <div class="col-md-8">
                  <h6 class="mb-2">
                     <i class="fas fa-user-tie me-2"></i>
                     ${
                        isVeryHighValue
                           ? 'MANDATORY Professional Review Required'
                           : isHighValue
                           ? 'Professional Consultation Strongly Recommended'
                           : 'Professional Consultation Available'
                     }
                  </h6>
                  <p class="mb-2 small">
                     ${
                        isVeryHighValue
                           ? '<strong class="text-danger">CRITICAL:</strong> Income above ₹50 lakhs requires mandatory CA verification for tax compliance and audit protection.'
                           : isHighValue
                           ? '<strong>RECOMMENDED:</strong> Given your income level (₹5+ lakhs), professional review ensures optimal tax planning and compliance.'
                           : 'Professional consultation ensures accuracy and maximizes your tax benefits.'
                     }
                  </p>
                  <p class="mb-0 small text-muted">
                     <i class="fas fa-shield-alt me-1"></i>CA-verified calculations provide legal protection and peace of mind.
                  </p>
               </div>
               <div class="col-md-4 text-md-end">
                  <a href="#contact" class="btn ${
                     isVeryHighValue ? 'btn-danger' : isHighValue ? 'btn-warning' : 'btn-primary'
                  } btn-sm me-2 mb-2">
                     <i class="fas fa-calendar-alt me-1"></i>${isVeryHighValue ? 'Urgent Booking' : 'Book Consultation'}
                  </a>
                  <a href="tel:+917709099099" class="btn btn-outline-${
                     isVeryHighValue ? 'danger' : isHighValue ? 'warning' : 'primary'
                  } btn-sm mb-2">
                     <i class="fas fa-phone me-1"></i>Call Now
                  </a>
               </div>
            </div>
         `;

         this.resultDiv.appendChild(ctaDiv);
      },

      enableExportButtons: function () {
         const exportExcelBtn = document.getElementById('taxExportBtn');
         const exportPdfBtn = document.getElementById('taxPdfBtn');

         // Enable export buttons and update their tooltips
         if (exportExcelBtn) {
            exportExcelBtn.disabled = false;
            exportExcelBtn.style.opacity = '1';
            exportExcelBtn.style.cursor = 'pointer';

            // Update tooltip to show it's ready for export
            const existingTooltip = bootstrap.Tooltip.getInstance(exportExcelBtn);
            if (existingTooltip) {
               existingTooltip.dispose();
            }
            exportExcelBtn.setAttribute('title', 'Click to export results to Excel');
            new bootstrap.Tooltip(exportExcelBtn);
         }

         if (exportPdfBtn) {
            exportPdfBtn.disabled = false;
            exportPdfBtn.style.opacity = '1';
            exportPdfBtn.style.cursor = 'pointer';

            // Update tooltip to show it's ready for export
            const existingTooltip = bootstrap.Tooltip.getInstance(exportPdfBtn);
            if (existingTooltip) {
               existingTooltip.dispose();
            }
            exportPdfBtn.setAttribute('title', 'Click to export results to PDF');
            new bootstrap.Tooltip(exportPdfBtn);
         }
      },

      createComparisonChart: function (oldRegimeTax, newRegimeTax) {
         const ctx = document.getElementById('regimeComparisonChart').getContext('2d');

         if (this.comparisonChart) {
            this.comparisonChart.destroy();
         }

         this.comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
               labels: ['Old Regime', 'New Regime'],
               datasets: [
                  {
                     label: 'Tax Amount',
                     data: [oldRegimeTax.tax, newRegimeTax.tax],
                     backgroundColor: ['rgba(4, 82, 61, 0.5)', 'rgba(0, 128, 93, 0.5)'],
                     borderColor: ['rgba(4, 82, 61, 1)', 'rgba(0, 128, 93, 1)'],
                     borderWidth: 1,
                  },
               ],
            },
            options: {
               responsive: true,
               scales: {
                  y: {
                     beginAtZero: true,
                     ticks: {
                        callback: function (value) {
                           return '₹' + value.toLocaleString('en-IN');
                        },
                     },
                  },
               },
               plugins: {
                  tooltip: {
                     callbacks: {
                        label: function (context) {
                           return '₹' + context.raw.toLocaleString('en-IN');
                        },
                     },
                  },
               },
            },
         });
      },

      getDetailedTaxBreakdown: function (taxData, formData) {
         const grossIncome = formData.salary + formData.rentalIncome + formData.otherIncome;

         // Calculate deductions properly
         const deductions = [];
         let totalDeductions = 0;

         // Calculate HRA exemption if old regime
         if (formData.regime === 'old') {
            const hraExemption = TaxCalculator.calculateHRAExemption(
               formData.fy,
               formData.salary,
               formData.hra,
               formData.rentPaid,
               formData.isMetroCity
            );
            if (hraExemption > 0) {
               deductions.push({ name: 'HRA Exemption', amount: hraExemption });
               totalDeductions += hraExemption;
            }
         }

         // Standard deduction
         if (formData.standardDeduction) {
            const standardDeductionAmount = standardDeduction[formData.financialYear][formData.regime].salaried;
            deductions.push({ name: 'Standard Deduction', amount: standardDeductionAmount });
            totalDeductions += standardDeductionAmount;
         }

         // Section 80C
         if (formData.section80C > 0) {
            deductions.push({ name: 'Section 80C', amount: formData.section80C });
            totalDeductions += formData.section80C;
         }

         // Section 80D
         if (formData.section80D > 0) {
            deductions.push({ name: 'Section 80D', amount: formData.section80D });
            totalDeductions += formData.section80D;
         }

         const taxableIncome = grossIncome - totalDeductions;

         // Get tax slabs and calculate breakdown
         const slabs = TaxCalculator.getTaxSlabs(formData.fy, formData.assesseeType, formData.regime);
         const slabCalculations = [];
         let remainingIncome = taxableIncome;
         let totalTax = 0;

         for (const slab of slabs) {
            if (remainingIncome <= 0) break;

            const taxableInSlab = Math.min(remainingIncome, slab.max - slab.min);
            const taxInSlab = taxableInSlab * slab.rate;

            if (taxInSlab > 0) {
               slabCalculations.push({
                  slab: `${slab.min.toLocaleString()} - ${slab.max === Infinity ? 'Above' : slab.max.toLocaleString()}`,
                  rate: `${(slab.rate * 100).toFixed(1)}%`,
                  taxableAmount: taxableInSlab,
                  taxAmount: taxInSlab,
               });
               totalTax += taxInSlab;
            }

            remainingIncome -= taxableInSlab;
         }

         // Calculate surcharge, cess, and rebate
         const surcharge = TaxCalculator.calculateSurcharge(totalTax, taxableIncome);
         const cess = (totalTax + surcharge) * 0.04;
         const rebate = TaxCalculator.calculateRebate(taxableIncome, formData.regime);

         const finalTax = Math.max(0, totalTax + surcharge + cess - rebate);

         return {
            grossIncome,
            deductions,
            totalDeductions,
            taxableIncome,
            slabCalculations,
            totalTax,
            surcharge,
            cess,
            rebate,
            finalTax,
         };
      },

      calculateSlabBreakdown: function (taxableIncome, regime) {
         const slabs = TaxCalculator.getSlabs(regime);
         const breakdown = [];
         let remainingIncome = taxableIncome;

         for (let i = 0; i < slabs.length; i++) {
            const slab = slabs[i];
            if (remainingIncome <= 0) break;

            const slabIncome = Math.min(remainingIncome, slab.max - slab.min);
            const tax = slabIncome * (slab.rate / 100);

            if (tax > 0) {
               const range =
                  slab.max === Infinity
                     ? `Above ₹${slab.min.toLocaleString('en-IN')}`
                     : `₹${slab.min.toLocaleString('en-IN')} - ₹${slab.max.toLocaleString('en-IN')}`;

               breakdown.push({
                  range: range,
                  rate: slab.rate,
                  tax: Math.round(tax),
               });
            }

            remainingIncome -= slabIncome;
         }

         return breakdown;
      },

      displayBreakdown: function (taxData, formData) {
         const breakdown = document.getElementById('taxBreakdown');

         // Get detailed tax calculation breakdown
         const detailedBreakdown = this.getDetailedTaxBreakdown(taxData, formData);

         breakdown.innerHTML = `
                <h4>Detailed Tax Computation</h4>
                <div class="row">
                    <div class="col-md-6">
                        <h5>Income Details</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <tbody>
                                    <tr>
                                        <td>Salary Income</td>
                                        <td class="text-end">₹${formData.salary.toLocaleString('en-IN')}</td>
                                    </tr>
                                    ${
                                       formData.rentalIncome > 0
                                          ? `
                                    <tr>
                                        <td>Rental Income</td>
                                        <td class="text-end">₹${formData.rentalIncome.toLocaleString('en-IN')}</td>
                                    </tr>
                                    `
                                          : ''
                                    }
                                    <tr>
                                        <td>Other Income</td>
                                        <td class="text-end">₹${formData.otherIncome.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr class="table-primary">
                                        <td><strong>Gross Total Income</strong></td>
                                        <td class="text-end"><strong>₹${(
                                           formData.salary +
                                           formData.rentalIncome +
                                           formData.otherIncome
                                        ).toLocaleString('en-IN')}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5>Deductions & Exemptions</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <tbody>
                                    ${detailedBreakdown.deductions
                                       .map(
                                          (deduction) => `
                                    <tr>
                                        <td>${deduction.name}</td>
                                        <td class="text-end">₹${deduction.amount.toLocaleString('en-IN')}</td>
                                    </tr>
                                    `
                                       )
                                       .join('')}
                                    <tr class="table-primary">
                                        <td><strong>Total Deductions</strong></td>
                                        <td class="text-end"><strong>₹${detailedBreakdown.totalDeductions.toLocaleString(
                                           'en-IN'
                                        )}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-6">
                        <h5>Taxable Income</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <tbody>
                                    <tr>
                                        <td>Gross Total Income</td>
                                        <td class="text-end">₹${detailedBreakdown.grossIncome.toLocaleString(
                                           'en-IN'
                                        )}</td>
                                    </tr>
                                    <tr>
                                        <td>Less: Deductions</td>
                                        <td class="text-end">₹${detailedBreakdown.totalDeductions.toLocaleString(
                                           'en-IN'
                                        )}</td>
                                    </tr>
                                    <tr class="table-success">
                                        <td><strong>Taxable Income</strong></td>
                                        <td class="text-end"><strong>₹${detailedBreakdown.taxableIncome.toLocaleString(
                                           'en-IN'
                                        )}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5>Tax Slab-wise Calculation</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <thead class="table-light">
                                    <tr>
                                        <th>Income Slab</th>
                                        <th>Tax Rate</th>
                                        <th>Tax Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${detailedBreakdown.slabCalculations
                                       .map(
                                          (slab) => `
                                    <tr>
                                        <td>${slab.slab}</td>
                                        <td>${slab.rate}</td>
                                        <td class="text-end">₹${slab.taxAmount.toLocaleString('en-IN')}</td>
                                    </tr>
                                    `
                                       )
                                       .join('')}
                                    <tr class="table-info">
                                        <td colspan="2"><strong>Base Tax</strong></td>
                                        <td class="text-end"><strong>₹${detailedBreakdown.totalTax.toLocaleString(
                                           'en-IN'
                                        )}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-6">
                        <h5>Tax Components</h5>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <tbody>
                                    <tr>
                                        <td>Base Tax</td>
                                        <td class="text-end">₹${detailedBreakdown.totalTax.toLocaleString('en-IN')}</td>
                                    </tr>
                                    ${
                                       detailedBreakdown.rebate > 0
                                          ? `
                                    <tr>
                                        <td>Less: Section 87A Rebate</td>
                                        <td class="text-end">₹${detailedBreakdown.rebate.toLocaleString('en-IN')}</td>
                                    </tr>
                                    `
                                          : ''
                                    }
                                    <tr>
                                        <td>Tax after Rebate</td>
                                        <td class="text-end">₹${(
                                           detailedBreakdown.totalTax - detailedBreakdown.rebate
                                        ).toLocaleString('en-IN')}</td>
                                    </tr>
                                    ${
                                       detailedBreakdown.surcharge > 0
                                          ? `
                                    <tr>
                                        <td>Add: Surcharge</td>
                                        <td class="text-end">₹${detailedBreakdown.surcharge.toLocaleString(
                                           'en-IN'
                                        )}</td>
                                    </tr>
                                    `
                                          : ''
                                    }
                                    <tr>
                                        <td>Tax + Surcharge</td>
                                        <td class="text-end">₹${(
                                           detailedBreakdown.totalTax -
                                           detailedBreakdown.rebate +
                                           detailedBreakdown.surcharge
                                        ).toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr>
                                        <td>Add: Cess (4%)</td>
                                        <td class="text-end">₹${detailedBreakdown.cess.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr class="table-danger">
                                        <td><strong>Total Tax Liability</strong></td>
                                        <td class="text-end"><strong>₹${detailedBreakdown.finalTax.toLocaleString(
                                           'en-IN'
                                        )}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5>Summary</h5>
                        <div class="card">
                            <div class="card-body">
                                <div class="row text-center">
                                    <div class="col-6">
                                        <h6 class="text-muted">Taxable Income</h6>
                                        <h4 class="text-primary">₹${detailedBreakdown.taxableIncome.toLocaleString(
                                           'en-IN'
                                        )}</h4>
                                    </div>
                                    <div class="col-6">
                                        <h6 class="text-muted">Total Tax</h6>
                                        <h4 class="text-danger">₹${detailedBreakdown.finalTax.toLocaleString(
                                           'en-IN'
                                        )}</h4>
                                    </div>
                                </div>
                                <hr>
                                <div class="row text-center">
                                    <div class="col-6">
                                        <h6 class="text-muted">Effective Tax Rate</h6>
                                        <h5 class="text-info">${(
                                           (detailedBreakdown.finalTax / detailedBreakdown.taxableIncome) *
                                           100
                                        ).toFixed(2)}%</h5>
                                    </div>
                                    <div class="col-6">
                                        <h6 class="text-muted">Tax Regime</h6>
                                        <h5 class="text-success">${
                                           formData.regime === 'old' ? 'Old Regime' : 'New Regime'
                                        }</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Professional Review Disclaimer -->
                <div class="alert alert-light border mt-4">
                    <div class="row align-items-center">
                        <div class="col-md-9">
                            <h6 class="mb-1"><i class="fas fa-info-circle text-info me-2"></i>Important Disclaimer</h6>
                            <p class="mb-0 small">
                                This calculation is for illustrative purposes only and based on current tax provisions. 
                                Individual circumstances may vary. For accurate tax planning and compliance, 
                                <strong>professional consultation is recommended</strong>.
                            </p>
                        </div>
                        <div class="col-md-3 text-md-end">
                            <a href="#contact" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-user-tie me-1"></i>Consult Expert
                            </a>
                        </div>
                    </div>
                </div>
            `;
      },

      displayRecommendation: function (oldRegimeTax, newRegimeTax) {
         const recommendationDiv = document.getElementById('recommendation');
         const difference = Math.abs(oldRegimeTax.tax - newRegimeTax.tax);
         const betterRegime = oldRegimeTax.tax < newRegimeTax.tax ? 'Old' : 'New';

         recommendationDiv.innerHTML = `
                <div class="alert alert-info">
                    <h5 class="alert-heading">Tax Saving Recommendation</h5>
                    <p>The ${betterRegime} Tax Regime is more beneficial for you.</p>
                    <p>You can save ₹${difference.toLocaleString('en-IN')} by opting for the ${betterRegime} regime.</p>
                </div>
            `;
      },

      setupTooltips: function () {
         const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
         tooltipTriggers.forEach((trigger) => {
            new bootstrap.Tooltip(trigger, {
               title: trigger.dataset.tooltip,
               placement: 'top',
               html: true,
            });
         });
      },

      exportToExcel: function () {
         try {
            if (typeof XLSX === 'undefined') {
               alert('Excel export library not loaded. Please refresh the page and try again.');
               return;
            }

            const formData = this.getFormData();

            // Calculate for both regimes
            const oldRegimeTax = this.calculateRegimeTax(formData, 'old');
            const newRegimeTax = this.calculateRegimeTax(formData, 'new');

            // Get detailed breakdown for current regime
            const currentRegimeTax = formData.regime === 'old' ? oldRegimeTax : newRegimeTax;
            const detailedBreakdown = this.getDetailedTaxBreakdown(currentRegimeTax, formData);

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws_data = [];

            // Add title
            ws_data.push(['Income Tax Calculation Details']);
            ws_data.push([]); // Empty row for spacing

            // Add input parameters
            ws_data.push(['Tax Calculation Details']);
            ws_data.push(['Financial Year', formData.fy]);
            ws_data.push([
               'Assessee Type',
               formData.assesseeType.charAt(0).toUpperCase() + formData.assesseeType.slice(1),
            ]);
            ws_data.push(['Age', formData.age + ' years']);
            ws_data.push(['Tax Regime', formData.regime === 'old' ? 'Old Regime' : 'New Regime']);
            ws_data.push([]); // Empty row for spacing

            // Add income details
            ws_data.push(['Income Details']);
            ws_data.push(['Salary Income', formData.salary]);
            if (formData.rentalIncome > 0) {
               ws_data.push(['Rental Income', formData.rentalIncome]);
            }
            ws_data.push(['Other Income', formData.otherIncome]);
            ws_data.push(['Gross Total Income', formData.salary + formData.rentalIncome + formData.otherIncome]);
            ws_data.push([]); // Empty row for spacing

            // Add deductions if old regime
            if (formData.regime === 'old') {
               ws_data.push(['Deductions & Exemptions']);
               if (formData.hra > 0) {
                  ws_data.push(['HRA Exemption', formData.hra]);
               }
               if (formData.standardDeduction) {
                  const stdDeduction = standardDeduction[formData.financialYear][formData.regime].salaried;
                  ws_data.push(['Standard Deduction', stdDeduction]);
               }
               if (formData.section80C > 0) {
                  ws_data.push(['Section 80C', formData.section80C]);
               }
               if (formData.section80D > 0) {
                  ws_data.push(['Section 80D', formData.section80D]);
               }
               ws_data.push(['Total Deductions', detailedBreakdown.totalDeductions]);
               ws_data.push([]); // Empty row for spacing
            }

            // Add taxable income
            ws_data.push(['Taxable Income', detailedBreakdown.taxableIncome]);
            ws_data.push([]); // Empty row for spacing

            // Add tax slab breakdown
            ws_data.push(['Tax Slab-wise Calculation']);
            ws_data.push(['Income Slab', 'Tax Rate', 'Tax Amount']);
            detailedBreakdown.slabCalculations.forEach((slab) => {
               ws_data.push([slab.slab, slab.rate, slab.taxAmount]);
            });
            ws_data.push(['Base Tax', '', detailedBreakdown.baseTax]);
            ws_data.push([]); // Empty row for spacing

            // Add tax components
            ws_data.push(['Tax Components']);
            ws_data.push(['Base Tax', detailedBreakdown.baseTax]);
            if (detailedBreakdown.rebate > 0) {
               ws_data.push(['Less: Section 87A Rebate', detailedBreakdown.rebate]);
            }
            ws_data.push(['Tax after Rebate', detailedBreakdown.baseTax - detailedBreakdown.rebate]);
            if (detailedBreakdown.surcharge > 0) {
               ws_data.push(['Add: Surcharge (' + detailedBreakdown.surchargeRate + '%)', detailedBreakdown.surcharge]);
            }
            ws_data.push([
               'Tax + Surcharge',
               detailedBreakdown.baseTax - detailedBreakdown.rebate + detailedBreakdown.surcharge,
            ]);
            ws_data.push(['Add: Cess (' + detailedBreakdown.cessRate + '%)', detailedBreakdown.cess]);
            ws_data.push(['Total Tax Liability', detailedBreakdown.totalTax]);
            ws_data.push([]); // Empty row for spacing

            // Add regime comparison
            ws_data.push(['Regime Comparison']);
            ws_data.push(['Regime', 'Tax Amount']);
            ws_data.push(['Old Regime', oldRegimeTax.tax]);
            ws_data.push(['New Regime', newRegimeTax.tax]);
            ws_data.push(['Difference', Math.abs(oldRegimeTax.tax - newRegimeTax.tax)]);
            ws_data.push(['Recommended Regime', oldRegimeTax.tax < newRegimeTax.tax ? 'Old Regime' : 'New Regime']);

            // Create worksheet and add to workbook
            const ws = XLSX.utils.aoa_to_sheet(ws_data);

            // Set column widths
            const wscols = [
               { wch: 25 }, // Column 1
               { wch: 15 }, // Column 2
               { wch: 15 }, // Column 3
            ];
            ws['!cols'] = wscols;

            // Add the worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Tax Calculation');

            // Generate and download Excel file
            const fileName = `Income_Tax_Calculation_${formData.fy}_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);
         } catch (error) {
            alert('Failed to export to Excel. Error: ' + error.message);
         }
      },

      exportToPDF: function () {
         try {
            if (typeof jspdf === 'undefined') {
               alert('PDF export library not loaded. Please refresh the page and try again.');
               return;
            }

            const { jsPDF } = jspdf;
            const doc = new jsPDF();

            const formData = this.getFormData();

            // Calculate for both regimes
            const oldRegimeTax = this.calculateRegimeTax(formData, 'old');
            const newRegimeTax = this.calculateRegimeTax(formData, 'new');

            // Get detailed breakdown for current regime
            const currentRegimeTax = formData.regime === 'old' ? oldRegimeTax : newRegimeTax;
            const detailedBreakdown = this.getDetailedTaxBreakdown(currentRegimeTax, formData);

            // Add title
            doc.setFontSize(16);
            doc.text('Income Tax Calculation Report', 20, 20);
            doc.setFontSize(12);

            let yPos = 40;

            // Basic details
            doc.text(`Financial Year: ${formData.fy}`, 20, yPos);
            yPos += 10;
            doc.text(
               `Assessee Type: ${formData.assesseeType.charAt(0).toUpperCase() + formData.assesseeType.slice(1)}`,
               20,
               yPos
            );
            yPos += 10;
            doc.text(`Age: ${formData.age} years`, 20, yPos);
            yPos += 10;
            doc.text(`Tax Regime: ${formData.regime === 'old' ? 'Old Regime' : 'New Regime'}`, 20, yPos);
            yPos += 20;

            // Income details
            doc.text(`Gross Total Income: ₹${detailedBreakdown.grossIncome.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Total Deductions: ₹${detailedBreakdown.totalDeductions.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Taxable Income: ₹${detailedBreakdown.taxableIncome.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 20;

            // Tax details
            doc.text(`Base Tax: ₹${detailedBreakdown.totalTax.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            if (detailedBreakdown.rebate > 0) {
               doc.text(`Less: Section 87A Rebate: ₹${detailedBreakdown.rebate.toLocaleString('en-IN')}`, 20, yPos);
               yPos += 10;
            }
            if (detailedBreakdown.surcharge > 0) {
               doc.text(`Add: Surcharge: ₹${detailedBreakdown.surcharge.toLocaleString('en-IN')}`, 20, yPos);
               yPos += 10;
            }
            doc.text(`Add: Cess (4%): ₹${detailedBreakdown.cess.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`Total Tax Liability: ₹${detailedBreakdown.finalTax.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 20;

            // Regime comparison
            doc.text(`Old Regime Tax: ₹${oldRegimeTax.tax.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            doc.text(`New Regime Tax: ₹${newRegimeTax.tax.toLocaleString('en-IN')}`, 20, yPos);
            yPos += 10;
            const betterRegime = oldRegimeTax.tax < newRegimeTax.tax ? 'Old Regime' : 'New Regime';
            doc.text(`Recommended Regime: ${betterRegime}`, 20, yPos);

            // Add footer
            doc.setFontSize(10);
            doc.text('Generated by N. Betharia & Associates', 20, 280);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

            // Save PDF
            const fileName = `Income_Tax_Calculation_${formData.fy}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
         } catch (error) {
            alert('Failed to export to PDF. Error: ' + error.message);
         }
      },
   };

   // Make calculator globally accessible
   window.calculator = calculator;

   // Initialize the calculator
   calculator.init();
});
// Updated tax calculator script loading
