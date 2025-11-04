/**
 * Calculator Page JavaScript
 * Handles initialization, modal functionality, and calculator interactions
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
   initializeCalculators();
   initializeModals();
   initializeExportButtons();
});

/**
 * Initialize calculator tabs and functionality
 */
function initializeCalculators() {
   // Let Bootstrap handle tab functionality, just add our custom enhancements
   const calculatorTabs = document.querySelectorAll('.calculator-tabs .nav-link');

   calculatorTabs.forEach((tab) => {
      // Add custom event listener for tab shown event
      tab.addEventListener('shown.bs.tab', function (e) {
         const targetId = this.getAttribute('data-bs-target');
         // Calculator tab switched

         // Initialize any calculator-specific functionality here
         initializeCalculatorButtons(targetId);
      });
   });

   // Initialize buttons for the active tab
   initializeCalculatorButtons('#tax');
}

/**
 * Initialize calculator buttons for the active tab
 */
function initializeCalculatorButtons(targetId) {
   const activeCalculator = document.querySelector(targetId);
   if (!activeCalculator) return;

   // Remove existing event listeners to prevent duplicates
   const buttons = activeCalculator.querySelectorAll('button');
   buttons.forEach((button) => {
      // Clone and replace to remove all event listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
   });

   // Re-add event listeners
   const calcButtons = activeCalculator.querySelectorAll('.btn-primary, .btn-calculate');
   const resetButtons = activeCalculator.querySelectorAll('.btn-danger, .btn-reset');
   const exportButtons = activeCalculator.querySelectorAll('.btn-export, .btn-success');

   calcButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
         e.preventDefault();
         // Calculate button clicked
         // The specific calculator logic will handle the calculation
      });
   });

   resetButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
         e.preventDefault();
         console.log('Reset button clicked');
         // Reset the form
         const form = this.closest('form') || this.closest('.calculator');
         if (form) {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach((input) => {
               if (input.type === 'checkbox' || input.type === 'radio') {
                  input.checked = false;
               } else {
                  input.value = '';
               }
            });
         }
      });
   });

   exportButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
         e.preventDefault();
         console.log('Export button clicked');
         const calculatorType = targetId.replace('#', '');
         if (this.classList.contains('btn-success') || this.textContent.includes('Excel')) {
            exportToExcel(calculatorType);
         } else if (this.textContent.includes('PDF')) {
            exportToPDF(calculatorType);
         }
      });
   });
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
   // Get modal elements
   const disclaimerModal = new bootstrap.Modal(document.getElementById('disclaimerModal'));
   const termsModal = new bootstrap.Modal(document.getElementById('termsModal'));
   const privacyModal = new bootstrap.Modal(document.getElementById('privacyModal'));

   // Disclaimer modal trigger
   const disclaimerBtn = document.querySelector('[data-bs-target="#disclaimerModal"]');
   if (disclaimerBtn) {
      disclaimerBtn.addEventListener('click', function (e) {
         e.preventDefault();
         disclaimerModal.show();
      });
   }

   // Terms modal trigger
   const termsBtn = document.querySelector('[data-bs-target="#termsModal"]');
   if (termsBtn) {
      termsBtn.addEventListener('click', function (e) {
         e.preventDefault();
         termsModal.show();
      });
   }

   // Privacy modal trigger
   const privacyBtn = document.querySelector('[data-bs-target="#privacyModal"]');
   if (privacyBtn) {
      privacyBtn.addEventListener('click', function (e) {
         e.preventDefault();
         privacyModal.show();
      });
   }
}

/**
 * Initialize export button functionality
 */
function initializeExportButtons() {
   // Excel export buttons
   const excelButtons = document.querySelectorAll('.btn-export-excel');
   excelButtons.forEach((button) => {
      button.addEventListener('click', function () {
         const calculatorType = this.getAttribute('data-calculator');
         exportToExcel(calculatorType);
      });
   });

   // PDF export buttons
   const pdfButtons = document.querySelectorAll('.btn-export-pdf');
   pdfButtons.forEach((button) => {
      button.addEventListener('click', function () {
         const calculatorType = this.getAttribute('data-calculator');
         exportToPDF(calculatorType);
      });
   });
}

/**
 * Export calculator results to Excel
 * @param {string} calculatorType - Type of calculator (tax, emi, sip, etc.)
 */
function exportToExcel(calculatorType) {
   try {
      // Get calculator results
      const results = getCalculatorResults(calculatorType);
      if (!results) {
         showNotification('No results to export', 'warning');
         return;
      }

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([results]);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, calculatorType.toUpperCase() + ' Calculator');

      // Generate filename with timestamp
      const filename = calculatorType + '_calculator_results_' + new Date().toISOString().split('T')[0] + '.xlsx';

      // Save file
      XLSX.writeFile(wb, filename);
      showNotification('Excel file exported successfully!', 'success');
   } catch (error) {
      console.error('Excel export error:', error);
      showNotification('Failed to export Excel file', 'error');
   }
}

/**
 * Export calculator results to PDF
 * @param {string} calculatorType - Type of calculator (tax, emi, sip, etc.)
 */
function exportToPDF(calculatorType) {
   try {
      // Get calculator results
      const results = getCalculatorResults(calculatorType);
      if (!results) {
         showNotification('No results to export', 'warning');
         return;
      }

      // Create PDF document
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text(calculatorType.toUpperCase() + ' Calculator Results', 20, 30);

      // Add results
      doc.setFontSize(12);
      let yPosition = 50;
      Object.entries(results).forEach(([key, value]) => {
         doc.text(`${key}: ${value}`, 20, yPosition);
         yPosition += 10;
      });

      // Add timestamp
      doc.setFontSize(10);
      doc.text('Generated on: ' + new Date().toLocaleString(), 20, yPosition + 10);

      // Generate filename
      const filename = calculatorType + '_calculator_results_' + new Date().toISOString().split('T')[0] + '.pdf';

      // Save PDF
      doc.save(filename);
      showNotification('PDF file exported successfully!', 'success');
   } catch (error) {
      console.error('PDF export error:', error);
      showNotification('Failed to export PDF file', 'error');
   }
}

/**
 * Get calculator results for export
 * @param {string} calculatorType - Type of calculator
 * @returns {Object|null} Results object or null if no results
 */
function getCalculatorResults(calculatorType) {
   // This function will be implemented based on individual calculator logic
   // For now, return a sample structure
   const resultsContainer = document.querySelector(`#${calculatorType}-results`);
   if (!resultsContainer) return null;

   const resultItems = resultsContainer.querySelectorAll('.result-item');
   const results = {};

   resultItems.forEach((item) => {
      const label = item.querySelector('.result-label');
      const value = item.querySelector('.result-value');
      if (label && value) {
         results[label.textContent.trim()] = value.textContent.trim();
      }
   });

   return Object.keys(results).length > 0 ? results : null;
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
   // Create notification element
   const notification = document.createElement('div');
   notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
   notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
   notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

   // Add to page
   document.body.appendChild(notification);

   // Auto remove after 5 seconds
   setTimeout(() => {
      if (notification.parentNode) {
         notification.remove();
      }
   }, 5000);
}

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = '₹') {
   return (
      currency +
      amount.toLocaleString('en-IN', {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      })
   );
}

/**
 * Format percentage values
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value) {
   return value.toFixed(2) + '%';
}

/**
 * Validate number input
 * @param {HTMLInputElement} input - Input element to validate
 * @returns {boolean} True if valid number
 */
function validateNumberInput(input) {
   const value = parseFloat(input.value);
   if (isNaN(value) || value < 0) {
      input.classList.add('input-error');
      showFieldError(input, 'Please enter a valid positive number');
      return false;
   }
   input.classList.remove('input-error');
   hideFieldError(input);
   return true;
}

/**
 * Show field error message
 * @param {HTMLElement} field - Field element
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
   hideFieldError(field); // Remove existing error

   const errorDiv = document.createElement('div');
   errorDiv.className = 'error-message';
   errorDiv.textContent = message;

   field.parentNode.appendChild(errorDiv);
}

/**
 * Hide field error message
 * @param {HTMLElement} field - Field element
 */
function hideFieldError(field) {
   const existingError = field.parentNode.querySelector('.error-message');
   if (existingError) {
      existingError.remove();
   }
}

/**
 * Debounce function for input handling
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
   let timeout;
   return function executedFunction(...args) {
      const later = () => {
         clearTimeout(timeout);
         func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
   };
}

// Export functions for use in calculator modules
window.CalculatorUtils = {
   formatCurrency,
   formatPercentage,
   validateNumberInput,
   showNotification,
   debounce,
};
