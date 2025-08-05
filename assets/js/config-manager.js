/**
 * Configuration Manager
 * Safe implementation helpers for gradual migration
 */

window.CONFIG_MANAGER = {
   // Version info
   version: '1.0.0',

   // Safety checks
   isReady: function () {
      return typeof window.SITE_CONFIG !== 'undefined';
   },

   // Safe element updater
   safeUpdate: function (selector, content, isHTML = false) {
      try {
         const elements = document.querySelectorAll(selector);
         if (elements.length === 0) {
            console.log(`ℹ️ No elements found for selector: ${selector}`);
            return false;
         }

         elements.forEach((el) => {
            if (isHTML) {
               el.innerHTML = content;
            } else {
               el.textContent = content;
            }
         });

         console.log(`✅ Updated ${elements.length} elements for: ${selector}`);
         return true;
      } catch (error) {
         console.error(`❌ Error updating ${selector}:`, error);
         return false;
      }
   },

   // Gradual migration helpers
   migration: {
      // Phase 1: Just phone numbers
      migratePhoneNumbers: function () {
         if (!CONFIG_MANAGER.isReady()) return;

         const phoneSelectors = ['.config-phone', '[data-config="phone"]'];

         phoneSelectors.forEach((selector) => {
            CONFIG_MANAGER.safeUpdate(selector, SITE_CONFIG.contact.phone);
         });
      },

      // Phase 2: Email addresses
      migrateEmails: function () {
         if (!CONFIG_MANAGER.isReady()) return;

         const emailSelectors = ['.config-email', '[data-config="email"]'];

         emailSelectors.forEach((selector) => {
            CONFIG_MANAGER.safeUpdate(selector, SITE_CONFIG.contact.email);
         });
      },

      // Phase 3: Company names
      migrateCompanyNames: function () {
         if (!CONFIG_MANAGER.isReady()) return;

         const companySelectors = ['.config-company-name', '[data-config="company-name"]'];

         companySelectors.forEach((selector) => {
            CONFIG_MANAGER.safeUpdate(selector, SITE_CONFIG.company.name);
         });
      },

      // Phase 4: Full addresses
      migrateAddresses: function () {
         if (!CONFIG_MANAGER.isReady()) return;

         const addressSelectors = ['.config-address', '[data-config="address"]'];

         addressSelectors.forEach((selector) => {
            CONFIG_MANAGER.safeUpdate(selector, SITE_CONFIG.contact.getFullAddress(), true);
         });
      },
   },

   // Performance monitoring
   performance: {
      timers: {},

      start: function (name) {
         this.timers[name] = performance.now();
      },

      end: function (name) {
         if (this.timers[name]) {
            const duration = (performance.now() - this.timers[name]).toFixed(2);
            console.log(`⏱️ ${name}: ${duration}ms`);
            delete this.timers[name];
            return duration;
         }
      },
   },

   // Debugging helpers
   debug: {
      // Show all available config data
      showConfig: function () {
         console.group('🔧 SITE_CONFIG Debug Info');
         console.log('Company:', SITE_CONFIG.company);
         console.log('Contact:', SITE_CONFIG.contact);
         console.log('Services:', SITE_CONFIG.services);
         console.groupEnd();
      },

      // Test selectors
      testSelectors: function () {
         const testSelectors = ['.config-phone', '.config-email', '.config-company-name', '.config-address'];

         console.group('🎯 Selector Test Results');
         testSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            console.log(`${selector}: ${elements.length} elements found`);
         });
         console.groupEnd();
      },

      // Performance summary
      showPerformance: function () {
         const configSize = JSON.stringify(SITE_CONFIG).length;
         console.group('📊 Performance Summary');
         console.log(`Config size: ${(configSize / 1024).toFixed(2)}KB`);
         console.log(`Load time: ${SITE_CONFIG.performance.logLoadTime || 'N/A'}`);
         console.log(`Memory impact: Minimal (~${(configSize / 1024).toFixed(1)}KB)`);
         console.groupEnd();
      },
   },

   // Initialize with safety checks
   initialize: function () {
      console.log('🚀 CONFIG_MANAGER v' + this.version + ' initializing...');

      if (!this.isReady()) {
         console.error('❌ SITE_CONFIG not loaded!');
         return false;
      }

      // Start performance monitoring
      this.performance.start('CONFIG_MANAGER_INIT');

      // Run safe migrations
      this.migration.migratePhoneNumbers();
      this.migration.migrateEmails();
      this.migration.migrateCompanyNames();
      this.migration.migrateAddresses();

      // End performance monitoring
      this.performance.end('CONFIG_MANAGER_INIT');

      console.log('✅ CONFIG_MANAGER initialized successfully');
      return true;
   },
};

// Auto-initialize after DOM is ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', () => {
      CONFIG_MANAGER.initialize();
   });
} else {
   CONFIG_MANAGER.initialize();
}
