<!--
Document Control System Metadata
doc_id: DOC-MASTER
version: 1.0.0
last_updated: {CURRENT_DATE}
updated_by: {AUTHOR}
depends_on: -
affects: DOC-README
change_requires: system modification
-->

# Task & Documentation Management System

## Introduction

This system provides integrated management of tasks and documentation for software development projects. It is designed to ensure documentation stays current with development progress through bi-directional linking between tasks and documentation.

## System Overview

The system consists of two main components:

1. **Task Management System**: A Markdown-based task tracking system with CLI tools
2. **Documentation Management System**: A structured documentation system with versioning and task correlation

These components work together through shared metadata and cross-references.

## Getting Started

### Installation

```
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install
```

### Initial Setup

The system automatically creates the necessary directory structure and sample files during installation. To customize for your project:

1. Edit the project name and other placeholders in `.docs/master/DOC-ARCH-001.md`
2. Update component names and details in task and documentation files
3. Configure your team members as potential assignees and contributors

### Basic Usage

Start using the task management system:

```
npm run task
```

Access the documentation management system:

```
npm run doc
```

## Task Management

The task management system uses a simple but powerful approach:

- Tasks are stored as Markdown files with YAML frontmatter
- CLI tools provide interactive management of tasks
- Tasks reference affected documentation
- Automatic impact assessment based on task changes

### Task Structure

```
---
id: TASK-001
title: Architecture Research
status: ⚪ Not Started
priority: High
phase: 1
mvp: true
dependencies: []
assignee: "{ASSIGNEE_NAME}"
due_date: "{DUE_DATE}"
last_updated: "{CURRENT_DATE}"
doc_impact: high
affected_docs: ["DOC-ARCH-001", "DOC-IMPL-001"]
---

## Description
...
```

### Task Status Workflow

1. **Not Started** (⚪): Task has been defined but work hasn't begun
2. **In Progress** (🟢): Work is actively ongoing
3. **Blocked** (🔴): Cannot proceed due to dependencies
4. **Partially Blocked** (🟡): Can start but needs additional resources
5. **Completed** (✅): Task is finished and verified

## Documentation Management

The documentation system is designed to keep technical documentation organized, current, and linked with development tasks:

- Documents are stored as Markdown files with YAML frontmatter
- Documents are organized by component/system area
- Versioning system tracks changes over time
- Documents reference related tasks
- Status indicators show document currency

### Document Structure

```
---
id: DOC-ARCH-001
title: "{PROJECT_NAME} Architecture Overview"
status: 🟢 Current
version: 1.0.0
last_updated: "{CURRENT_DATE}"
related_tasks: ["TASK-001", "TASK-002"]
contributors: ["{CONTRIBUTOR_1}", "{CONTRIBUTOR_2}"]
tags: ["architecture", "overview", "system"]
---

# {PROJECT_NAME} Architecture Overview
...
```

### Document Status Definitions

- **Current** (🟢): Document is up-to-date
- **Update Required** (🟡): Document needs updates due to recent changes
- **Outdated** (🔴): Document is significantly out of date
- **Draft** (⚪): Document is in draft state
- **Deprecated** (❌): Document is no longer relevant

## Integration Features

The power of the system comes from the integration between tasks and documentation:

- **Bi-directional Linking**: Tasks reference affected docs, and docs reference related tasks
- **Documentation Impact Assessment**: Tasks define their impact level on documentation
- **Version Management**: Documents use semantic versioning with history preservation
- **Automated Notifications**: Get notified when tasks affect documentation

## Customization

The system can be customized in several ways:

1. Edit the task and document templates in the `.docs/templates` directory
2. Modify the CLI scripts to add custom commands or workflows
3. Add additional metadata fields to tasks or documents as needed
4. Integrate with other systems using the scripts in the `scripts` directory

## Maintenance and Best Practices

### Task Management Best Practices

- Keep task statuses current
- Document all blocking issues
- Update task dependencies promptly
- Set clear priorities and due dates

### Documentation Best Practices

- Update documentation when completing related tasks
- Use proper versioning for significant changes
- Follow component/category organization
- Include relevant task IDs in documentation

### Workflow Integration

- Review documentation impact when planning tasks
- Update related documentation after task completion
- Create tasks for identified documentation gaps
- Regularly review documentation status

## Support

For questions, issues, or feature requests, please:

1. Review the system documentation in README files
2. Check for related tasks in the task management system
3. Contact the system maintainers

# {PROJECT_NAME} - Master Technical Documentation

> **IMPORTANT**: This document serves as the definitive technical reference for the {PROJECT_NAME} project. All technical documentation should be kept in sync with this document. In case of discrepancies, this document is considered the source of truth.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Components](#core-components)
- [Integration Points](#integration-points)
- [Data Flow](#data-flow)
- [Security](#security)
- [Performance](#performance)
- [Technical Decisions](#technical-decisions)
- [Development Guidelines](#development-guidelines)
- [AI Continuity Protocol](#ai-continuity-protocol)
- [Document Control System](#document-control-system)

## Overview

{Comprehensive overview of the project, its purpose, and its place in the JustCreate ecosystem}

## Architecture

{High-level architecture description with key components and their relationships}

### System Diagram

```text

[Include system architecture diagram here]
```text


## Core Components

### Component 1

{Detailed description of Component 1, its purpose, implementation details, and technical specifications}

### Component 2

{Detailed description of Component 2, its purpose, implementation details, and technical specifications}

## Integration Points

### Integration with JustCreate.cool

{Detailed description of how this project integrates with JustCreate.cool, including API endpoints, data exchange formats, and communication protocols}

### Integration with JustStuff.cool

{Detailed description of how this project integrates with JustStuff.cool, including API endpoints, data exchange formats, and communication protocols}

### Integration with JustEnglish.cool

{Detailed description of how this project integrates with JustEnglish.cool, including API endpoints, data exchange formats, and communication protocols}

## Data Flow

{Detailed description of how data flows through the system, including input sources, processing steps, storage mechanisms, and output destinations}

## Security

{Comprehensive security architecture, including authentication, authorization, data protection, and security best practices}

## Performance

{Performance expectations, optimization strategies, benchmarks, and monitoring approaches}

## Technical Decisions

{Record of key technical decisions, including alternatives considered, rationale for choices made, and implications}

## Development Guidelines

{Coding standards, development workflow, testing requirements, and other guidelines for contributors}

## AI Continuity Protocol

### Overview

The AI Continuity Protocol establishes standardized procedures for transferring project knowledge between AI assistants. This ensures continuity of service and maintains project momentum across AI transitions.

### Session Summary Format

Every AI session should conclude with a standardized summary that follows this format:

```text

## Session Summary for [Date]

### Completed Tasks

- [Task 1]: Brief description of what was accomplished
- [Task 2]: Brief description of what was accomplished


### Work in Progress

- [Task]: Current status, approach being taken, remaining steps


### Next Steps

- [Task]: Recommended priority for the next session
- [Task]: Additional planned work


### Key Decisions

- [Decision]: Rationale and implications
- [Decision]: Alternatives considered and why rejected


### Open Questions

- [Question]: Areas requiring clarification or user input
- [Question]: Unresolved technical challenges

```text


### Continuity Documentation Location

AI continuity documentation should be maintained in the following locations:

- `/docs/ai-continuity/session-summaries.md`: Chronological record of all session summaries
- `/docs/ai-continuity/project-status.md`: Current project status, updated after each session
- `/docs/ai-continuity/decision-log.md`: Record of key decisions and their rationale


### Codebase Navigation Guide

To facilitate efficient codebase operations, AI assistants should follow this structured approach when making changes:

#### 1. Search Strategy Decision Tree


- **Initial Assessment**

  - Is this a specific term or symbol search? → Use `grep_search`
  - Is this a semantic concept search? → Use `codebase_search`
  - Is this a file exploration task? → Use `list_dir`



- **File Discovery**

  - Looking for a specific file by partial name? → Use `file_search`
  - Looking for a file by content/purpose? → Use `codebase_search` with targeted directories
  - Exploring a directory? → Use `list_dir`



- **Code Structure Analysis**

  - Tracing references/imports? → Use `grep_search` with specific symbol names
  - Finding implementations? → Use `codebase_search` with "implementation of X" query
  - Understanding component relationships? → Build dependency graph from imports


#### 2. System-Wide Change Procedure

For changes that affect multiple files (e.g., renaming components, changing interfaces):


1. **Mapping Phase**

   - Map all affected files before making changes
   - Identify file categories: source files, CSS, tests, documentation
   - Document dependencies between files to establish change order



2. **Change Planning**

   - Define clear patterns for search/replace operations
   - Plan changes from most specific to most general
   - Establish fallback patterns for non-standard references



3. **Execution Order**

   - Core definitions first (e.g., type definitions, interfaces)
   - Component implementations second
   - Imports and references third
   - Documentation last



4. **Verification**

   - Use `grep_search` with the old term to verify complete replacement
   - Check for linter errors or broken imports
   - Verify CSS class changes match component changes


#### 3. Documentation Update Standard

When updating documentation:


1. Follow Document Control System protocols
2. Update code examples to match new implementations
3. Update diagrams if component relationships change
4. Ensure all feature descriptions accurately reflect current implementation


#### 4. Context Retention

When working on complex tasks:


1. Maintain a working document of discovered information using `/docs/ai-continuity/change-tracking-template.md`
2. Map file relationships using simple ASCII diagrams
3. Document search patterns tried and their results
4. Note files changed and potential ripple effects
5. Transfer key information to the session summary for the next AI


### Project Status Briefing

New AI assistants should be onboarded with a standardized project status briefing that includes:


1. **Project Overview**: High-level summary of goals and current status
2. **Technical Architecture**: Key components and their relationships
3. **Current Priorities**: Active work streams and their importance
4. **Recent Developments**: Changes in the past 1-3 sessions
5. **Known Challenges**: Outstanding problems and attempted solutions
6. **Style Guidelines**: Project-specific coding standards and conventions


### Implementation Process


1. At the beginning of each session, the user should share the latest session summary
2. The AI should acknowledge receipt and ask clarifying questions
3. Throughout the session, the AI should maintain context of decisions and progress
4. At session conclusion, the AI should generate a new summary following the standard format


### Integration with Document Control System

The AI Continuity Protocol works in conjunction with the Document Control System:

- Session summaries reference document IDs when changes are made
- Document updates triggered by AI sessions are logged in both systems
- Version increments follow DCS versioning standards


## Document Control System

### Document Registry

The Document Control System (DCS) establishes a single source of truth for all documentation with clear relationships between documents. Any changes to documentation must follow the propagation protocols defined here.

| Document ID | Path | Version | Last Updated | Depends On | Affects | Change Requires |
|-------------|------|---------|--------------|------------|---------|----------------|
| DOC-MASTER | README-Master.md | 1.0.0 | {DATE} | - | ALL | - |
| DOC-README | README.md | 1.0.0 | {DATE} | DOC-MASTER | - | - |
| DOC-DEV | README-Developer.md | 1.0.0 | {DATE} | DOC-MASTER | - | - |
| DOC-USER | README-User.md | 1.0.0 | {DATE} | DOC-MASTER | - | - |

### Document Metadata Format

All documentation files should include the following metadata header:

```text
markdown
---
doc_id: DOC-ID
version: 1.0.0
last_updated: YYYY-MM-DD
updated_by: AUTHOR
depends_on: [DOC-ID-1, DOC-ID-2]
affects: [DOC-ID-3, DOC-ID-4]
change_requires: [CODE-PATH, CONFIG-PATH]
---
```text


### Change Propagation Protocol

When updating documentation, follow these steps:


1. **Identify the Document Scope**:

   - Determine which document needs updating and check its metadata
   - Review `depends_on` to ensure changes are aligned with dependencies
   - Check `affects` to identify which downstream documents need updating



2. **Update Process**:

   - Make changes to the primary document
   - Update its metadata (version, last_updated, updated_by)
   - Check affected code paths in `change_requires`
   - Run `scripts/update_docs.py --check` to verify consistency



3. **Propagation**:

   - Update all documents listed in `affects`
   - For each affected document, repeat steps 1-2
   - Run `scripts/update_docs.py --validate` to ensure all propagations are complete



4. **Verification**:

   - Run `scripts/update_docs.py --verify` for comprehensive validation
   - The tool will provide a detailed report of document state
   - Resolve any conflicts or inconsistencies

