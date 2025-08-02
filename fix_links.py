#!/usr/bin/env python3
"""
Fix all links in HTML pages for the new structure
"""

import os
import re

def fix_links_in_file(file_path):
    """Fix all problematic links in a single file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(file_path)
    
    # Fix absolute paths to relative paths
    content = re.sub(r'href="/index\.html', 'href="index.html', content)
    content = re.sub(r'href="/([^"]+)\.html', r'href="\\1.html', content)
    
    # Fix /pages/ references to direct references
    content = re.sub(r'href="/pages/([^"#]+)', r'href="\\1', content)
    
    # Fix broken breadcrumb and button links with \\1.html artifacts
    content = re.sub(r'href="\\1\.html"', 'href="index.html"', content)
    
    # Fix specific service links in services.html
    if filename == 'services.html':
        # Audit & Assurance Learn More button
        content = re.sub(
            r'<a href="[^"]*" class="btn btn-outline-primary">Learn More</a>',
            '<a href="#audit" class="btn btn-outline-primary">Learn More</a>',
            content,
            count=1
        )
        # Tax Services Learn More button  
        content = re.sub(
            r'<a href="[^"]*" class="btn btn-outline-primary">Learn More</a>',
            '<a href="direct-tax.html" class="btn btn-outline-primary">Learn More</a>',
            content,
            count=1
        )
        # Accounting Learn More button
        content = re.sub(
            r'<a href="[^"]*" class="btn btn-outline-primary">Learn More</a>',
            '<a href="accounting.html" class="btn btn-outline-primary">Learn More</a>',
            content,
            count=1
        )
    
    # Fix index.html service links to point to correct pages
    if filename == 'index.html':
        content = re.sub(r'href="/pages/services\.html#audit"', 'href="services.html#audit"', content)
        content = re.sub(r'href="/pages/direct-tax\.html"', 'href="direct-tax.html"', content)
        content = re.sub(r'href="/pages/indirect-tax\.html"', 'href="indirect-tax.html"', content)
        content = re.sub(r'href="/pages/accounting\.html"', 'href="accounting.html"', content)
    
    # Fix about.html "View Our Services" button
    if filename == 'about.html':
        content = re.sub(r'href="\\1\.html"', 'href="services.html"', content)
    
    # Fix newsletter form action paths
    content = re.sub(r'action="/forms/', 'action="forms/', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed links in {filename}")

def main():
    """Fix links in all HTML files"""
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    for filename in html_files:
        fix_links_in_file(filename)
    
    print("All links have been fixed!")

if __name__ == '__main__':
    main()
