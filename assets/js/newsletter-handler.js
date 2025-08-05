// Universal Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function () {
   // Handle all newsletter forms with class 'newsletter-form'
   const newsletterForms = document.querySelectorAll('.newsletter-form');

   newsletterForms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
         e.preventDefault();

         const email = this.querySelector('input[type="email"]').value;
         const submitBtn = this.querySelector('input[type="submit"]');

         // Store original button text
         const originalText = submitBtn.value;

         // Show loading state
         submitBtn.value = 'Subscribing...';
         submitBtn.disabled = true;

         // Simulate subscription process
         setTimeout(() => {
            // Show success state
            submitBtn.value = 'Subscribed!';
            submitBtn.style.background = '#28a745';
            submitBtn.style.color = 'white';

            // Log subscription (for testing)
            console.log('Newsletter Subscription:', email);

            // Show success message if available
            const successMsg = this.querySelector('.success-message');
            if (successMsg) {
               successMsg.style.display = 'block';
            }

            // Reset after 3 seconds
            setTimeout(() => {
               this.reset();
               submitBtn.value = originalText;
               submitBtn.disabled = false;
               submitBtn.style.background = '';
               submitBtn.style.color = '';

               if (successMsg) {
                  successMsg.style.display = 'none';
               }
            }, 3000);
         }, 1000);
      });
   });
});
