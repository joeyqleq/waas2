import os
import re

# Function to replace 'Fullstopnewparagraph' as text with 'Writing As A Service'
def modify_html_content(content):
    # Replace 'Fullstopnewparagraph' with 'Writing As A Service' when it appears as text (not as a URL)
    content = re.sub(r'\bFullstopnewparagraph\b', 'Writing As A Service', content)

    # Replace 'Jon Ryder' and 'Jon' with 'WaaS'
    content = re.sub(r'\bJon Ryder\b', 'WaaS', content)
    content = re.sub(r'\bJon\b', 'WaaS', content)

    # Replace 'jon@' with 'plz'
    content = re.sub(r'jon@', 'plz', content)

    return content

# Function to process each HTML file
def process_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Modify the content (replace text and URLs)
    content = modify_html_content(content)

    # Save the modified content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

# Function to process all HTML files in the current directory and subdirectories
def scan_and_modify_directory():
    current_directory = os.path.dirname(os.path.abspath(__file__))  # Get the current directory of the script
    for subdir, dirs, files in os.walk(current_directory):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(subdir, file)
                process_html_file(file_path)
                print(f"Processed: {file_path}")

# Run the script
scan_and_modify_directory()