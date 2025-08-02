// Robust HTML partial includes with error handling and debugging
async function loadPartial(element, filePath) {
   try {
      console.log('Loading partial:', filePath);
      const response = await fetch(filePath);

      if (!response.ok) {
         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();
      element.innerHTML = content;
      console.log('Successfully loaded:', filePath);

      // Process any nested includes
      return true;
   } catch (error) {
      console.error('Failed to load partial:', filePath, error);
      element.innerHTML = `<div style="color: red; padding: 10px;">Error loading ${filePath}: ${error.message}</div>`;
      return false;
   }
}

async function includeHTML() {
   const elements = document.querySelectorAll('[data-include]');
   console.log('Found', elements.length, 'elements with data-include');

   for (const element of elements) {
      let filePath = element.getAttribute('data-include');

      // Convert absolute paths to relative paths for compatibility
      if (filePath.startsWith('/partials/')) {
         filePath = filePath.substring(1); // Remove leading slash
      }

      if (filePath) {
         await loadPartial(element, filePath);
      }
   }

   // Process any newly added includes recursively
   const newElements = document.querySelectorAll('[data-include]');
   if (newElements.length > 0) {
      console.log('Found nested includes, processing...');
      await includeHTML();
   }
}

// Load partials when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
   console.log('DOM loaded, starting to include partials...');
   includeHTML();
});
