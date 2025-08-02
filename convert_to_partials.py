#!/usr/bin/env python3
"""
Script to convert pages to use partials system with correct paths
"""

import os
import re

def convert_page_to_partials(file_path):
    """Convert a page to use the partials system"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(file_path)
    
    # Extract the page title from the existing title tag
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else 'N. Betharia & Associates'
    
    # Extract the main content (everything between body tags, excluding header and footer)
    body_match = re.search(r'<body[^>]*>(.*)</body>', content, re.DOTALL)
    if not body_match:
        print(f"Could not find body content in {filename}")
        return
    
    body_content = body_match.group(1)
    
    # Remove the embedded header and footer
    # Extract just the main content
    main_match = re.search(r'<main[^>]*>(.*)</main>', body_content, re.DOTALL)
    if main_match:
        main_content = main_match.group(1)
    else:
        print(f"Could not find main content in {filename}")
        return
    
    # Create new content with partials
    new_content = f'''<!DOCTYPE html>
<html lang="en">
   <head data-include="partials/head.html"></head>
   <body>
      <div data-include="partials/header.html"></div>

      <main id="main">
{main_content}
      </main>

      <div data-include="partials/footer.html"></div>
      <div data-include="partials/scripts.html"></div>
   </body>
</html>'''

    # Fix any remaining ../assets/ paths to assets/
    new_content = new_content.replace('../assets/', 'assets/')
    new_content = new_content.replace('../index.html', 'index.html')
    new_content = new_content.replace('../forms/', 'forms/')
    
    # Update internal page links
    new_content = re.sub(r'href="([^"]*?)\.html"', r'href="\\1.html"', new_content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Converted {filename} to use partials")

def main():
    # Convert all HTML files except index.html
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html']
    
    for filename in html_files:
        convert_page_to_partials(filename)

if __name__ == '__main__':
    main()
