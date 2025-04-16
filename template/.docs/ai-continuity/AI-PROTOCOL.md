---
id: DOC-AI-PROTOCOL-001
title: "AI Continuity Protocol for JustStuff Development"
status: 🟢 Current
version: 1.0.0
last_updated: "{CURRENT_DATE}"
contributors: ["{CONTRIBUTOR_1}"]
tags: ["ai", "protocol", "continuity", "handoff"]
---

# AI Continuity Protocol

This document establishes standardized procedures for transferring project knowledge between AI assistants. It ensures continuity of service and maintains project momentum across AI transitions for the JustStuff project.

## 1. Knowledge Transfer and Session Summaries

### 1.1 Session Summary Format

Every AI interaction should conclude with a standardized summary following this format:

```markdown
## Session Summary for {DATE}

### Completed Tasks
- [Task ID]: Brief description of what was accomplished
- [Task ID]: Brief description of what was accomplished

### Work in Progress
- [Task ID]: Current status, approach being taken, remaining steps

### Next Steps
- [Task ID]: Recommended priority for the next session
- [Task ID]: Additional planned work

### Key Decisions
- [Decision]: Rationale and implications
- [Decision]: Alternatives considered and why rejected

### Open Questions
- [Question]: Areas requiring clarification or user input
- [Question]: Unresolved technical challenges
```

### 1.2 Continuity Documentation Location

AI continuity documentation is maintained in these standard locations:

- `/.docs/ai-continuity/session-summaries.md`: Chronological record of all session summaries
- `/.docs/ai-continuity/project-status.md`: Current project status, updated after each session
- `/.docs/ai-continuity/decision-log.md`: Record of key decisions and their rationale

## 2. Project Onboarding for New AIs

### 2.1 Standard Onboarding Sequence

When a new AI assistant joins the project:

1. **Read core documentation**:
   - `README.md` at the root for project overview
   - `/.docs/master/DOC-ARCH-001.md` for architecture
   - `/.docs/ai-continuity/project-status.md` for current status

2. **Review recent work**:
   - Latest three session summaries
   - Most recent decisions in the decision log
   - Current open tasks

3. **Confirm understanding**:
   - Provide a brief summary of project understanding
   - Identify any knowledge gaps that need clarification

### 2.2 Project Status Briefing

New AI assistants should receive a standardized project status briefing:

1. **Project Overview**: High-level summary of goals and current status
2. **Technical Architecture**: Key components and their relationships
3. **Current Priorities**: Active work streams and their importance
4. **Recent Developments**: Changes in the past 1-3 sessions
5. **Known Challenges**: Outstanding problems and attempted solutions
6. **Style Guidelines**: Project-specific coding standards and conventions

## 3. Coding Standards and Practices

### 3.1 Code Style Guidelines

All code must follow these standards:

- **JavaScript/TypeScript**:
  - Use ES6+ syntax with TypeScript for type safety
  - Follow Airbnb style guide with custom rules defined in `.eslintrc`
  - Use camelCase for variables/functions, PascalCase for classes/components
  - Maximum line length: 100 characters

- **CSS/Styling**:
  - Use Tailwind CSS for styling with custom extensions
  - Follow BEM methodology for custom CSS when needed
  - Maintain responsive design principles (mobile-first)

- **Documentation**:
  - JSDoc for all functions and classes
  - Component documentation following the template in `/.docs/templates/COMPONENT.md`

### 3.2 Project Structure

The project follows this structure:

```
src/
├── components/        # UI components
│   ├── feed/          # Feed-related components
│   ├── profile/       # Profile components
│   ├── common/        # Common UI elements
│   └── navigation/    # Navigation components
├── hooks/             # Custom React hooks
├── services/          # API and service integrations
├── utils/             # Utility functions
├── contexts/          # React contexts
├── types/             # TypeScript type definitions
└── assets/            # Static assets
```

### 3.3 Component Architecture

All components should follow:

- Functional components with hooks
- Props defined as interfaces
- Default exports for main components
- Use of React.memo for optimization when appropriate
- Clear separation of UI and business logic

## 4. Codebase Navigation Guide

### 4.1 Search Strategy Decision Tree

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

### 4.2 System-Wide Change Procedure

For changes that affect multiple files:

1. **Mapping Phase**
   - Map all affected files before making changes
   - Identify file categories: components, services, types, tests
   - Document dependencies between files to establish change order

2. **Change Planning**
   - Define clear patterns for search/replace operations
   - Plan changes from most specific to most general
   - Establish fallback patterns for non-standard references

3. **Execution Order**
   - Type definitions first
   - Services and utilities second
   - Component implementations third
   - Tests last

4. **Verification**
   - Use `grep_search` with the old term to verify complete replacement
   - Check for TypeScript/linter errors
   - Run tests to verify functionality

## 5. Implementation Process

1. At the beginning of each session, review the latest session summary
2. Throughout the session, maintain context of decisions and progress
3. Document any new technical decisions in the decision log
4. At session conclusion, generate a new summary following the standard format

## 6. Documentation Update Standard

When updating documentation:

1. Follow Document Control System protocols 
2. Update version numbers and last_updated dates
3. Update code examples to match new implementations
4. Ensure all feature descriptions accurately reflect current implementation

## 7. Specific JustStuff Guidelines

### 7.1 UI Component Documentation

All UI components must be documented with:

- Component purpose and usage
- Props interface with descriptions
- Screenshots or mockups showing the component
- State management approach
- Interaction behaviors

### 7.2 Feed Post Card Implementation

Feed Post Cards should follow these guidelines:

- Use composition pattern with base and specialized card components
- Support all media types (images, code, audio, video)
- Implement responsive design for all screen sizes
- Follow accessibility guidelines (WCAG 2.1 AA)

### 7.3 API Integration Standards

When working with APIs:

- Use standard service pattern with hooks for data fetching
- Implement proper error handling and loading states
- Cache responses appropriately using SWR or React Query
- Type all API responses and requests

## 8. Task Types and Templates

The project uses these standard task types:

- **Feature (FEAT)**: New functionality implementation
- **Bug (BUG)**: Bug fix implementation
- **UI (UI)**: UI component implementation
- **API (API)**: API integration work
- **Refactor (REF)**: Code improvement without functional change
- **Doc (DOC)**: Documentation updates
- **Test (TEST)**: Test implementation

Tasks should be created using the templates in `/.task/templates/`. 