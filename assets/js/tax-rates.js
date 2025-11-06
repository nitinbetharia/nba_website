// Tax rates for different financial years and assessee types
// Professional Version Control - Critical for CA Firm Liability Protection
const taxRatesMetadata = {
   version: '2.1',
   lastUpdated: '2025-11-05',
   updatedBy: 'N. Betharia & Associates (FRN: 117991W)',
   sourceAuthority: 'Income Tax Act 1961 & Finance Act 2025',
   complianceStatus: 'Current',
   nextReviewDate: '2026-02-01',
   disclaimer: 'For professional use only. Verify with latest tax provisions before client advice.',
};

const taxRates = {
   '2025-26': {
      individual: {
         old: {
            slabs: [
               { limit: 250000, rate: 0 },
               { limit: 500000, rate: 5 },
               { limit: 1000000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 500000,
                  maxRebate: 12500,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
         new: {
            slabs: [
               { limit: 400000, rate: 0 }, // ₹0 - ₹4 lakh: 0%
               { limit: 800000, rate: 5 }, // ₹4 - ₹8 lakh: 5%
               { limit: 1200000, rate: 10 }, // ₹8 - ₹12 lakh: 10%
               { limit: 1600000, rate: 15 }, // ₹12 - ₹16 lakh: 15%
               { limit: 2000000, rate: 20 }, // ₹16 - ₹20 lakh: 20%
               { limit: 2400000, rate: 25 }, // ₹20 - ₹24 lakh: 25%
               { limit: Infinity, rate: 30 }, // Above ₹24 lakh: 30%
            ],
            rebate: {
               section87A: {
                  maxIncome: 1200000, // Income up to ₹12 lakh eligible
                  maxRebate: 60000, // Maximum rebate ₹60,000
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
      },
      senior: {
         old: {
            slabs: [
               { limit: 300000, rate: 0 },
               { limit: 500000, rate: 5 },
               { limit: 1000000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 500000,
                  maxRebate: 12500,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
         new: {
            slabs: [
               { limit: 400000, rate: 0 }, // Same as individual under new regime
               { limit: 800000, rate: 5 },
               { limit: 1200000, rate: 10 },
               { limit: 1600000, rate: 15 },
               { limit: 2000000, rate: 20 },
               { limit: 2400000, rate: 25 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 1200000, // Same rebate as individual
                  maxRebate: 60000,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
      },
      super_senior: {
         old: {
            slabs: [
               { limit: 500000, rate: 0 },
               { limit: 1000000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 500000,
                  maxRebate: 12500,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
         new: {
            slabs: [
               { limit: 400000, rate: 0 }, // Same as individual under new regime
               { limit: 800000, rate: 5 },
               { limit: 1200000, rate: 10 },
               { limit: 1600000, rate: 15 },
               { limit: 2000000, rate: 20 },
               { limit: 2400000, rate: 25 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 1200000, // Same rebate as individual
                  maxRebate: 60000,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
      },
   },
   '2024-25': {
      individual: {
         old: {
            slabs: [
               { limit: 250000, rate: 0 },
               { limit: 500000, rate: 5 },
               { limit: 1000000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 500000,
                  maxRebate: 12500,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
         new: {
            slabs: [
               { limit: 300000, rate: 0 },
               { limit: 600000, rate: 5 },
               { limit: 900000, rate: 10 },
               { limit: 1200000, rate: 15 },
               { limit: 1500000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 700000,
                  maxRebate: 25000,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
      },
      senior: {
         old: {
            slabs: [
               { limit: 300000, rate: 0 },
               { limit: 500000, rate: 5 },
               { limit: 1000000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 500000,
                  maxRebate: 12500,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
         new: {
            slabs: [
               { limit: 300000, rate: 0 },
               { limit: 600000, rate: 5 },
               { limit: 900000, rate: 10 },
               { limit: 1200000, rate: 15 },
               { limit: 1500000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 700000,
                  maxRebate: 25000,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
      },
      super_senior: {
         old: {
            slabs: [
               { limit: 500000, rate: 0 },
               { limit: 1000000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 500000,
                  maxRebate: 12500,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
         new: {
            slabs: [
               { limit: 300000, rate: 0 },
               { limit: 600000, rate: 5 },
               { limit: 900000, rate: 10 },
               { limit: 1200000, rate: 15 },
               { limit: 1500000, rate: 20 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 700000,
                  maxRebate: 25000,
               },
            },
            cess: {
               rate: 4,
               name: 'Health and Education Cess',
            },
            surcharge: [
               { limit: 5000000, rate: 10 },
               { limit: 10000000, rate: 15 },
               { limit: 20000000, rate: 25 },
               { limit: 50000000, rate: 37 },
            ],
         },
      },
   },
};

// Standard deduction amounts by financial year and regime
const standardDeduction = {
   '2025-26': {
      old: {
         salaried: 50000, // Old regime: ₹50,000
         business: 0, // Not applicable for business income
         pension: 15000, // For pensioners under old regime
      },
      new: {
         salaried: 75000, // New regime: ₹75,000 (increased from ₹50,000)
         business: 0, // Not applicable for business income
         pension: 15000, // For pensioners under new regime
      },
   },
   '2024-25': {
      old: {
         salaried: 50000, // FY 2024-25: ₹50,000
         business: 0,
         pension: 15000,
      },
      new: {
         salaried: 50000, // FY 2024-25: ₹50,000 (same for both regimes)
         business: 0,
         pension: 15000,
      },
   },
};

// Export the tax rates object with metadata for professional accountability
if (typeof module !== 'undefined' && module.exports) {
   module.exports = { taxRates, standardDeduction, taxRatesMetadata };
}

// Make sure variables are available globally in browser
window.taxRates = taxRates;
window.deductionLimits = standardDeduction;
window.taxRatesMetadata = taxRatesMetadata;

// Helper functions for tax calculation
const TaxCalculator = {
   // Get tax slabs for a specific financial year, assessee type, and regime
   getTaxSlabs: function (fy, assesseeType, regime) {
      const rates = taxRates[fy][assesseeType][regime];
      const slabs = [];
      let min = 0;

      for (const slab of rates.slabs) {
         slabs.push({
            min: min,
            max: slab.limit,
            rate: slab.rate / 100, // Convert percentage to decimal
         });
         min = slab.limit;
      }

      return slabs;
   },

   // Calculate surcharge
   calculateSurcharge: function (tax, income) {
      // Surcharge rates based on income
      if (income > 50000000) return tax * 0.37;
      if (income > 20000000) return tax * 0.25;
      if (income > 10000000) return tax * 0.15;
      if (income > 5000000) return tax * 0.1;
      return 0;
   },

   // Calculate rebate under Section 87A
   calculateRebate: function (income, regime) {
      if (regime === 'new' && income <= 700000) {
         return Math.min(25000, income * 0.05); // 5% of income or 25,000, whichever is less
      } else if (regime === 'old' && income <= 500000) {
         return Math.min(12500, income * 0.05); // 5% of income or 12,500, whichever is less
      }
      return 0;
   },

   // Calculate tax based on regime and income
   calculateTax: function (income, fy, assesseeType, regime) {
      const rates = taxRates[fy][assesseeType][regime];
      let tax = 0;
      let previousLimit = 0;

      // Calculate base tax
      for (const slab of rates.slabs) {
         if (income > previousLimit) {
            const slabIncome = Math.min(income - previousLimit, slab.limit - previousLimit);
            tax += (slabIncome * slab.rate) / 100;
         }
         if (income <= slab.limit) break;
         previousLimit = slab.limit;
      }

      // Apply rebate under section 87A
      if (income <= rates.rebate.section87A.maxIncome) {
         tax = Math.max(0, tax - rates.rebate.section87A.maxRebate);
      }

      // Calculate surcharge if applicable
      let surcharge = 0;
      for (const level of rates.surcharge.slice().reverse()) {
         if (income > level.limit) {
            surcharge = (tax * level.rate) / 100;
            break;
         }
      }

      // Add surcharge
      tax += surcharge;

      // Add cess
      tax += (tax * rates.cess.rate) / 100;

      return Math.round(tax);
   },

   // Calculate HRA exemption
   calculateHRAExemption: function (fy, basic, hra, rent, isMetro) {
      const limits = standardDeduction[fy];
      const maxPercent = isMetro ? 0.5 : 0.4; // 50% for metro, 40% for non-metro

      // HRA exemption is minimum of:
      // 1. Actual HRA received
      // 2. 50% (metro) or 40% (non-metro) of basic salary
      // 3. Rent paid - 10% of basic salary
      const exemption = Math.min(hra, basic * maxPercent, Math.max(0, rent - basic * 0.1));

      return Math.round(exemption);
   },

   // Calculate eligible deductions
   calculateDeductions: function (fy, deductions, regime) {
      if (regime === 'new') return 0; // No deductions in new regime

      let totalDeduction = 0;

      // Section 80C - maximum 150,000
      totalDeduction += Math.min(deductions['80C'] || 0, 150000);

      // Section 80D
      if (deductions['80D']) {
         const d80d = deductions['80D'];
         const selfLimit = d80d.selfAge >= 60 ? 50000 : 25000;
         const parentsLimit = d80d.parentsAge >= 60 ? 50000 : 25000;

         totalDeduction += Math.min(d80d.selfAmount || 0, selfLimit);
         totalDeduction += Math.min(d80d.parentsAmount || 0, parentsLimit);
      }

      // Standard Deduction
      if (deductions.hasStandardDeduction) {
         totalDeduction += standardDeduction[fy]['old'].salaried;
      }

      return Math.round(totalDeduction);
   },
};

// Export the tax calculation utilities
window.TaxCalculator = TaxCalculator;

// Debug log to confirm loading
console.log('Tax rates loaded successfully for years:', Object.keys(taxRates));
console.log('TaxCalculator utility loaded successfully');
