import os
import re

# Define the patterns to search for and the replacements for relative links
patterns = {
    r'href="\.\./index.html"': 'href="https://www.waashelp.me"',
    r'href="\.\./work/index.html"': 'href="https://www.waashelp.me/work/"',
    r'href="\.\./profile/index.html"': 'href="https://www.waashelp.me/profile/"',
    r'href="\.\./contact/index.html"': 'href="https://www.waashelp.me/contact/"',
}

def replace_links_in_file(file_path):
    """Replaces relative href links with absolute URLs in a given HTML file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Replace the patterns in the content
    for pattern, replacement in patterns.items():
        content = re.sub(pattern, replacement, content)

    # Save the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Updated file: {file_path}")

def recursive_search_and_update():
    """Recursively searches for HTML files and updates href links."""
    current_directory = os.getcwd()  # Get the current working directory
    
    for root, dirs, files in os.walk(current_directory):
        for file in files:
            if file.endswith('.html'):  # Only process .html files
                file_path = os.path.join(root, file)
                replace_links_in_file(file_path)

# Start the recursive search and update
recursive_search_and_update()