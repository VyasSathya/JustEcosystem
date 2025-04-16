# Change Tracking Document: {CHANGE_NAME}

## Change Overview

**Description**: {Brief description of the change being made}

**Scope**: {Scope of the change - component rename, feature addition, etc.}

**Date Started**: {Date}

**Current Status**: {In progress/Completed}

## Discovery Phase

### Search Patterns Used

| Pattern | Tool | Target | Results Summary |
|---------|------|--------|-----------------|
| `{pattern1}` | grep_search | Global | {X} files found |
| `{pattern2}` | codebase_search | src/components | {Y} relevant results |
| `{file pattern}` | file_search | - | {Z} files found |

### File Categories Identified

#### Core Definition Files

- {path/to/file1} - {brief description}
- {path/to/file2} - {brief description}


#### Component Implementation Files

- {path/to/component1} - {brief description}
- {path/to/component2} - {brief description}


#### Style/CSS Files

- {path/to/css1} - {brief description}
- {path/to/css2} - {brief description}


#### Documentation Files

- {path/to/doc1} - {brief description}
- {path/to/doc2} - {brief description}


#### Test Files

- {path/to/test1} - {brief description}
- {path/to/test2} - {brief description}


## Dependency Map

```text

{file1} → {file2} → {file3}
   ↓         ↓
{file4} → {file5}
```text


## Change Strategy

### Replacement Patterns

| Original | Replacement | Context |
|----------|-------------|---------|
| `{original1}` | `{replacement1}` | {context description} |
| `{original2}` | `{replacement2}` | {context description} |

### Execution Order

1. {first file to modify}
2. {second file to modify}
3. {third file to modify}

...

## Progress Tracking

| File | Status | Notes |
|------|--------|-------|
| {file1} | Completed | {any special notes} |
| {file2} | In Progress | {current challenges} |
| {file3} | Pending | {dependencies} |

## Verification Steps


- [ ] `grep_search` for original terms returns no results
- [ ] All new files correctly imported where needed
- [ ] CSS classes correctly updated in both style files and component references
- [ ] Documentation screenshots/examples updated
- [ ] Tests pass with new implementation


## Issues Encountered


- **{Issue 1}**: {Description of the issue}

  - **Solution**: {How it was resolved}



- **{Issue 2}**: {Description of the issue}

  - **Solution**: {How it was resolved}


## Lessons Learned


- {Lesson 1}
- {Lesson 2}
- {Lesson 3}


## Follow-up Tasks


- [ ] {Task 1}
- [ ] {Task 2}
- [ ] {Task 3}

