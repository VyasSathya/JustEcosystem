import os
import re
from glob import glob

# Paths to all MASTER_SYNC.md files in the ecosystem
REPO_PATHS = [
    os.path.join('..', 'JustWorks', '.task', 'tasks', 'MASTER_SYNC.md'),
    os.path.join('..', 'JustStuff', '.task', 'tasks', 'MASTER_SYNC.md'),
    os.path.join('..', 'JustCreate', '.task', 'tasks', 'MASTER_SYNC.md'),
]

# Regex to match checklist items
CHECKBOX_PATTERN = re.compile(r'- \[( |x)\]')

# Regex to match table rows with a status column marked as '✅ Completed' or 'Completed' (case-insensitive)
TABLE_PATTERN = re.compile(r'\|.*?\|.*?\|.*?(✅ Completed|Completed)', re.IGNORECASE)

def count_checkboxes(md_path):
    checked = 0
    total = 0
    per_task = {}
    current_task = None
    in_integration = False
    integration_checked = 0
    integration_total = 0
    if not os.path.exists(md_path):
        return 0, 0, {}, (0, 0)
    with open(md_path, encoding='utf-8') as f:
        for line in f:
            s = line.strip()
            # Integration Checklist section
            if s.lower().startswith('## integration checklist'):
                in_integration = True
                continue
            if in_integration and (s.startswith('---') or s.startswith('|')):
                in_integration = False
            if in_integration and CHECKBOX_PATTERN.match(s):
                integration_total += 1
                if '[x]' in s:
                    integration_checked += 1
            # Master Task section
            if s.startswith('|') and '|' in s and 'Master Task ID' in s:
                current_task = None
                continue
            if s.startswith('|') and '|' in s and s.count('|') > 3:
                # Try to extract task ID
                parts = [p.strip() for p in s.split('|') if p.strip()]
                if len(parts) > 0 and parts[0].startswith('MASTER-'):
                    current_task = parts[0]
                    if current_task not in per_task:
                        per_task[current_task] = {'checked': 0, 'total': 0, 'title': parts[1] if len(parts) > 1 else ''}
                continue
            match = CHECKBOX_PATTERN.match(s)
            if match and current_task:
                per_task[current_task]['total'] += 1
                if match.group(1) == 'x':
                    per_task[current_task]['checked'] += 1
            if match:
                total += 1
                if match.group(1) == 'x':
                    checked += 1
    return checked, total, per_task, (integration_checked, integration_total)

def count_table_tasks(md_path):
    completed = 0
    if not os.path.exists(md_path):
        return 0
    with open(md_path, encoding='utf-8') as f:
        for line in f:
            match = TABLE_PATTERN.search(line.strip())
            if match:
                completed += 1
    return completed

def print_bar(label, checked, total, bar_len=20):
    percent = (checked / total * 100) if total else 0
    filled_len = int(round(bar_len * percent / 100))
    bar = '▓' * filled_len + '░' * (bar_len - filled_len)
    print(f"{label}: [{bar}] {percent:.0f}% ({checked}/{total})")

def main():
    repo_names = ['JustWorks', 'JustStuff', 'JustCreate']
    overall_checked = 0
    overall_total = 0
    overall_integration_checked = 0
    overall_integration_total = 0
    overall_per_task = {}
    for idx, md_path in enumerate(REPO_PATHS):
        repo = repo_names[idx]
        checked, total, per_task, (integration_checked, integration_total) = count_checkboxes(md_path)
        overall_checked += checked
        overall_total += total
        overall_integration_checked += integration_checked
        overall_integration_total += integration_total
        print(f'\n=== {repo} ===')
        print_bar('Integration Checklist', integration_checked, integration_total, bar_len=10)
        incomplete_tasks = sum(1 for d in per_task.values() if d['checked'] < d['total'])
        if incomplete_tasks > 0:
            print(f'  {incomplete_tasks} master tasks remaining')
    print('\n=== OVERALL ===')
    print_bar('All Integration Checklists', overall_integration_checked, overall_integration_total, bar_len=10)
    print_bar('TOTAL (All Checklists)', overall_checked, overall_total, bar_len=10)
    tbl_checked = 0
    for md_path in REPO_PATHS:
        tc = count_table_tasks(md_path)
        tbl_checked += tc
    print(f"Table Tasks Completed: {tbl_checked}")

if __name__ == '__main__':
    main()
