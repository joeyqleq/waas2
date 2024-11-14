import os
import re

def adjust_paths(file_path, root_dir):
    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regular expressions to match script and stylesheet URLs
    script_pattern = r'<script\s+src=["\'](https?://(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:/[\w./-]*)?)["\'].*?>'
    stylesheet_pattern = r'<link\s+rel=["\']stylesheet["\']\s+href=["\'](https?://(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:/[\w./-]*)?)["\']\s*/>'

    # Function to convert URL to relative path based on file location
    def convert_to_relative(url, file_dir):
        if 'fullstopnewparagraph.co.uk' in url:
            # Handle URLs starting with domain
            return os.path.relpath(url.split("fullstopnewparagraph.co.uk", 1)[-1], file_dir)
        return url

    # Adjust script paths
    def adjust_url(match):
        url = match.group(1)
        relative_path = convert_to_relative(url, os.path.dirname(file_path))
        return match.group(0).replace(url, relative_path)

    # Adjust stylesheet paths
    def adjust_stylesheet(match):
        url = match.group(1)
        relative_path = convert_to_relative(url, os.path.dirname(file_path))
        return match.group(0).replace(url, relative_path)

    # Replace all script src URLs with relative ones
    content = re.sub(script_pattern, adjust_url, content)
    # Replace all stylesheet href URLs with relative ones
    content = re.sub(stylesheet_pattern, adjust_stylesheet, content)

    # Write the adjusted content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def process_directory(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.html'):  # Only process HTML files
                file_path = os.path.join(dirpath, filename)
                adjust_paths(file_path, root_dir)
                print(f'Processed {file_path}')

if __name__ == "__main__":
    root_dir = '.'  # The current directory (or set to a different root if needed)
    process_directory(root_dir)