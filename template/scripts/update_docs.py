#!/usr/bin/env python3
"""
Documentation Control System (DCS) Tool

This script provides utilities for managing documentation metadata,
checking consistency between documents, and validating document relationships.
It supports the Documentation Control System as defined in README-Master.md.
"""

import os
import re
import sys
import json
import argparse
import datetime
import yaml
from pathlib import Path
from typing import Dict, List, Set, Optional, Any, Tuple

# Constants
DEFAULT_CONFIG_PATH = ".dcs_config.json"
METADATA_PATTERN = r"---\s*\n(.*?)\n\s*---"
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Document registry - this will be loaded from config or README-Master.md
DOCUMENT_REGISTRY = {}

# Console colors for output formatting
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def log_info(message: str) -> None:
    """Log informational message."""
    print(f"{Colors.BLUE}INFO:{Colors.ENDC} {message}")

def log_success(message: str) -> None:
    """Log success message."""
    print(f"{Colors.GREEN}SUCCESS:{Colors.ENDC} {message}")

def log_warning(message: str) -> None:
    """Log warning message."""
    print(f"{Colors.YELLOW}WARNING:{Colors.ENDC} {message}")

def log_error(message: str) -> None:
    """Log error message."""
    print(f"{Colors.RED}ERROR:{Colors.ENDC} {message}")

def extract_document_registry_from_master() -> Dict[str, Dict[str, Any]]:
    """
    Extract document registry from README-Master.md file.
    Returns a dictionary of document metadata.
    """
    master_path = os.path.join(ROOT_DIR, "README-Master.md")
    registry = {}
    
    try:
        with open(master_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the registry table in the Document Control System section
        registry_section = re.search(r"### Document Registry.*?\|(.*?)\|.*?(?=###|$)", 
                                   content, re.DOTALL)
        
        if not registry_section:
            log_error("Could not find Document Registry section in README-Master.md")
            return {}
            
        registry_text = registry_section.group(0)
        
        # Parse the table rows
        rows = re.findall(r"^\|(.+?)\|$", registry_text, re.MULTILINE)
        if not rows or len(rows) < 3:  # Header + separator + at least one entry
            log_error("Document Registry table is empty or malformed")
            return {}
            
        # Parse header to get column indices
        headers = [h.strip() for h in rows[0].split('|')]
        
        # Skip the separator row (row[1])
        for row in rows[2:]:
            values = [v.strip() for v in row.split('|')]
            if len(values) != len(headers):
                log_warning(f"Skipping malformed row: {row}")
                continue
                
            doc_data = {headers[i]: values[i] for i in range(len(headers))}
            doc_id = doc_data.get('Document ID')
            if doc_id:
                # Convert comma-separated strings to lists
                for field in ['Depends On', 'Affects', 'Change Requires']:
                    if field in doc_data and doc_data[field] != '-':
                        doc_data[field] = [item.strip() for item in doc_data[field].split(',')]
                    else:
                        doc_data[field] = []
                        
                registry[doc_id] = doc_data
    
    except Exception as e:
        log_error(f"Error extracting document registry: {str(e)}")
        return {}
    
    return registry

def extract_metadata(file_path: str) -> Dict[str, Any]:
    """
    Extract metadata from a markdown file.
    Returns a dictionary of metadata values or empty dict if not found.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        match = re.search(METADATA_PATTERN, content, re.DOTALL)
        if not match:
            return {}
            
        # Extract YAML-formatted metadata
        metadata_text = match.group(1)
        try:
            metadata = yaml.safe_load(metadata_text)
            return metadata if metadata else {}
        except Exception as e:
            log_error(f"Error parsing metadata in {file_path}: {str(e)}")
            return {}
    
    except Exception as e:
        log_error(f"Error reading file {file_path}: {str(e)}")
        return {}

def update_metadata(file_path: str, metadata: Dict[str, Any]) -> bool:
    """
    Update metadata in a markdown file.
    Returns True if successful, False otherwise.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert metadata to YAML
        metadata_yaml = yaml.dump(metadata, default_flow_style=False)
        metadata_block = f"---\n{metadata_yaml}---\n"
        
        # Check if metadata already exists
        if re.search(METADATA_PATTERN, content, re.DOTALL):
            # Replace existing metadata
            new_content = re.sub(METADATA_PATTERN, metadata_block, content, count=1, flags=re.DOTALL)
        else:
            # Add metadata at the beginning of the file
            new_content = metadata_block + content
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        return True
    
    except Exception as e:
        log_error(f"Error updating metadata in {file_path}: {str(e)}")
        return False

def check_document_consistency() -> Tuple[bool, List[str]]:
    """
    Check consistency between documents based on registry.
    Returns (is_consistent, list_of_issues).
    """
    issues = []
    registry = DOCUMENT_REGISTRY
    
    # Check that all documents exist
    for doc_id, doc_data in registry.items():
        doc_path = doc_data.get('Path')
        if not doc_path:
            issues.append(f"Document ID {doc_id} has no path in registry")
            continue
            
        file_path = os.path.join(ROOT_DIR, doc_path)
        if not os.path.exists(file_path):
            issues.append(f"Document {doc_id} ({doc_path}) does not exist")
            continue
        
        # Check metadata consistency
        metadata = extract_metadata(file_path)
        if not metadata:
            issues.append(f"Document {doc_id} ({doc_path}) has no metadata")
            continue
            
        if metadata.get('doc_id') != doc_id:
            issues.append(f"Document {doc_id} has inconsistent doc_id: {metadata.get('doc_id')}")
            
        reg_version = doc_data.get('Version')
        meta_version = metadata.get('version')
        if reg_version != meta_version:
            issues.append(f"Document {doc_id} has inconsistent version: {meta_version} (metadata) vs {reg_version} (registry)")
    
    # Check dependency relationships
    for doc_id, doc_data in registry.items():
        depends_on = doc_data.get('Depends On', [])
        if isinstance(depends_on, str) and depends_on != '-':
            depends_on = [depends_on]
        
        # Check that dependencies exist
        for dep_id in depends_on:
            if dep_id != '-' and dep_id not in registry:
                issues.append(f"Document {doc_id} depends on non-existent document {dep_id}")
    
    # Check for circular dependencies
    def check_circular(doc_id, visited=None, path=None):
        if visited is None:
            visited = set()
        if path is None:
            path = []
            
        if doc_id in path:
            cycle_path = ' -> '.join(path + [doc_id])
            issues.append(f"Circular dependency detected: {cycle_path}")
            return
            
        if doc_id in visited:
            return
            
        visited.add(doc_id)
        path.append(doc_id)
        
        depends_on = registry.get(doc_id, {}).get('Depends On', [])
        if isinstance(depends_on, str) and depends_on != '-':
            depends_on = [depends_on]
            
        for dep_id in depends_on:
            if dep_id != '-':
                check_circular(dep_id, visited, path.copy())
    
    for doc_id in registry:
        check_circular(doc_id)
    
    return len(issues) == 0, issues

def analyze_impact(doc_id: str) -> Set[str]:
    """
    Analyze the impact of changing a document.
    Returns a set of affected document IDs.
    """
    affected = set()
    registry = DOCUMENT_REGISTRY
    
    def gather_affected(current_id):
        if current_id not in registry:
            return
            
        affected_docs = registry[current_id].get('Affects', [])
        if isinstance(affected_docs, str):
            if affected_docs.upper() == 'ALL':
                # Add all documents except the current one
                affected.update(registry.keys() - {current_id})
            elif affected_docs != '-':
                affected_docs = [affected_docs]
        
        for aff_id in affected_docs:
            if aff_id != '-' and aff_id not in affected:
                affected.add(aff_id)
                gather_affected(aff_id)
    
    gather_affected(doc_id)
    return affected

def generate_dependency_graph(output_format='text') -> str:
    """
    Generate a visualization of document dependencies.
    Returns the graph in the specified format.
    """
    if output_format == 'text':
        result = "Document Dependency Graph:\n"
        for doc_id, doc_data in DOCUMENT_REGISTRY.items():
            result += f"\n{doc_id} ({doc_data.get('Path', 'unknown')})\n"
            
            # Display dependencies
            depends_on = doc_data.get('Depends On', [])
            if isinstance(depends_on, str) and depends_on != '-':
                depends_on = [depends_on]
                
            if depends_on and depends_on != ['-']:
                result += "  Depends on:\n"
                for dep_id in depends_on:
                    if dep_id != '-':
                        result += f"    ↑ {dep_id}\n"
            
            # Display affected documents
            affects = doc_data.get('Affects', [])
            if isinstance(affects, str) and affects != '-':
                if affects.upper() == 'ALL':
                    result += "  Affects: ALL OTHER DOCUMENTS\n"
                else:
                    affects = [affects]
                    
            if affects and affects != ['-'] and affects != 'ALL':
                result += "  Affects:\n"
                for aff_id in affects:
                    if aff_id != '-':
                        result += f"    ↓ {aff_id}\n"
            
            # Display required code paths
            requires = doc_data.get('Change Requires', [])
            if isinstance(requires, str) and requires != '-':
                requires = [requires]
                
            if requires and requires != ['-']:
                result += "  Changes require:\n"
                for req in requires:
                    if req != '-':
                        result += f"    • {req}\n"
        
        return result
    
    elif output_format == 'dot':
        # Generate DOT format for Graphviz
        lines = ['digraph DocDependencies {']
        lines.append('  rankdir=LR;')
        lines.append('  node [shape=box, style=filled, fillcolor=lightblue];')
        
        # Add nodes
        for doc_id in DOCUMENT_REGISTRY:
            lines.append(f'  "{doc_id}";')
        
        # Add edges
        for doc_id, doc_data in DOCUMENT_REGISTRY.items():
            depends_on = doc_data.get('Depends On', [])
            if isinstance(depends_on, str) and depends_on != '-':
                depends_on = [depends_on]
                
            for dep_id in depends_on:
                if dep_id != '-':
                    lines.append(f'  "{dep_id}" -> "{doc_id}" [color=blue];')
            
            affects = doc_data.get('Affects', [])
            if isinstance(affects, str):
                if affects.upper() == 'ALL':
                    # Connect to all other documents
                    for other_id in DOCUMENT_REGISTRY:
                        if other_id != doc_id:
                            lines.append(f'  "{doc_id}" -> "{other_id}" [color=red];')
                elif affects != '-':
                    affects = [affects]
                    
            if isinstance(affects, list):
                for aff_id in affects:
                    if aff_id != '-':
                        lines.append(f'  "{doc_id}" -> "{aff_id}" [color=red];')
        
        lines.append('}')
        return '\n'.join(lines)
    
    else:
        return f"Unsupported output format: {output_format}"

def update_document_metadata(doc_id: str, author: str = None) -> bool:
    """
    Update the metadata of a document by its ID.
    Returns True if successful, False otherwise.
    """
    if doc_id not in DOCUMENT_REGISTRY:
        log_error(f"Document ID {doc_id} not found in registry")
        return False
    
    doc_data = DOCUMENT_REGISTRY[doc_id]
    doc_path = doc_data.get('Path')
    if not doc_path:
        log_error(f"Document {doc_id} has no path in registry")
        return False
    
    file_path = os.path.join(ROOT_DIR, doc_path)
    if not os.path.exists(file_path):
        log_error(f"Document file {file_path} does not exist")
        return False
    
    # Extract existing metadata or create new
    metadata = extract_metadata(file_path) or {}
    
    # Update metadata fields
    metadata['doc_id'] = doc_id
    metadata['version'] = doc_data.get('Version', '1.0.0')
    metadata['last_updated'] = datetime.datetime.now().strftime('%Y-%m-%d')
    
    if author:
        metadata['updated_by'] = author
    elif 'updated_by' not in metadata:
        metadata['updated_by'] = 'system'
    
    # Set dependencies and affects
    depends_on = doc_data.get('Depends On', [])
    if isinstance(depends_on, str) and depends_on != '-':
        depends_on = [depends_on]
    metadata['depends_on'] = [d for d in depends_on if d != '-'] if depends_on else []
    
    affects = doc_data.get('Affects', [])
    if isinstance(affects, str):
        if affects.upper() == 'ALL':
            # Special case for ALL
            metadata['affects'] = 'ALL'
        elif affects != '-':
            affects = [affects]
    metadata['affects'] = [a for a in affects if a != '-'] if isinstance(affects, list) else metadata['affects']
    
    change_requires = doc_data.get('Change Requires', [])
    if isinstance(change_requires, str) and change_requires != '-':
        change_requires = [change_requires]
    metadata['change_requires'] = [c for c in change_requires if c != '-'] if change_requires else []
    
    # Write updated metadata back to file
    return update_metadata(file_path, metadata)

def validate_document_updates() -> Tuple[bool, List[str]]:
    """
    Validate that documentation updates have been properly propagated.
    Returns (is_valid, list_of_issues).
    """
    issues = []
    
    # First check consistency
    is_consistent, consistency_issues = check_document_consistency()
    if not is_consistent:
        issues.extend(consistency_issues)
    
    # Check for update propagation
    for doc_id, doc_data in DOCUMENT_REGISTRY.items():
        doc_path = doc_data.get('Path')
        if not doc_path:
            continue
            
        file_path = os.path.join(ROOT_DIR, doc_path)
        if not os.path.exists(file_path):
            continue
        
        metadata = extract_metadata(file_path)
        if not metadata:
            continue
        
        # Check that affects are up-to-date
        last_updated = metadata.get('last_updated')
        if not last_updated:
            continue
        
        # Ensure last_updated is a string in YYYY-MM-DD format
        if isinstance(last_updated, datetime.date) or isinstance(last_updated, datetime.datetime):
            last_updated = last_updated.strftime('%Y-%m-%d')
            
        affects = metadata.get('affects', [])
        if affects == 'ALL':
            # Special case for ALL
            affected_docs = [d for d in DOCUMENT_REGISTRY.keys() if d != doc_id]
        elif isinstance(affects, list):
            affected_docs = affects
        else:
            affected_docs = []
        
        for aff_id in affected_docs:
            if aff_id not in DOCUMENT_REGISTRY:
                issues.append(f"Document {doc_id} affects non-existent document {aff_id}")
                continue
                
            aff_data = DOCUMENT_REGISTRY[aff_id]
            aff_path = aff_data.get('Path')
            if not aff_path:
                continue
                
            aff_file_path = os.path.join(ROOT_DIR, aff_path)
            if not os.path.exists(aff_file_path):
                continue
            
            aff_metadata = extract_metadata(aff_file_path)
            if not aff_metadata:
                issues.append(f"Affected document {aff_id} has no metadata")
                continue
            
            aff_last_updated = aff_metadata.get('last_updated')
            if not aff_last_updated:
                issues.append(f"Affected document {aff_id} has no last_updated date")
                continue
            
            # Ensure aff_last_updated is a string in YYYY-MM-DD format
            if isinstance(aff_last_updated, datetime.date) or isinstance(aff_last_updated, datetime.datetime):
                aff_last_updated = aff_last_updated.strftime('%Y-%m-%d')
            
            # Compare dates (string comparison works for YYYY-MM-DD format)
            if aff_last_updated < last_updated:
                issues.append(f"Document {aff_id} needs to be updated to reflect changes in {doc_id} (last updated: {last_updated})")
    
    return len(issues) == 0, issues

def main():
    parser = argparse.ArgumentParser(description="Documentation Control System Tool")
    
    # Command-line arguments
    parser.add_argument('--update-meta', metavar='DOC_ID', help='Update metadata for document ID')
    parser.add_argument('--author', help='Author name for metadata updates')
    parser.add_argument('--check', action='store_true', help='Check document consistency')
    parser.add_argument('--impact', metavar='DOC_ID', help='Analyze impact of changing document')
    parser.add_argument('--graph', action='store_true', help='Generate dependency graph')
    parser.add_argument('--graph-format', choices=['text', 'dot'], default='text', help='Graph output format')
    parser.add_argument('--validate', action='store_true', help='Validate document update propagation')
    parser.add_argument('--verify', action='store_true', help='Comprehensive verification of documentation state')
    
    args = parser.parse_args()
    
    # Load document registry from README-Master.md
    global DOCUMENT_REGISTRY
    DOCUMENT_REGISTRY = extract_document_registry_from_master()
    
    if not DOCUMENT_REGISTRY:
        log_error("Failed to load document registry from README-Master.md")
        return 1
    
    # Handle commands
    if args.update_meta:
        if update_document_metadata(args.update_meta, args.author):
            log_success(f"Updated metadata for document {args.update_meta}")
        else:
            log_error(f"Failed to update metadata for document {args.update_meta}")
            return 1
    
    elif args.check:
        is_consistent, issues = check_document_consistency()
        if is_consistent:
            log_success("All documents are consistent")
        else:
            log_error("Document consistency issues found:")
            for issue in issues:
                print(f"  • {issue}")
            return 1
    
    elif args.impact:
        affected = analyze_impact(args.impact)
        if affected:
            log_info(f"Changing document {args.impact} will affect:")
            for aff_id in affected:
                doc_path = DOCUMENT_REGISTRY.get(aff_id, {}).get('Path', 'unknown')
                print(f"  • {aff_id} ({doc_path})")
        else:
            log_info(f"Document {args.impact} has no downstream impacts")
    
    elif args.graph:
        graph = generate_dependency_graph(args.graph_format)
        print(graph)
    
    elif args.validate:
        is_valid, issues = validate_document_updates()
        if is_valid:
            log_success("All document updates have been properly propagated")
        else:
            log_error("Document update propagation issues found:")
            for issue in issues:
                print(f"  • {issue}")
            return 1
    
    elif args.verify:
        # Comprehensive verification
        log_info("Performing comprehensive verification...")
        
        # Check consistency
        is_consistent, consistency_issues = check_document_consistency()
        if is_consistent:
            log_success("Document consistency check passed")
        else:
            log_error("Document consistency issues found:")
            for issue in consistency_issues:
                print(f"  • {issue}")
        
        # Validate updates
        is_valid, validation_issues = validate_document_updates()
        if is_valid:
            log_success("Document update propagation check passed")
        else:
            log_error("Document update propagation issues found:")
            for issue in validation_issues:
                print(f"  • {issue}")
        
        if not is_consistent or not is_valid:
            return 1
    
    else:
        # If no specific command, show help
        parser.print_help()
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 