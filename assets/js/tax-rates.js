// Tax rates for different financial years and assessee types
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
               { limit: 400000, rate: 0 },    // ₹0 - ₹4 lakh: 0%
               { limit: 800000, rate: 5 },    // ₹4 - ₹8 lakh: 5%
               { limit: 1200000, rate: 10 },  // ₹8 - ₹12 lakh: 10%
               { limit: 1600000, rate: 15 },  // ₹12 - ₹16 lakh: 15%
               { limit: 2000000, rate: 20 },  // ₹16 - ₹20 lakh: 20%
               { limit: 2400000, rate: 25 },  // ₹20 - ₹24 lakh: 25%
               { limit: Infinity, rate: 30 }, // Above ₹24 lakh: 30%
            ],
            rebate: {
               section87A: {
                  maxIncome: 1200000,  // Income up to ₹12 lakh eligible
                  maxRebate: 60000,    // Maximum rebate ₹60,000
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
               { limit: 400000, rate: 0 },    // Same as individual under new regime
               { limit: 800000, rate: 5 },
               { limit: 1200000, rate: 10 },
               { limit: 1600000, rate: 15 },
               { limit: 2000000, rate: 20 },
               { limit: 2400000, rate: 25 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 1200000,  // Same rebate as individual
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
               { limit: 400000, rate: 0 },    // Same as individual under new regime
               { limit: 800000, rate: 5 },
               { limit: 1200000, rate: 10 },
               { limit: 1600000, rate: 15 },
               { limit: 2000000, rate: 20 },
               { limit: 2400000, rate: 25 },
               { limit: Infinity, rate: 30 },
            ],
            rebate: {
               section87A: {
                  maxIncome: 1200000,  // Same rebate as individual
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
         salaried: 50000,    // Old regime: ₹50,000
         business: 0,        // Not applicable for business income
         pension: 15000,     // For pensioners under old regime
      },
      new: {
         salaried: 75000,    // New regime: ₹75,000 (increased from ₹50,000)
         business: 0,        // Not applicable for business income
         pension: 15000,     // For pensioners under new regime
      },
   },
   '2024-25': {
      old: {
         salaried: 50000,    // FY 2024-25: ₹50,000
         business: 0,
         pension: 15000,
      },
      new: {
         salaried: 50000,    // FY 2024-25: ₹50,000 (same for both regimes)
         business: 0,
         pension: 15000,
      },
   },
};

// Export the tax rates object
if (typeof module !== 'undefined' && module.exports) {
   module.exports = { taxRates, standardDeduction };
}