#!/usr/bin/env python3
"""
Convert all pages to static HTML with embedded header and footer (no partials)
"""

import os
import re

def read_partial(partial_name):
    """Read content from a partial file"""
    partial_path = f"partials/{partial_name}"
    try:
        with open(partial_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return f"<!-- {partial_name} not found -->"

def convert_page_to_static(file_path):
    """Convert a page from partials system to static HTML"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(file_path)
    
    # Read partials
    head_content = read_partial('head.html')
    if filename == 'index.html':
        header_content = read_partial('header-index.html')
        footer_content = read_partial('footer-index.html')
    else:
        header_content = read_partial('header.html')
        footer_content = read_partial('footer.html')
    
    scripts_content = read_partial('scripts.html')
    
    # Replace data-include elements with actual content
    content = re.sub(r'<head data-include="[^"]*"></head>', f'<head>\\n{head_content}\\n</head>', content)
    content = re.sub(r'<div data-include="partials/header[^"]*"></div>', header_content, content)
    content = re.sub(r'<div data-include="partials/footer[^"]*"></div>', footer_content, content)
    content = re.sub(r'<div data-include="partials/scripts[^"]*"></div>', scripts_content, content)
    
    # Remove include-partials.js since we don't need it anymore
    content = re.sub(r'<script src="assets/js/include-partials\.js"></script>\\n?', '', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Converted {filename} to static HTML")

def main():
    # Convert all HTML files
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    for filename in html_files:
        convert_page_to_static(filename)

if __name__ == '__main__':
    main()
