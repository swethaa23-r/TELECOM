import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

def process_href(match):
    full_match = match.group(0)
    href_value = match.group(1)
    
    if href_value == '#' or href_value == '':
        return 'href="404.html"'
        
    if href_value.startswith(('#', 'http', 'mailto:', 'tel:', 'javascript:')):
        return full_match
        
    filename = href_value.split('#')[0]
    
    # Keep css/js assets
    if not filename.endswith('.html') and ('/' in filename or '.' in filename):
        return full_match
        
    # If it ends with .html but not in our list
    if filename.endswith('.html') and filename not in html_files:
        return full_match.replace(href_value, '404.html')
        
    # Any other unknown links that don't match files in dir
    if filename and filename not in html_files and not filename.endswith('.css') and not filename.endswith('.js') and not filename.endswith('.webp') and not filename.endswith('.png') and not filename.endswith('.jpg'):
        return full_match.replace(href_value, '404.html')
        
    return full_match

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = re.sub(r'href="([^"]*)"', process_href, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Links updated.")
