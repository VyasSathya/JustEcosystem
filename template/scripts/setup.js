#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { DateTime } = require('luxon');

console.log('Running setup script for Task & Documentation Management System...');

// Get current date for template placeholders
const currentDate = DateTime.now().toFormat('yyyy-MM-dd');

// Create task directories if they don't exist
const taskDir = path.join(__dirname, '..', '.task');
const tasksDir = path.join(taskDir, 'tasks');
const taskViewsDir = path.join(taskDir, 'views');
const taskHistoryDir = path.join(taskDir, 'history');

// Create docs directories
const docsDir = path.join(__dirname, '..', '.docs');
const docsMasterDir = path.join(docsDir, 'master');
const docsCompADir = path.join(docsDir, 'component_a');
const docsCompBDir = path.join(docsDir, 'component_b');
const docsTemplatesDir = path.join(docsDir, 'templates');
const docsVersionsDir = path.join(docsDir, 'versions');

// Create all directories
const directories = [
	taskDir,
	tasksDir,
	taskViewsDir,
	taskHistoryDir,
	docsDir,
	docsMasterDir,
	docsCompADir,
	docsCompBDir,
	docsTemplatesDir,
	docsVersionsDir
];

directories.forEach(dir => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`Created directory: ${dir}`);
	}
});

// Create sample task file if it doesn't exist
const sampleTaskPath = path.join(tasksDir, 'TASK-001.md');
if (!fs.existsSync(sampleTaskPath)) {
	const sampleTaskContent = `---
	id: TASK-001
	title: Architecture Research
	status: ⚪ Not Started
	priority: High
	phase: 1
	mvp: true
	dependencies: []
	assignee: "{ASSIGNEE_NAME}"
	due_date: "{DUE_DATE}"
	last_updated: "${currentDate}"
	doc_impact: high
	affected_docs: ["DOC-ARCH-001", "DOC-IMPL-001"]
	---

## Description

	Conduct architectural research to determine the best approach for implementing the {PROJECT_NAME} system.

	## Required Resources

	- Reference implementations
	- Architecture documentation
	- Development environment

	## Success Criteria

	- Comprehensive understanding of required architecture
	- System design documented
	- Integration points identified

	## Progress Updates

	- **${currentDate}**: Task created and assigned
`;

	fs.writeFileSync(sampleTaskPath, sampleTaskContent);
	console.log('Created sample task file');
}

// Create sample architecture doc
const sampleDocPath = path.join(docsMasterDir, 'DOC-ARCH-001.md');
if (!fs.existsSync(sampleDocPath)) {
	const sampleDocContent = `---
	id: DOC-ARCH-001
	title: "{PROJECT_NAME} Architecture Overview"
	status: 🟢 Current
	version: 1.0.0
	last_updated: "${currentDate}"
	related_tasks: ["TASK-001", "TASK-002"]
	contributors: ["{CONTRIBUTOR_1}", "{CONTRIBUTOR_2}"]
	tags: ["architecture", "overview", "system"]
	---

	This document provides a high-level overview of the {PROJECT_NAME} architecture.

	## Components

	The system consists of several integrated components:

	1. **{COMPONENT_1}** - Main processing framework
	2. **{COMPONENT_2}** - Content management system
	3. **{COMPONENT_3}** - Resource management platform

	## Integration Points

	The components are integrated through standardized APIs and shared libraries:

	- Command System API
	- Data Exchange Format
	- Resource Access Protocol

	## Deployment Architecture

	The system can be deployed in various configurations:

	- Cloud-based (multi-tenant)
	- Self-hosted
	- Hybrid

	## Technology Stack

	- Frontend: {FRONTEND_TECH}
	- Backend: {BACKEND_TECH}
	- Data Storage: {DATABASE_TECH}
	`;

	fs.writeFileSync(sampleDocPath, sampleDocContent);
	console.log('Created sample architecture document');
}

// Create sample implementation doc
const sampleImplDocPath = path.join(docsCompADir, 'DOC-IMPL-001.md');
if (!fs.existsSync(sampleImplDocPath)) {
	const sampleImplDocContent = `---
	id: DOC-IMPL-001
	title: "{COMPONENT_1} Implementation Guide"
	status: ⚪ Draft
	version: 0.1.0
	last_updated: "${currentDate}"
	related_tasks: ["TASK-001"]
	contributors: ["{CONTRIBUTOR_1}"]
	tags: ["implementation", "component", "guide"]
	---

	# {COMPONENT_1} Implementation Guide

	This document describes the implementation details for the {COMPONENT_1} component.

	## Overview

	{COMPONENT_1} is responsible for the main processing functions of the {PROJECT_NAME} system.

	## Implementation Details

	### Architecture

	The component follows a layered architecture:

	- Presentation Layer - User interface elements
	- Business Logic Layer - Core processing functionality
	- Data Access Layer - Storage and retrieval mechanisms

	### Key Interfaces

	The component exposes the following interfaces:

	- \`ProcessManager\` - Controls processing workflow
	- \`DataHandler\` - Manages data transformation
	- \`SystemIntegration\` - Connects with external systems

	## Deployment

	Deployment considerations include:

	- Resource requirements
	- Scaling approach
	- Monitoring recommendations

	## Future Enhancements

	Planned enhancements include:

	- Performance optimization
	- Additional features
	- Integration improvements
	`;

	fs.writeFileSync(sampleImplDocPath, sampleImplDocContent);
	console.log('Created sample implementation document');
}

console.log('Setup completed successfully!');

// Run the markdown fixer to ensure all files comply with linting rules
console.log('\nFixing markdown linting issues...');
try {
	const { execSync } = require('child_process');
	execSync('node ' + path.join(__dirname, 'fix-markdown-lint.js'), { stdio: 'inherit' });
	console.log('Markdown fixing completed.');
} catch (err) {
	console.warn('Warning: Could not run markdown fixer:', err.message);
}
