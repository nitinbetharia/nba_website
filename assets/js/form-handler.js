/**
 * Advanced Form Handler - N. Betharia & Associates
 * Handles contact form and newsletter submissions with proper validation and user feedback
 */

document.addEventListener('DOMContentLoaded', function () {
   // Contact Form Handler
   const contactForm = document.querySelector('.php-email-form');

   if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
         e.preventDefault();
         handleContactFormSubmission(this);
      });
   }

   // Newsletter Form Handler
   const newsletterForms = document.querySelectorAll('form[action*="newsletter"]');

   newsletterForms.forEach((form) => {
      form.addEventListener('submit', function (e) {
         e.preventDefault();
         handleNewsletterSubmission(this);
      });
   });
});

/**
 * Handle contact form submission
 */
function handleContactFormSubmission(form) {
   const loading = form.querySelector('.loading');
   const errorMessage = form.querySelector('.error-message');
   const sentMessage = form.querySelector('.sent-message');

   // Reset states
   showElement(loading);
   hideElement(errorMessage);
   hideElement(sentMessage);

   // Validate form client-side first
   const validation = validateContactForm(form);
   if (!validation.isValid) {
      hideElement(loading);
      showError(errorMessage, validation.errors.join('<br>'));
      return;
   }

   // Prepare form data
   const formData = new FormData(form);

   // Submit form via AJAX
   fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
         'X-Requested-With': 'XMLHttpRequest',
      },
   })
      .then((response) => {
         return response.json().then((data) => ({
            status: response.status,
            data: data,
         }));
      })
      .then((result) => {
         hideElement(loading);

         if (result.status === 200 && result.data.status === 'success') {
            // Success
            showSuccess(sentMessage, result.data.message);
            form.reset();

            // Optional: Track successful submission
            if (typeof gtag !== 'undefined') {
               gtag('event', 'form_submit', {
                  event_category: 'Contact',
                  event_label: 'Contact Form Success',
               });
            }
         } else {
            // Error from server
            const errorMsg = result.data.message || 'Something went wrong. Please try again.';
            showError(errorMessage, errorMsg);
         }
      })
      .catch((error) => {
         hideElement(loading);
         console.error('Form submission error:', error);
         showError(errorMessage, 'Network error. Please check your connection and try again.');
      });
}

/**
 * Handle newsletter form submission
 */
function handleNewsletterSubmission(form) {
   const emailInput = form.querySelector('input[type="email"]');
   const submitButton = form.querySelector('input[type="submit"]');

   if (!emailInput || !submitButton) return;

   // Validate email
   const email = emailInput.value.trim();
   if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      emailInput.focus();
      return;
   }

   // Show loading state
   const originalButtonText = submitButton.value;
   submitButton.value = 'Subscribing...';
   submitButton.disabled = true;

   // Submit form
   const formData = new FormData(form);

   fetch(form.action, {
      method: 'POST',
      body: formData,
   })
      .then((response) => response.text())
      .then((data) => {
         // Reset button
         submitButton.value = originalButtonText;
         submitButton.disabled = false;

         // Show response
         alert(data);

         // Clear form on success
         if (data.includes('Thank you')) {
            emailInput.value = '';
         }
      })
      .catch((error) => {
         console.error('Newsletter subscription error:', error);
         submitButton.value = originalButtonText;
         submitButton.disabled = false;
         alert('Error: Unable to process subscription. Please try again.');
      });
}

/**
 * Client-side form validation
 */
function validateContactForm(form) {
   const errors = [];

   // Get form elements
   const name = form.querySelector('input[name="name"]').value.trim();
   const email = form.querySelector('input[name="email"]').value.trim();
   const subject = form.querySelector('input[name="subject"]').value.trim();
   const message = form.querySelector('textarea[name="message"]').value.trim();

   // Validate each field
   if (!name) {
      errors.push('Name is required');
   } else if (name.length < 2) {
      errors.push('Name must be at least 2 characters long');
   }

   if (!email) {
      errors.push('Email is required');
   } else if (!isValidEmail(email)) {
      errors.push('Please enter a valid email address');
   }

   if (!subject) {
      errors.push('Subject is required');
   } else if (subject.length < 3) {
      errors.push('Subject must be at least 3 characters long');
   }

   if (!message) {
      errors.push('Message is required');
   } else if (message.length < 10) {
      errors.push('Message must be at least 10 characters long');
   }

   return {
      isValid: errors.length === 0,
      errors: errors,
   };
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
}

/**
 * UI Helper Functions
 */
function showElement(element) {
   if (element) {
      element.style.display = 'block';
   }
}

function hideElement(element) {
   if (element) {
      element.style.display = 'none';
   }
}

function showError(element, message) {
   if (element) {
      element.innerHTML = message;
      element.style.display = 'block';
      element.style.color = '#dc3545';
   }
}

function showSuccess(element, message) {
   if (element) {
      element.innerHTML = message;
      element.style.display = 'block';
      element.style.color = '#28a745';
   }
}

/**
 * Enhanced form security and UX features
 */

// Add input focus/blur effects
document.addEventListener('DOMContentLoaded', function () {
   const formInputs = document.querySelectorAll('.php-email-form input, .php-email-form textarea');

   formInputs.forEach((input) => {
      // Add focus effect
      input.addEventListener('focus', function () {
         this.classList.add('focused');
      });

      // Add blur effect
      input.addEventListener('blur', function () {
         if (!this.value.trim()) {
            this.classList.remove('focused');
         }
      });

      // Real-time validation feedback
      input.addEventListener('input', function () {
         if (this.hasAttribute('required') && this.value.trim()) {
            this.classList.remove('error');
            this.classList.add('valid');
         }
      });
   });
});

// Prevent double submission
let formSubmitting = false;

function preventDoubleSubmission(form) {
   if (formSubmitting) return false;
   formSubmitting = true;

   setTimeout(() => {
      formSubmitting = false;
   }, 3000); // Reset after 3 seconds

   return true;
}
