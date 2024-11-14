import os
import re

# Define the folder to search for HTML files (use the current directory)
folder_path = './'  # Current folder

# Function to update links in the HTML content
def update_links(content):
    # Regex to find all <a> tags with data-id, data-slug, data-title, href attributes
    pattern = re.compile(r'(<a[^>]*data-slug="([^"]*)"[^>]*href="([^"]*)"[^>]*>[^<]*</a>)')

    def replace_link(match):
        full_tag = match.group(0)
        slug = match.group(2)
        href = match.group(3)
        
        # Check if slug and href are valid
        if slug and href:
            # Adjust the relative paths
            new_slug = slug if slug.startswith('/') else f'../../{slug}'
            new_href = href if href.endswith('index.html') else f'../../{slug}index.html'
            
            # Replace the data-slug and href in the original tag
            updated_tag = full_tag.replace(f'data-slug="{slug}"', f'data-slug="{new_slug}"').replace(f'href="{href}"', f'href="{new_href}"')
            return updated_tag
        return full_tag
    
    # Replace all <a> tags in the content
    updated_content = re.sub(pattern, replace_link, content)
    return updated_content

# Function to process all HTML files in the directory
def process_html_files():
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                
                # Read the content of the HTML file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Update the links in the content
                updated_content = update_links(content)
                
                # Write the updated content back to the file
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Updated links in: {file_path}")

# Run the script
process_html_files()