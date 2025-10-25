import os
import re

def _process_file_content(content, root, root_dir):
    """Process the content of a single file"""
    # Fix imports starting with 'app.'
    content = re.sub(r'from\s+app\.', 'from ', content)
    content = re.sub(r'import\s+app\.', 'import ', content)
    
    # Handle relative imports
    rel_dir = os.path.relpath(root, root_dir)
    if rel_dir != '.':
        levels = len(rel_dir.split(os.sep))
        dots = '.' * levels
        content = re.sub(r'from\s+(\w+)', f'from {dots}\\1', content)
    return content

def _process_single_file(filepath, root, root_dir):
    """Process a single Python file"""
    try:
        if 'app\\venv' in filepath:
            return
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        content = _process_file_content(content, root, root_dir)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed imports in {filepath}")
    except (UnicodeDecodeError, OSError):
        print(f"Skipping {filepath} due to encoding/access issues")

def fix_imports(directory):
    """Recursively fix imports in Python files"""
    root_dir = os.path.abspath(directory)
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                _process_single_file(filepath, root, root_dir)

if __name__ == '__main__':
    app_dir = os.path.dirname(os.path.abspath(__file__))
    fix_imports(app_dir)
    print("Import fixes complete!")
