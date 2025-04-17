import os
import re

# Paths to critical JustWorks files
SETUP_CHECKLIST = os.path.join('..', 'JustWorks', 'SETUP_CHECKLIST.md')
MASTER_SYNC = os.path.join('..', 'JustWorks', '.task', 'tasks', 'MASTER_SYNC.md')

CHECKBOX_PATTERN = re.compile(r'- \[( |x)\]')

# List of keywords that indicate tasks AI cannot do (manual, human, review, secret, etc.)
BLOCK_KEYWORDS = [
    'manual', 'human', 'review', 'secret', 'private key', 'apple developer', 'cloud console',
    'set up', 'configure', 'create', 'register', 'password', 'api key', 'callback', 'developer portal',
    'test on device', 'QA', 'verify', 'credential', 'team id', 'client id', 'secret', 'download', 'upload'
]

def find_blocks_in_file(filepath):
    blocks = []
    if not os.path.exists(filepath):
        return blocks
    with open(filepath, encoding='utf-8') as f:
        for line in f:
            match = CHECKBOX_PATTERN.match(line.strip())
            if match and match.group(1) == ' ':
                # Only consider unchecked tasks
                task = line.strip()[6:]
                for kw in BLOCK_KEYWORDS:
                    if kw in task.lower():
                        blocks.append(task)
                        break
    return blocks

def main():
    blocks = []
    blocks += find_blocks_in_file(SETUP_CHECKLIST)
    blocks += find_blocks_in_file(MASTER_SYNC)
    if blocks:
        print('--- Manual/Human Tasks That May Block Automation ---')
        for b in blocks:
            print(f'- {b}')
    else:
        print('No manual/human/blocked tasks found!')

if __name__ == '__main__':
    main()
