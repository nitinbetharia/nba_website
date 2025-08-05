/**
 * Site Configuration - Single Source of Truth
 * N. Betharia & Associates Website
 *
 * This file centralizes all repeated content across the website
 * for easier maintenance and consistency.
 */

window.SITE_CONFIG = {
   // Company Information
   company: {
      name: 'N. Betharia & Associates',
      subtitle: 'Chartered Accountants',
      tagline: 'Professional Excellence Since 1998',
      icai_registration: 'Registered with Institute of Chartered Accountants of India (ICAI)',
      compliance_note: 'Professional services as per ICAI guidelines',
   },

   // Contact Information
   contact: {
      address: {
         building: 'Nand Niketan',
         street: 'Empress Mill Road #1, Santra Market',
         city: 'Nagpur - 440018',
         state: 'Maharashtra, India',
      },
      phone: '+91 712 2777 044',
      email: 'ca.nbetharia@gmail.com',

      // Formatted versions for different contexts
      getFullAddress: function () {
         return `${this.address.building}<br>
                    ${this.address.street}<br>
                    ${this.address.city}<br>
                    ${this.address.state}`;
      },

      getCompactAddress: function () {
         return `${this.address.building}, ${this.address.street}, ${this.address.city}`;
      },
   },

   // Services Configuration
   services: [
      {
         name: 'Audit & Assurance Services',
         slug: 'audit-assurance.html',
         icon: 'bx bx-shield-check',
         description: 'Professional audit and assurance services',
      },
      {
         name: 'Income Tax Advisory',
         slug: 'income-tax.html',
         icon: 'bx bx-briefcase',
         description: 'Expert income tax advisory and consulting',
      },
      {
         name: 'GST Advisory',
         slug: 'gst-advisory.html',
         icon: 'bx bx-bar-chart-alt-2',
         description: 'Complete GST compliance solutions',
      },
      {
         name: 'Accounting & Payroll',
         slug: 'accounting-payroll.html',
         icon: 'bx bx-line-chart',
         description: 'Complete financial management',
      },
      {
         name: 'Virtual CFO Services',
         slug: 'virtual-cfo.html',
         icon: 'bx bx-trending-up',
         description: 'Strategic financial leadership & advisory',
      },
   ],

   // Team Members Configuration
   team: [
      {
         id: 1,
         name: 'CA. Nitin Betharia',
         position: 'Founder Member',
         image: 'assets/img/team/team-1.jpg',
         description: 'Specialist in Audits, Accounts, Income-tax, System Study, Design and implementation.',
         delay: 100,
         social: {
            linkedin: '', // Add if available
            facebook: '',
            twitter: '',
         },
      },
      {
         id: 2,
         name: 'Adv. Sachin Betharia',
         position: 'Senior Member',
         image: 'assets/img/team/team-1.jpg',
         description: 'Specialist in GST and Accounting matters.',
         delay: 200,
         social: {
            linkedin: '',
            facebook: '',
            twitter: '',
         },
      },
      {
         id: 3,
         name: 'Pranav Pardhi',
         position: 'Sr. Audit Lead',
         image: 'assets/img/team/team-1.jpg',
         description: 'CA Finalist, Specializes in Accounting, Audits and Taxation.',
         delay: 300,
         social: {
            linkedin: '',
            facebook: '',
            twitter: '',
         },
      },
      {
         id: 4,
         name: 'Sonali Bhushan',
         position: 'Sr. Audit Lead',
         image: 'assets/img/team/team-2.png',
         description: 'CA. Finalist, A seasoned team member with vast hands on experience.',
         delay: 400,
         social: {
            linkedin: '',
            facebook: '',
            twitter: '',
         },
      },
      {
         id: 5,
         name: 'Kushal Bahad',
         position: 'Sr. Accountant',
         image: 'assets/img/team/team-1.jpg',
         description: 'A senior member in the team handling accounting matters.',
         delay: 500,
         social: {
            linkedin: '',
            facebook: '',
            twitter: '',
         },
      },
      {
         id: 6,
         name: 'Kajal Rambad',
         position: 'Audit cum Accounting Asst.',
         image: 'assets/img/team/team-2.png',
         description: 'A senior member in the team handling accounting matters.',
         delay: 600,
         social: {
            linkedin: '',
            facebook: '',
            twitter: '',
         },
      },
      {
         id: 7,
         name: 'Aishwarya',
         position: 'Audit & Compliance Asst.',
         image: 'assets/img/team/team-2.png',
         description: 'A senior member in the team handling accounting matters.',
         delay: 700,
         social: {
            linkedin: '',
            facebook: '',
            twitter: '',
         },
      },
   ],

   // Footer Navigation
   footer: {
      useful_links: [
         { name: 'Home', url: '#hero' },
         { name: 'About us', url: '#about' },
         { name: 'Services', url: '#services' },
         { name: 'Team', url: '#team' },
         { name: 'Privacy Policy', url: 'privacy-policy.html' },
      ],
   },

   // Resource Downloads
   resources: {
      tax: [
         {
            name: 'Tax Planning Guide',
            url: 'resources/tax-planning-guide.html',
            icon: 'bi bi-filetype-pdf',
         },
         {
            name: 'ITR Filing Checklist',
            url: 'resources/itr-filing-checklist.html',
            icon: 'bi bi-file-earmark-word',
         },
      ],
      gst: [
         {
            name: 'GST Compliance Calendar',
            url: 'resources/gst-compliance-calendar.html',
            icon: 'bi bi-calendar-week',
         },
      ],
      payroll: [
         {
            name: 'Payroll Management Guide',
            url: 'resources/payroll-management-guide.html',
            icon: 'bi bi-filetype-pdf',
         },
      ],
      audit: [
         {
            name: 'Audit Preparation Guide',
            url: 'resources/audit-preparation-guide.html',
            icon: 'bi bi-clipboard-check',
         },
      ],
      virtual_cfo: [
         {
            name: 'Virtual CFO Business Toolkit',
            url: 'resources/virtual-cfo-toolkit.html',
            icon: 'bi bi-clipboard-data',
         },
         {
            name: 'Strategic Financial Planning Guide',
            url: 'resources/strategic-financial-planning.html',
            icon: 'bi bi-graph-up-arrow',
         },
      ],
   },

   // Analytics Configuration
   analytics: {
      ga4_id: 'G-R732F1N74F',
      gtag_url: 'https://www.googletagmanager.com/gtag/js?id=',
   },

   // SEO Configuration
   seo: {
      base_url: 'https://www.nbetharia.com',
      default_image: '/assets/img/hero-bg.jpg',
      site_name: 'N. Betharia & Associates',
      geo: {
         city: 'Nagpur',
         state: 'Maharashtra',
         country: 'India',
      },
   },

   // Professional Disclaimers
   disclaimers: {
      general:
         'This information is for educational purposes only. Always consult with qualified chartered accountants for specific business decisions.',
      tax: 'Tax laws are subject to change. Consult qualified Chartered Accountants or tax professionals before making tax-related decisions.',
      icai_compliance: 'All services provided as per ICAI guidelines and professional standards.',
      resource_note: 'All financial decisions should be made in consultation with qualified chartered accountants.',
   },

   // Business Information
   business: {
      hours: {
         weekdays: '9:00 AM - 6:00 PM',
         saturday: '9:00 AM - 2:00 PM',
         sunday: 'Closed',
      },
      established: '1998',
      experience: '25+ years',
   },
};

/**
 * Content Population Functions
 * These functions safely populate content without breaking existing HTML
 */
SITE_CONFIG.populators = {
   // Populate contact information
   populateContact: function () {
      try {
         // Phone numbers
         const phoneElements = document.querySelectorAll('.config-phone');
         phoneElements.forEach((el) => {
            el.textContent = SITE_CONFIG.contact.phone;
         });

         // Email addresses
         const emailElements = document.querySelectorAll('.config-email');
         emailElements.forEach((el) => {
            el.textContent = SITE_CONFIG.contact.email;
         });

         // Company names
         const companyElements = document.querySelectorAll('.config-company-name');
         companyElements.forEach((el) => {
            el.textContent = SITE_CONFIG.company.name;
         });

         // Full addresses
         const addressElements = document.querySelectorAll('.config-address');
         addressElements.forEach((el) => {
            el.innerHTML = SITE_CONFIG.contact.getFullAddress();
         });

         console.log('✅ Contact information populated successfully');
      } catch (error) {
         console.warn('⚠️ Contact population error:', error);
      }
   },

   // Populate service navigation
   populateServices: function () {
      try {
         const serviceNavElements = document.querySelectorAll('.config-services-nav');
         serviceNavElements.forEach((container) => {
            let html = '';
            SITE_CONFIG.services.forEach((service) => {
               html += `
                        <a href="${service.slug}">
                            <i class="bi bi-arrow-right"></i>
                            <span>${service.name}</span>
                        </a>
                    `;
            });
            container.innerHTML = html;
         });

         // Populate footer practice areas
         const practiceAreaElements = document.querySelectorAll('.config-practice-areas');
         practiceAreaElements.forEach((container) => {
            let html = '';
            SITE_CONFIG.services.forEach((service) => {
               html += `
                        <li>
                            <i class="bx bx-chevron-right"></i>
                            <a href="services/${service.slug}">${service.name}</a>
                        </li>
                    `;
            });
            container.innerHTML = html;
         });

         console.log('✅ Services navigation populated successfully');
      } catch (error) {
         console.warn('⚠️ Services population error:', error);
      }
   },

   // Populate footer links
   populateFooter: function () {
      try {
         const footerLinkElements = document.querySelectorAll('.config-footer-links');
         footerLinkElements.forEach((container) => {
            let html = '';
            SITE_CONFIG.footer.useful_links.forEach((link) => {
               html += `
                        <li>
                            <i class="bx bx-chevron-right"></i>
                            <a href="${link.url}">${link.name}</a>
                        </li>
                    `;
            });
            container.innerHTML = html;
         });

         console.log('✅ Footer links populated successfully');
      } catch (error) {
         console.warn('⚠️ Footer population error:', error);
      }
   },

   // Populate team members
   populateTeam: function () {
      try {
         const teamContainer = document.querySelector('.config-team-members');
         if (!teamContainer) {
            console.log('ℹ️ No team container found (.config-team-members)');
            return;
         }

         let html = '';
         SITE_CONFIG.team.forEach((member, index) => {
            // Determine grid class based on position
            const isFirstRow = index < 2;
            const marginClass = isFirstRow ? (index === 1 ? 'mt-4 mt-lg-0' : '') : 'mt-4';

            html += `
                    <div class="col-lg-6 ${marginClass}">
                        <div class="member h-100" data-aos="zoom-in" data-aos-delay="${member.delay}">
                            <div class="pic">
                                <img src="${member.image}" class="img-fluid" alt="${member.name}" />
                            </div>
                            <div class="member-info">
                                <h4>${member.name}</h4>
                                <span>${member.position}</span>
                                <p>${member.description}</p>
                                ${this.generateSocialLinks(member.social)}
                            </div>
                        </div>
                    </div>
                `;
         });

         teamContainer.innerHTML = html;
         console.log(`✅ Team members populated successfully (${SITE_CONFIG.team.length} members)`);
      } catch (error) {
         console.warn('⚠️ Team population error:', error);
      }
   },

   // Helper function to generate social links
   generateSocialLinks: function (social) {
      if (!social || (!social.linkedin && !social.facebook && !social.twitter)) {
         return '<!-- Social media links disabled for privacy compliance -->';
      }

      let socialHtml = '<div class="social">';
      if (social.linkedin)
         socialHtml += `<a href="${social.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>`;
      if (social.facebook)
         socialHtml += `<a href="${social.facebook}" target="_blank"><i class="bi bi-facebook"></i></a>`;
      if (social.twitter) socialHtml += `<a href="${social.twitter}" target="_blank"><i class="bi bi-twitter"></i></a>`;
      socialHtml += '</div>';

      return socialHtml;
   },

   // Initialize all populators
   initializeAll: function () {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', () => {
            this.populateContact();
            this.populateServices();
            this.populateFooter();
            this.populateTeam();
         });
      } else {
         this.populateContact();
         this.populateServices();
         this.populateFooter();
         this.populateTeam();
      }
   },
};

// Performance monitoring
SITE_CONFIG.performance = {
   startTime: performance.now(),

   logLoadTime: function () {
      const loadTime = (performance.now() - this.startTime).toFixed(2);
      console.log(`📊 SITE_CONFIG loaded in ${loadTime}ms`);
   },
};

// Auto-initialize when script loads
SITE_CONFIG.populators.initializeAll();
SITE_CONFIG.performance.logLoadTime();
