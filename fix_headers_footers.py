#!/usr/bin/env python3
"""
Fix header and footer consistency across all HTML pages
to match the index.html structure and styling
"""

import os
import re

# List of HTML files to process (excluding index.html)
html_files = [
    'accounting.html',
    'accounting-systems.html', 
    'compliance.html',
    'direct-tax.html',
    'indirect-tax.html',
    'privacy-policy.html',
    'terms.html'
]

# Standard navigation structure for inner pages
new_navigation = '''         <nav id="navbar" class="navbar">
            <ul>
               <li><a class="nav-link" href="index.html">Home</a></li>
               <li><a class="nav-link" href="about.html">About</a></li>
               <li><a class="nav-link" href="services.html">Services</a></li>
               <li><a class="nav-link" href="index.html#team">Team</a></li>
               <li><a class="getstarted" href="index.html#contact">Contact</a></li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle"></i>
         </nav>'''

# Standard footer structure matching index.html
new_footer = '''      <footer id="footer">
   <div class="footer-top">
      <div class="container">
         <div class="row">
            <div class="col-lg-3 col-md-6 footer-contact">
               <h3 class="nba-brand">N. Betharia & Associates</h3>
               <p>
                  Nand Niketan <br />
                  Empress Mill Road #1, Santra Market<br />
                  Nagpur <br /><br />
                  <strong>Phone:</strong> +91 712 2777 044<br />
                  <strong>Email:</strong> ca.nbetharia@gmail.com<br />
               </p>
            </div>

            <div class="col-lg-2 col-md-6 footer-links">
               <h4>Useful Links</h4>
               <ul>
                  <li><i class="bx bx-chevron-right"></i> <a href="index.html">Home</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="about.html">About us</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="services.html">Services</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="terms.html">Terms of service</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="privacy-policy.html">Privacy policy</a></li>
               </ul>
            </div>

            <div class="col-lg-3 col-md-6 footer-links">
               <h4>Practice Areas</h4>
               <ul>
                  <li><i class="bx bx-chevron-right"></i> <a href="accounting-systems.html">Accounting Systems Design</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="accounting.html">Accounting</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="direct-tax.html">Direct Tax Consulting</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="indirect-tax.html">Indirect Tax Consulting</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="compliance.html">Compliance Services</a></li>
               </ul>
            </div>

            <div class="col-lg-4 col-md-6 footer-newsletter">
               <h4>Join Our Newsletter</h4>
               <p>
                  Occasionally we publish a newsletter, if you wish to subscribe, please fill in your email and hit subscribe.
               </p>
               <form action="forms/newsletter.php" method="post">
                  <input type="email" name="email" required /><input type="submit" value="Subscribe" />
               </form>
            </div>
         </div>
      </div>
   </div>

   <div class="container d-md-flex py-4">
      <div class="me-md-auto text-center text-md-start">
         <div class="copyright">
            &copy; Copyright <strong><span>N. Betharia & Associates</span></strong>. All Rights Reserved
         </div>
         <div class="credits">Designed by <a href="https://www.tvaritatech.com">TvaritaTech</a></div>
      </div>
      <div class="social-links text-center text-md-right pt-3 pt-md-0">
         <a href="#" class="twitter"><i class="bx bxl-twitter"></i></a>
         <a href="#" class="facebook"><i class="bx bxl-facebook"></i></a>
         <a href="#" class="instagram"><i class="bx bxl-instagram"></i></a>
         <a href="#" class="google-plus"><i class="bx bxl-skype"></i></a>
         <a href="#" class="linkedin"><i class="bx bxl-linkedin"></i></a>
      </div>
   </div>
</footer>'''

def fix_html_file(filename):
    """Fix header and footer in a single HTML file"""
    print(f"Processing {filename}...")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix navigation - replace any existing navbar
        nav_pattern = r'<nav id="navbar" class="navbar">.*?</nav>'
        content = re.sub(nav_pattern, new_navigation, content, flags=re.DOTALL)
        
        # Fix footer - replace any existing footer
        footer_pattern = r'<footer id="footer"[^>]*>.*?</footer>'
        content = re.sub(footer_pattern, new_footer, content, flags=re.DOTALL)
        
        # Write back the fixed content
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Fixed {filename}")
        
    except Exception as e:
        print(f"❌ Error processing {filename}: {str(e)}")

def main():
    """Main function to process all HTML files"""
    print("🔧 Fixing header and footer consistency across all pages...")
    print("=" * 60)
    
    fixed_count = 0
    for filename in html_files:
        if os.path.exists(filename):
            fix_html_file(filename)
            fixed_count += 1
        else:
            print(f"⚠️ File not found: {filename}")
    
    print("=" * 60)
    print(f"✅ Successfully processed {fixed_count} HTML files")
    print("🎉 All headers and footers are now consistent!")

if __name__ == "__main__":
    main()
