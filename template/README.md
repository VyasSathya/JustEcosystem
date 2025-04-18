<!--
Document Control System Metadata
doc_id: DOC-README
version: 1.0.0
last_updated: {CURRENT_DATE}
updated_by: {AUTHOR}
depends_on: DOC-MASTER
affects: -
change_requires: -
-->

# 📑 <ProjectName>: Universal Task & Documentation Management Template

> 🚦 **For onboarding, task management, and project setup, see the root [`README.md`](../../README.md) and [`CHECKLIST.md`](../../CHECKLIST.md) — your single entry point for all engineers, AI agents, and managers.**
>
> This template provides a universal, automation-ready foundation for any project.


> 🚦 **For onboarding, task management, and process, see the root [`README.md`](../../README.md) — your single entry point for all engineers and managers.**
>
> This file documents technical details unique to the JustStuff template and task/documentation system.

## 🚦 Scripts (Always Two Words)

All automation and utility scripts are run as two-word npm commands:

| Command                 | What it does                                |
|------------------------|---------------------------------------------|
| `npm run ai:status`    | Show status of all tasks and docs           |
| `npm run ai:suggest`   | Suggest next actions for tasks              |
| `npm run brand:apply`  | Apply JustEcosystem branding to README      |
| `npm run dash:start`   | Start the compliance dashboard server       |
| `npm run repo:new`     | Scaffold a new repo from this template      |
| `npm run list:scripts` | List all available npm scripts              |
| `npm run lint:all`     | Lint all code and markdown                  |
| `npm run task:open`    | Open the interactive task manager           |
| `npm run doc:open`     | Open the interactive doc manager            |
| `npm run fix:markdown` | Auto-fix markdown formatting                |

> **Tip:** To see all available scripts at any time, run:
> ```bash
> npm run list:scripts
> ```

---

## Table of Contents
- [Overview](#overview)
- [System Components](#system-components)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
- [Task Management](#task-management)
  - [Task Structure](#task-structure)
  - [Key Commands](#key-task-commands)
  - [Task Status Guide](#task-status-guide)
- [Documentation Management](#documentation-management)
  - [Documentation Structure](#documentation-structure)
  - [Key Commands](#key-documentation-commands)
  - [Document Status Guide](#document-status-guide)
- [Integration Features](#integration-features)
- [Command System](#command-system)
- [Best Practices](#best-practices)
- [Reference Documentation](#reference-documentation)

## Overview

JustStuff provides a comprehensive system for managing both tasks and documentation with bi-directional linking. This ensures documentation stays in sync with development progress and creates a cohesive project management environment.

## System Components

```
JustStuff/
├── .task/                        # Task management system
│   ├── tasks/                    # Task definitions
│   ├── views/                    # Saved task views/filters
│   ├── history/                  # Task change history
│   └── README.md                 # Task system documentation
├── .docs/                        # Documentation management
│   ├── master/                   # System-wide docs
│   ├── component_a/              # Component A docs
│   ├── component_b/              # Component B docs
│   ├── templates/                # Doc templates
│   ├── versions/                 # Versioned documentation
│   └── README.md                 # Documentation system guide
├── scripts/                      # CLI and automation scripts
│   ├── task-cli.js               # Task CLI tool
│   ├── doc-cli.js                # Documentation CLI tool
│   └── setup.js                  # Setup script
├── src/                          # Source code
└── README.md                     # This file - main documentation
```

## Getting Started

### Installation

```bash
# Clone or copy the template
git clone <repository-url> my-juststuff-project
cd my-juststuff-project

# Install dependencies
npm install
```

The `postinstall` script will automatically set up the task and documentation directories and create sample files.

### Quick Start

1. **Manage Tasks**: `npm run task`
2. **Manage Documentation**: `npm run doc`
3. **Fix Markdown Formatting**: `npm run fix-markdown`

## Task Management

The task management system provides interactive tools to create, track, and manage development tasks.

### Task Structure

Tasks are stored as Markdown files with YAML frontmatter:

```markdown
---
id: TASK-001
title: Implement Feature X
status: 🟢 In Progress
priority: High
phase: 1
mvp: true
dependencies: []
assignee: "John Doe"
due_date: "2025-04-20"
last_updated: "2025-04-15"
doc_impact: high
affected_docs: ["DOC-ARCH-001", "DOC-IMPL-001"]
---

## Description
Detailed task description goes here...
```

### Key Task Commands

| Command | Description |
|---------|-------------|
| `npm run task` | Launch task management CLI |
| `View all tasks` | Display all tasks in the system |
| `View tasks by status` | Filter tasks by their current status |
| `Create a new task` | Add a new task to the system |
| `Update a task` | Modify an existing task |

### Task Status Guide

- 🔴 **Blocked**: Cannot proceed due to dependencies
- 🟡 **Partially Blocked**: Can start but needs additional resources
- 🟢 **In Progress**: Work is actively ongoing
- ⚪ **Not Started**: Task has been defined but work hasn't begun
- ✅ **Completed**: Task is finished and verified

For detailed task management documentation, see [.task/README.md](./.task/README.md)

## Documentation Management

The documentation system enables creating, updating, and versioning technical documentation with links to related tasks.

### Documentation Structure

Documents use Markdown with YAML frontmatter:

```markdown
---
id: DOC-ARCH-001
title: "JustStuff Architecture Overview"
status: 🟢 Current
version: 1.0.0
last_updated: "2025-04-15"
related_tasks: ["TASK-001", "TASK-002"]
contributors: ["Jane Smith", "John Doe"]
tags: ["architecture", "overview", "system"]
---

# JustStuff Architecture Overview
Document content goes here...
```

### Key Documentation Commands

| Command | Description |
|---------|-------------|
| `npm run doc` | Launch documentation management CLI |
| `View all documentation` | Display all documentation |
| `Browse by component` | View docs by component |
| `Create new document` | Add a new document |
| `Update a document` | Modify an existing document |
| `View document versions` | See document history |

### Document Status Guide

- 🟢 **Current**: Document is up-to-date
- 🟡 **Update Required**: Document needs updates due to recent changes
- 🔴 **Outdated**: Document is significantly out of date
- ⚪ **Draft**: Document is in draft state
- ❌ **Deprecated**: Document is no longer relevant

For detailed documentation management information, see [.docs/README.md](./.docs/README.md)

## Integration Features

- **Bi-directional Linking**: Tasks reference affected docs, and docs reference related tasks
- **Documentation Impact Assessment**: Tasks define their impact level on documentation
- **Version Management**: Documents use semantic versioning with history preservation
- **Automated Notifications**: Get notified when tasks affect documentation

## Command System

JustStuff includes a command system that allows extensible operations:

```typescript
// Example command implementation
export class CreateCommand implements Command {
  name = 'create';
  description = 'Creates a new resource';
  usage = '@create <n> [description]';
  aliases = ['c'];

  async execute(name: string, description?: string): Promise<any> {
    // Implementation
    return { success: true, message: `Created resource: ${name}` };
  }
}
```

For command system details, see [src/shared/commands/README.md](./src/shared/commands/README.md)

## Best Practices

### Task Management
- Keep task statuses current
- Document all blocking issues
- Update task dependencies promptly
- Set clear priorities and due dates

### Documentation Management
- Update documentation when implementing related tasks
- Follow version numbering conventions
- Use templates for consistency
- Reference related tasks in all technical documentation

## Reference Documentation

- **System Architecture**: [.docs/master/DOC-ALL-ARCH-001.md](./.docs/master/DOC-ALL-ARCH-001.md)
- **Task System Guide**: [.task/README.md](./.task/README.md)
- **Documentation System**: [.docs/README.md](./.docs/README.md)
- **Complete System Reference**: [README-Master.md](./README-Master.md)

---

**© JustStuff Team** - Version 1.0.0

## Support

For issues or questions:

1. Review system documentation in `.task/README.md` and `.docs/README.md`
2. Check for related tasks in the task management system
3. Contact the project maintainers

