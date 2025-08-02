// Form validation and submission
document.addEventListener('DOMContentLoaded', function () {
   const form = document.querySelector('.php-email-form');

   if (form) {
      form.addEventListener('submit', function (e) {
         e.preventDefault();

         const loading = form.querySelector('.loading');
         const errorMessage = form.querySelector('.error-message');
         const sentMessage = form.querySelector('.sent-message');

         // Reset states
         loading.style.display = 'block';
         errorMessage.style.display = 'none';
         sentMessage.style.display = 'none';

         // Get form data
         const formData = new FormData(form);

         // Submit form
         fetch(form.action, {
            method: 'POST',
            body: formData,
         })
            .then((response) => response.text())
            .then((data) => {
               loading.style.display = 'none';
               sentMessage.innerHTML = data;
               sentMessage.style.display = 'block';
               form.reset();
            })
            .catch((error) => {
               loading.style.display = 'none';
               errorMessage.innerHTML = 'Something went wrong. Please try again.';
               errorMessage.style.display = 'block';
            });
      });
   }
});
