import os
import argparse
from datetime import datetime

EXCLUDED_DIRS = {'.git', 'node_modules', '__pycache__', '.vscode'} # Add more if needed
EXCLUDED_FILES = {'.DS_Store'} # Add more if needed

def generate_tree(start_path, indent='', output_lines=None):
    """Recursively generates the directory tree structure."""
    if output_lines is None:
        output_lines = []

    # Get list of items, separating dirs and files
    try:
        items = os.listdir(start_path)
    except OSError:
        # Permission denied or other error
        output_lines.append(f'{indent}+-- [Error reading directory]')
        return output_lines

    dirs = sorted([d for d in items if os.path.isdir(os.path.join(start_path, d))
                   and d not in EXCLUDED_DIRS])
    files = sorted([f for f in items if os.path.isfile(os.path.join(start_path, f))
                    and f not in EXCLUDED_FILES])

    entries = dirs + files

    for i, entry in enumerate(entries):
        connector = '|-- ' if i < len(entries) - 1 else '+-- '
        path = os.path.join(start_path, entry)
        output_lines.append(f'{indent}{connector}{entry}')

        if entry in dirs:
            new_indent = indent + ('|   ' if i < len(entries) - 1 else '    ')
            generate_tree(path, new_indent, output_lines)

    return output_lines

def main():
    parser = argparse.ArgumentParser(description='Generate a directory tree structure.')
    parser.add_argument(
        '--root', 
        default='.',
        help='The root directory to start scanning from.'
    )
    parser.add_argument(
        '--output',
        default='README-tree.md',
        help='The output Markdown file path.'
    )
    args = parser.parse_args()

    root_dir = os.path.abspath(args.root)
    output_file = os.path.abspath(args.output)
    output_dir = os.path.dirname(output_file)

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Generate the tree structure lines
    tree_lines = [os.path.basename(root_dir)] # Start with the root dir name
    tree_lines.extend(generate_tree(root_dir))

    # Prepare Markdown content
    markdown_content = f"""# Project File Structure

Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

Root: `{root_dir}`

```
{os.path.basename(root_dir)}
"""
    # Use os.linesep for platform compatibility in the join
    markdown_content += os.linesep.join(tree_lines[1:]) # Skip the repeated root name
    markdown_content += "\n```\n"
    
    # Add self-reference information
    script_path = os.path.relpath(__file__, root_dir).replace('\\', '/')
    markdown_content += f"""
## How to Regenerate This Documentation

This file structure documentation was generated using the `{script_path}` script. You can regenerate it at any time using the following command:

```bash
# Generate with default options (outputs to README-tree.md)
python {script_path}

# Generate with custom root and output location
python {script_path} --root /path/to/dir --output /path/to/output.md
```

### Excluded Items

The script automatically excludes the following items:
- Directories: {', '.join(f'`{d}`' for d in EXCLUDED_DIRS)}
- Files: {', '.join(f'`{f}`' for f in EXCLUDED_FILES)}

To modify these exclusions, edit the `EXCLUDED_DIRS` and `EXCLUDED_FILES` sets in the script.
"""

    # Write to the output file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        print(f'File structure saved to {output_file}')
    except IOError as e:
        print(f'Error writing to file {output_file}: {e}')

if __name__ == "__main__":
    main() 