#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const Table = require('cli-table3');
const { DateTime } = require('luxon');
const fuzzy = require('fuzzy');

// Helper for opening URLs or files (using dynamic import)
async function openUrl(url) {
	const open = await import('open');
	return open.default(url);
}

// Path configuration
const DOCS_DIR = path.join(process.cwd(), '.docs');
const MASTER_DIR = path.join(DOCS_DIR, 'master');
const VERSIONS_DIR = path.join(DOCS_DIR, 'versions');
const TEMPLATES_DIR = path.join(DOCS_DIR, 'templates');
const COMPONENT_DIRS = {
	'justthink_justcreate': path.join(DOCS_DIR, 'justthink_justcreate'),
	'juststuff': path.join(DOCS_DIR, 'juststuff')
};

// Status definitions with colors
const STATUS = {
	'🟢 Current': chalk.green('🟢 Current'),
	'🟡 Update Required': chalk.yellow('🟡 Update Required'),
	'🔴 Outdated': chalk.red('🔴 Outdated'),
	'⚪ Draft': chalk.white('⚪ Draft'),
	'❌ Deprecated': chalk.gray('❌ Deprecated')
};

// Helper to ensure directories exist
async function ensureDirectories() {
	// Create main directories
	for (const dir of [DOCS_DIR, MASTER_DIR, VERSIONS_DIR, TEMPLATES_DIR]) {
		try {
			await fs.mkdir(dir, { recursive: true });
		} catch (err) {
			console.error(`Error creating directory ${dir}:`, err);
		}
	}

	// Create component directories
	for (const dir of Object.values(COMPONENT_DIRS)) {
		try {
			await fs.mkdir(dir, { recursive: true });
		} catch (err) {
			console.error(`Error creating directory ${dir}:`, err);
		}
	}
}

// Helper to load all documents
async function loadAllDocs() {
	const docs = [];

	// Helper function to load docs from a directory
	async function loadDocsFromDir(dir, component = null) {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);

				if (entry.isDirectory()) {
					// Skip versions directory
					if (entry.name !== 'versions') {
						await loadDocsFromDir(fullPath, component || entry.name);
					}
				} else if (entry.name.endsWith('.md')) {
					const content = await fs.readFile(fullPath, 'utf8');
					try {
						const doc = parseDocFile(content);
						if (doc) {
							doc.path = fullPath;
							doc.filename = entry.name;
							doc.component = component;
							docs.push(doc);
						}
					} catch (err) {
						console.error(`Error parsing doc ${fullPath}:`, err);
					}
				}
			}
		} catch (err) {
			// Directory might not exist yet
			if (err.code !== 'ENOENT') {
				console.error(`Error reading directory ${dir}:`, err);
			}
		}
	}

	// Load from master directory
	await loadDocsFromDir(MASTER_DIR, 'master');

	// Load from component directories
	for (const [component, dir] of Object.entries(COMPONENT_DIRS)) {
		await loadDocsFromDir(dir, component);
	}

	return docs;
}

// Helper to parse a doc file
function parseDocFile(content) {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return null;
	}

	try {
		const metadata = yaml.load(match[1]);
		const body = match[2].trim();

		return {
			...metadata,
			content: body
		};
	} catch (err) {
		console.error('Error parsing frontmatter:', err);
		return null;
	}
}

// Helper to save a document
async function saveDoc(doc) {
	const { content, path: docPath, filename, component, ...metadata } = doc;

	const docContent = `---
${yaml.dump(metadata)}---

${content}
`;

	// Determine where to save the file
	let savePath;
	if (docPath) {
		savePath = docPath;
	} else if (component === 'master') {
		savePath = path.join(MASTER_DIR, filename || `${doc.id}.md`);
	} else if (COMPONENT_DIRS[component]) {
		savePath = path.join(COMPONENT_DIRS[component], filename || `${doc.id}.md`);
	} else {
		throw new Error(`Unknown component: ${component}`);
	}

	// Ensure parent directory exists
	const parentDir = path.dirname(savePath);
	await fs.mkdir(parentDir, { recursive: true });

	// Save the document
	await fs.writeFile(savePath, docContent);

	// If this is not a version, save a version copy
	if (!docPath || !docPath.includes(VERSIONS_DIR)) {
		const versionPath = path.join(
			VERSIONS_DIR,
			`${doc.id}_v${doc.version}_${DateTime.now().toFormat('yyyyMMddHHmmss')}.md`
		);
		await fs.writeFile(versionPath, docContent);
	}

	return savePath;
}

// Main menu
async function mainMenu() {
	console.log(
		boxen(chalk.bold.green('Just.cool Documentation Management'), {
			padding: 1,
			margin: 1,
			borderStyle: 'round'
		})
	);

	const mainChoices = [
		{ name: 'View all documentation', value: 'viewAll' },
		{ name: 'Browse by component', value: 'browseComponent' },
		{ name: 'View documentation needing updates', value: 'viewNeedsUpdate' },
		{ name: 'View recently changed documentation', value: 'viewRecent' },
		{ name: 'Search documentation', value: 'search' },
		new inquirer.Separator(),
		{ name: 'Create new document', value: 'create' },
		{ name: 'Update a document', value: 'update' },
		new inquirer.Separator(),
		{ name: 'View document versions', value: 'versions' },
		{ name: 'View related tasks', value: 'tasks' },
		{ name: 'Generate documentation report', value: 'report' },
		new inquirer.Separator(),
		{ name: 'Exit', value: 'exit' }
	];

	const { action } = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: mainChoices,
			pageSize: 15
		}
	]);

	// Handle different actions
	switch (action) {
		case 'viewAll':
			await viewAllDocs();
			break;
		case 'browseComponent':
			await browseByComponent();
			break;
		case 'viewNeedsUpdate':
			await viewDocsNeedingUpdates();
			break;
		case 'viewRecent':
			await viewRecentDocs();
			break;
		case 'search':
			await searchDocs();
			break;
		case 'create':
			await createDoc();
			break;
		case 'update':
			await updateDoc();
			break;
		case 'versions':
			await viewDocVersions();
			break;
		case 'tasks':
			await viewRelatedTasks();
			break;
		case 'report':
			await generateReport();
			break;
		case 'exit':
			console.log(chalk.green('Goodbye!'));
			process.exit(0);
		default:
			console.log(chalk.yellow('Function not implemented yet'));
			await mainMenu();
	}
}

// Function to display all docs
async function viewAllDocs() {
	const docs = await loadAllDocs();

	if (docs.length === 0) {
		console.log(chalk.yellow('No documents found'));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Version'),
			chalk.bold('Component')
		],
		colWidths: [20, 30, 20, 10, 20]
	});

	docs.forEach(doc => {
		const status = STATUS[doc.status] || doc.status;
		table.push([
			doc.id,
			doc.title,
			status,
			doc.version || '-',
			doc.component || '-'
		]);
	});

	console.log(table.toString());

	await docListActions(docs);
}

// Function to browse by component
async function browseByComponent() {
	const componentChoices = [
		{ name: 'Master (System-wide)', value: 'master' },
		{ name: 'JustThink/JustCreate', value: 'justthink_justcreate' },
		{ name: 'JustStuff', value: 'juststuff' }
	];

	const { selectedComponent } = await inquirer.prompt([
		{
			type: 'list',
			name: 'selectedComponent',
			message: 'Select component:',
			choices: componentChoices
		}
	]);

	const docs = await loadAllDocs();
	const filteredDocs = docs.filter(doc => doc.component === selectedComponent);

	if (filteredDocs.length === 0) {
		console.log(chalk.yellow(`No documents found for component: ${selectedComponent}`));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Version'),
			chalk.bold('Category')
		],
		colWidths: [20, 30, 20, 10, 20]
	});

	filteredDocs.forEach(doc => {
		const status = STATUS[doc.status] || doc.status;
		const category = doc.id.split('-')[2] || '-';

		table.push([
			doc.id,
			doc.title,
			status,
			doc.version || '-',
			category
		]);
	});

	console.log(chalk.bold(`Documents for component: ${selectedComponent}`));
	console.log(table.toString());

	await docListActions(filteredDocs);
}

// Function to view docs needing updates
async function viewDocsNeedingUpdates() {
	const docs = await loadAllDocs();
	const needsUpdateDocs = docs.filter(doc =>
		doc.status === '🟡 Update Required' || doc.status === '🔴 Outdated'
	);

	if (needsUpdateDocs.length === 0) {
		console.log(chalk.yellow('No documents needing updates found'));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Version'),
			chalk.bold('Component'),
			chalk.bold('Related Tasks')
		],
		colWidths: [20, 25, 20, 10, 15, 15]
	});

	needsUpdateDocs.forEach(doc => {
		const status = STATUS[doc.status] || doc.status;
		table.push([
			doc.id,
			doc.title,
			status,
			doc.version || '-',
			doc.component || '-',
			doc.related_tasks?.join(', ') || '-'
		]);
	});

	console.log(chalk.bold.yellow('Documents Needing Updates:'));
	console.log(table.toString());

	await docListActions(needsUpdateDocs);
}

// Function to view recently changed docs
async function viewRecentDocs() {
	try {
		const docs = await loadAllDocs();

		if (docs.length === 0) {
			console.log(chalk.yellow('No documents found'));
			await promptContinue();
			return;
		}

		// Try to sort by last_updated
		docs.sort((a, b) => {
			if (!a.last_updated && !b.last_updated) return 0;
			if (!a.last_updated) return 1;
			if (!b.last_updated) return -1;

			return new Date(b.last_updated) - new Date(a.last_updated);
		});

		// Take the 10 most recent
		const recentDocs = docs.slice(0, 10);

		const table = new Table({
			head: [
				chalk.bold('ID'),
				chalk.bold('Title'),
				chalk.bold('Status'),
				chalk.bold('Last Updated'),
				chalk.bold('Component')
			],
			colWidths: [20, 30, 20, 20, 15]
		});

		recentDocs.forEach(doc => {
			const status = STATUS[doc.status] || doc.status;
			const lastUpdated = doc.last_updated ?
				DateTime.fromISO(doc.last_updated).toFormat('yyyy-MM-dd') :
				chalk.dim('Unknown');

			table.push([
				doc.id,
				doc.title,
				status,
				lastUpdated,
				doc.component || '-'
			]);
		});

		console.log(chalk.bold.blue('Recently Updated Documents:'));
		console.log(table.toString());

		await docListActions(recentDocs);
	} catch (err) {
		console.error('Error loading recent docs:', err);
		await promptContinue();
	}
}

// Function to search docs
async function searchDocs() {
	const docs = await loadAllDocs();

	if (docs.length === 0) {
		console.log(chalk.yellow('No documents found'));
		await promptContinue();
		return;
	}

	const { searchTerm } = await inquirer.prompt([
		{
			type: 'input',
			name: 'searchTerm',
			message: 'Enter search term:',
			validate: input => input.trim() !== '' ? true : 'Please enter a search term'
		}
	]);

	const filteredDocs = docs.filter(doc => {
		const searchFields = [
			doc.id,
			doc.title,
			doc.content,
			doc.tags?.join(' '),
			doc.related_tasks?.join(' ')
		].filter(Boolean).join(' ').toLowerCase();

		return searchFields.includes(searchTerm.toLowerCase());
	});

	if (filteredDocs.length === 0) {
		console.log(chalk.yellow(`No documents found matching: "${searchTerm}"`));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Component')
		],
		colWidths: [20, 35, 20, 15]
	});

	filteredDocs.forEach(doc => {
		const status = STATUS[doc.status] || doc.status;
		table.push([
			doc.id,
			doc.title,
			status,
			doc.component || '-'
		]);
	});

	console.log(chalk.bold.cyan(`Search Results for: "${searchTerm}"`));
	console.log(table.toString());

	await docListActions(filteredDocs);
}

// Function to create a new document
async function createDoc() {
	// First, determine the document component
	const componentChoices = [
		{ name: 'Master (System-wide)', value: 'master' },
		{ name: 'JustThink/JustCreate', value: 'justthink_justcreate' },
		{ name: 'JustStuff', value: 'juststuff' }
	];

	const { component } = await inquirer.prompt([
		{
			type: 'list',
			name: 'component',
			message: 'Select component:',
			choices: componentChoices
		}
	]);

	// Determine document type/category
	const categoryChoices = [
		{ name: 'Architecture (ARCH)', value: 'ARCH' },
		{ name: 'Language (LANG)', value: 'LANG' },
		{ name: 'API Documentation (API)', value: 'API' },
		{ name: 'User Interface (UI)', value: 'UI' },
		{ name: 'Development (DEV)', value: 'DEV' },
		{ name: 'Other', value: 'OTHER' }
	];

	const { category } = await inquirer.prompt([
		{
			type: 'list',
			name: 'category',
			message: 'Select document category:',
			choices: categoryChoices
		}
	]);

	// Determine next document number
	const docs = await loadAllDocs();

	// Filter docs by component and category
	const componentPrefix = component === 'master' ? 'ALL' :
		component === 'justthink_justcreate' ? 'JTC' : 'JST';

	const similarDocs = docs.filter(doc =>
		doc.id.startsWith(`DOC-${componentPrefix}-${category}`)
	);

	let nextNum = 1;
	if (similarDocs.length > 0) {
		// Extract numbers and find max
		const numbers = similarDocs.map(doc => {
			const match = doc.id.match(/DOC-[A-Z]+-[A-Z]+-(\d+)/);
			return match ? parseInt(match[1]) : 0;
		});

		nextNum = Math.max(0, ...numbers) + 1;
	}

	const suggestedId = `DOC-${componentPrefix}-${category}-${String(nextNum).padStart(3, '0')}`;

	// Get document details
	const { id, title, status, version, tags } = await inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Document ID:',
			default: suggestedId,
			validate: input => {
				if (input.trim() === '') return 'ID cannot be empty';
				if (docs.some(doc => doc.id === input)) return 'ID already exists';
				return true;
			}
		},
		{
			type: 'input',
			name: 'title',
			message: 'Document title:',
			validate: input => input.trim() !== '' ? true : 'Title cannot be empty'
		},
		{
			type: 'list',
			name: 'status',
			message: 'Initial status:',
			choices: Object.keys(STATUS),
			default: '⚪ Draft'
		},
		{
			type: 'input',
			name: 'version',
			message: 'Version (semantic):',
			default: '0.1.0',
			validate: input => {
				// Simple semver validation
				return /^\d+\.\d+\.\d+$/.test(input) ? true : 'Version must be in format x.y.z';
			}
		},
		{
			type: 'input',
			name: 'tags',
			message: 'Tags (comma-separated):',
		}
	]);

	// Get related tasks
	let related_tasks = [];
	const { hasTasks } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'hasTasks',
			message: 'Are there related tasks?',
			default: false
		}
	]);

	if (hasTasks) {
		const { tasksInput } = await inquirer.prompt([
			{
				type: 'input',
				name: 'tasksInput',
				message: 'Enter related task IDs (comma-separated):',
			}
		]);

		related_tasks = tasksInput.split(',')
			.map(id => id.trim())
			.filter(id => id !== '');
	}

	// Get contributors
	const { contributors } = await inquirer.prompt([
		{
			type: 'input',
			name: 'contributors',
			message: 'Contributors (comma-separated):',
		}
	]);

	const contributorsList = contributors.split(',')
		.map(name => name.trim())
		.filter(name => name !== '');

	console.log(chalk.yellow('Enter document content (close editor to save):'));

	// Use temporary file for content
	const tempFile = path.join(process.cwd(), `.doc_temp_${Date.now()}.md`);

	// Get template content if available
	let templateContent = '';
	try {
		const templatePath = path.join(TEMPLATES_DIR, `${category.toLowerCase()}_template.md`);
		templateContent = await fs.readFile(templatePath, 'utf8');
	} catch (err) {
		// No template found, use default
		templateContent = `# ${title}\n\n## Overview\n\n[Add overview here]\n\n## Details\n\n[Add details here]\n\n## References\n\n- [Add references here]\n`;
	}

	await fs.writeFile(tempFile, templateContent);

	let content = '';

	try {
		// Use child_process.spawn to open editor
		const { spawn } = require('child_process');
		const editor = process.env.EDITOR || 'nano';

		await new Promise((resolve) => {
			const child = spawn(editor, [tempFile], {
				stdio: 'inherit'
			});

			child.on('exit', resolve);
		});

		// Read content
		content = await fs.readFile(tempFile, 'utf8');

		// Clean up
		await fs.unlink(tempFile);
	} catch (err) {
		console.error('Error using editor:', err);
		await fs.unlink(tempFile).catch(() => { });
	}

	// Create and save the document
	const doc = {
		id,
		title,
		status,
		version,
		tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
		related_tasks: related_tasks.length > 0 ? related_tasks : undefined,
		contributors: contributorsList.length > 0 ? contributorsList : undefined,
		last_updated: DateTime.now().toISODate(),
		component,
		content,
		filename: `${id}.md`
	};

	const savedPath = await saveDoc(doc);
	console.log(chalk.green(`Document ${id} created successfully at ${savedPath}`));

	await promptContinue();
}

// Function to update a document
async function updateDoc() {
	const docs = await loadAllDocs();

	if (docs.length === 0) {
		console.log(chalk.yellow('No documents found'));
		await promptContinue();
		return;
	}

	// Use fuzzy search for document selection
	const docChoices = docs.map(doc => ({
		name: `${doc.id}: ${doc.title}`,
		value: doc.id
	}));

	const { docId } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'docId',
			message: 'Select a document to update:',
			source: (answersSoFar, input = '') => {
				return new Promise(resolve => {
					const fuzzyResult = fuzzy.filter(input, docChoices, {
						extract: el => el.name
					});
					resolve(fuzzyResult.map(result => result.original));
				});
			}
		}
	]);

	const doc = docs.find(d => d.id === docId);

	if (!doc) {
		console.log(chalk.red(`Document ${docId} not found`));
		await promptContinue();
		return;
	}

	// Display current document details
	console.log(boxen(
		chalk.bold(`Document ${doc.id}: ${doc.title}`) + '\n\n' +
		`Status: ${STATUS[doc.status] || doc.status}\n` +
		`Version: ${doc.version || 'Not set'}\n` +
		`Component: ${doc.component || 'Not set'}\n` +
		`Tags: ${doc.tags?.join(', ') || 'None'}\n` +
		`Related Tasks: ${doc.related_tasks?.join(', ') || 'None'}\n` +
		`Contributors: ${doc.contributors?.join(', ') || 'None'}\n` +
		`Last Updated: ${doc.last_updated || 'Unknown'}`,
		{ padding: 1, borderColor: 'green' }
	));

	// Ask what to update
	const updateChoices = [
		{ name: 'Status', value: 'status' },
		{ name: 'Version', value: 'version' },
		{ name: 'Tags', value: 'tags' },
		{ name: 'Related Tasks', value: 'related_tasks' },
		{ name: 'Contributors', value: 'contributors' },
		{ name: 'Content', value: 'content' },
		{ name: 'Cancel', value: 'cancel' }
	];

	const { updateField } = await inquirer.prompt([
		{
			type: 'list',
			name: 'updateField',
			message: 'What would you like to update?',
			choices: updateChoices
		}
	]);

	if (updateField === 'cancel') {
		await mainMenu();
		return;
	}

	// Handle different field updates
	switch (updateField) {
		case 'status': {
			const { newStatus } = await inquirer.prompt([
				{
					type: 'list',
					name: 'newStatus',
					message: 'Select new status:',
					choices: Object.keys(STATUS),
					default: doc.status
				}
			]);
			doc.status = newStatus;
			break;
		}

		case 'version': {
			// Determine version bump type for semantic versioning
			const currentVersion = doc.version || '0.1.0';
			const [major, minor, patch] = currentVersion.split('.').map(v => parseInt(v));

			const { bumpType } = await inquirer.prompt([
				{
					type: 'list',
					name: 'bumpType',
					message: 'Select version bump type:',
					choices: [
						{ name: `Major (${major + 1}.0.0) - Breaking changes`, value: 'major' },
						{ name: `Minor (${major}.${minor + 1}.0) - New features, non-breaking`, value: 'minor' },
						{ name: `Patch (${major}.${minor}.${patch + 1}) - Bug fixes, clarifications`, value: 'patch' },
						{ name: 'Custom version', value: 'custom' }
					]
				}
			]);

			let newVersion;

			if (bumpType === 'major') {
				newVersion = `${major + 1}.0.0`;
			} else if (bumpType === 'minor') {
				newVersion = `${major}.${minor + 1}.0`;
			} else if (bumpType === 'patch') {
				newVersion = `${major}.${minor}.${patch + 1}`;
			} else {
				// Custom version
				const { customVersion } = await inquirer.prompt([
					{
						type: 'input',
						name: 'customVersion',
						message: 'Enter custom version:',
						default: currentVersion,
						validate: input => {
							return /^\d+\.\d+\.\d+$/.test(input) ? true : 'Version must be in format x.y.z';
						}
					}
				]);

				newVersion = customVersion;
			}

			doc.version = newVersion;
			break;
		}

		case 'tags': {
			const currentTags = doc.tags?.join(', ') || '';

			const { newTags } = await inquirer.prompt([
				{
					type: 'input',
					name: 'newTags',
					message: 'Enter tags (comma-separated):',
					default: currentTags
				}
			]);

			doc.tags = newTags.split(',')
				.map(tag => tag.trim())
				.filter(tag => tag !== '');

			break;
		}

		case 'related_tasks': {
			const currentTasks = doc.related_tasks?.join(', ') || '';

			const { newTasks } = await inquirer.prompt([
				{
					type: 'input',
					name: 'newTasks',
					message: 'Enter related task IDs (comma-separated):',
					default: currentTasks
				}
			]);

			doc.related_tasks = newTasks.split(',')
				.map(id => id.trim())
				.filter(id => id !== '');

			if (doc.related_tasks.length === 0) {
				doc.related_tasks = undefined;
			}

			break;
		}

		case 'contributors': {
			const currentContributors = doc.contributors?.join(', ') || '';

			const { newContributors } = await inquirer.prompt([
				{
					type: 'input',
					name: 'newContributors',
					message: 'Enter contributors (comma-separated):',
					default: currentContributors
				}
			]);

			doc.contributors = newContributors.split(',')
				.map(name => name.trim())
				.filter(name => name !== '');

			if (doc.contributors.length === 0) {
				doc.contributors = undefined;
			}

			break;
		}

		case 'content': {
			// Launch editor with current content
			console.log(chalk.yellow('Opening editor... (close editor to continue)'));

			const tempFile = path.join(process.cwd(), `.doc_temp_${Date.now()}.md`);
			await fs.writeFile(tempFile, doc.content || '');

			try {
				// Use child_process.spawn to open editor
				const { spawn } = require('child_process');
				const editor = process.env.EDITOR || 'nano';

				await new Promise((resolve) => {
					const child = spawn(editor, [tempFile], {
						stdio: 'inherit'
					});

					child.on('exit', resolve);
				});

				// Read updated content
				const updatedContent = await fs.readFile(tempFile, 'utf8');
				doc.content = updatedContent;

				// Clean up
				await fs.unlink(tempFile);
			} catch (err) {
				console.error('Error using editor:', err);
				await fs.unlink(tempFile).catch(() => { });
			}
			break;
		}
	}

	// Update last_updated timestamp
	doc.last_updated = DateTime.now().toISODate();

	// Save the updated document
	const savedPath = await saveDoc(doc);
	console.log(chalk.green(`Document ${doc.id} updated successfully at ${savedPath}`));

	await promptContinue();
}

// Function to view document versions
async function viewDocVersions() {
	const docs = await loadAllDocs();

	if (docs.length === 0) {
		console.log(chalk.yellow('No documents found'));
		await promptContinue();
		return;
	}

	// Use fuzzy search for document selection
	const docChoices = docs.map(doc => ({
		name: `${doc.id}: ${doc.title}`,
		value: doc.id
	}));

	const { docId } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'docId',
			message: 'Select a document to view versions:',
			source: (answersSoFar, input = '') => {
				return new Promise(resolve => {
					const fuzzyResult = fuzzy.filter(input, docChoices, {
						extract: el => el.name
					});
					resolve(fuzzyResult.map(result => result.original));
				});
			}
		}
	]);

	// Find versions in the versions directory
	try {
		const files = await fs.readdir(VERSIONS_DIR);
		const versionFiles = files.filter(file =>
			file.startsWith(`${docId}_v`) && file.endsWith('.md')
		);

		if (versionFiles.length === 0) {
			console.log(chalk.yellow(`No versions found for document ${docId}`));
			await promptContinue();
			return;
		}

		// Sort by version and timestamp (newest first)
		versionFiles.sort().reverse();

		// Parse version information
		const versions = await Promise.all(
			versionFiles.map(async file => {
				const match = file.match(/_v(\d+\.\d+\.\d+)_(\d+)\.md$/);
				if (!match) return null;

				const [_, version, timestamp] = match;
				const dateTime = DateTime.fromFormat(timestamp, 'yyyyMMddHHmmss');

				// Get contributors from file
				const content = await fs.readFile(path.join(VERSIONS_DIR, file), 'utf8');
				const doc = parseDocFile(content);
				const contributors = doc?.contributors?.join(', ') || 'Unknown';

				return {
					file,
					version,
					timestamp: dateTime.toFormat('yyyy-MM-dd HH:mm:ss'),
					contributors
				};
			})
		);

		// Filter out nulls
		const validVersions = versions.filter(Boolean);

		const table = new Table({
			head: [
				chalk.bold('Version'),
				chalk.bold('Date'),
				chalk.bold('Contributors')
			],
			colWidths: [15, 25, 40]
		});

		validVersions.forEach(v => {
			table.push([
				v.version,
				v.timestamp,
				v.contributors
			]);
		});

		console.log(chalk.bold.blue(`Version History for ${docId}:`));
		console.log(table.toString());

		// Offer to view a specific version
		const { action } = await inquirer.prompt([
			{
				type: 'list',
				name: 'action',
				message: 'What would you like to do?',
				choices: [
					{ name: 'View a specific version', value: 'view' },
					{ name: 'Compare versions', value: 'compare' },
					{ name: 'Back to main menu', value: 'back' }
				]
			}
		]);

		if (action === 'view') {
			const { selectedVersion } = await inquirer.prompt([
				{
					type: 'list',
					name: 'selectedVersion',
					message: 'Select version to view:',
					choices: validVersions.map(v => ({
						name: `${v.version} (${v.timestamp})`,
						value: v.file
					}))
				}
			]);

			const content = await fs.readFile(path.join(VERSIONS_DIR, selectedVersion), 'utf8');
			const docVersion = parseDocFile(content);

			console.clear();
			console.log(boxen(
				chalk.bold.cyan(`Document ${docId} - Version ${docVersion.version}`) + '\n\n' +
				`Title: ${docVersion.title}\n` +
				`Status: ${STATUS[docVersion.status] || docVersion.status}\n` +
				`Contributors: ${docVersion.contributors?.join(', ') || 'None'}\n` +
				`Last Updated: ${docVersion.last_updated || 'Unknown'}`,
				{ padding: 1, borderColor: 'cyan' }
			));

			if (docVersion.content) {
				console.log(chalk.bold.underline('\nContent:'));
				console.log(docVersion.content);
			}
		} else if (action === 'compare') {
			// This would be a more complex comparison feature, could use diff library
			console.log(chalk.yellow('Version comparison feature coming soon'));
		}

		await promptContinue();
	} catch (err) {
		console.error('Error listing versions:', err);
		await promptContinue();
	}
}

// Function to view related tasks
async function viewRelatedTasks() {
	const docs = await loadAllDocs();

	if (docs.length === 0) {
		console.log(chalk.yellow('No documents found'));
		await promptContinue();
		return;
	}

	// Use fuzzy search for document selection
	const docChoices = docs.map(doc => ({
		name: `${doc.id}: ${doc.title}`,
		value: doc.id
	}));

	const { docId } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'docId',
			message: 'Select a document to view related tasks:',
			source: (answersSoFar, input = '') => {
				return new Promise(resolve => {
					const fuzzyResult = fuzzy.filter(input, docChoices, {
						extract: el => el.name
					});
					resolve(fuzzyResult.map(result => result.original));
				});
			}
		}
	]);

	const doc = docs.find(d => d.id === docId);

	if (!doc) {
		console.log(chalk.red(`Document ${docId} not found`));
		await promptContinue();
		return;
	}

	const related_tasks = doc.related_tasks || [];

	if (related_tasks.length === 0) {
		console.log(chalk.yellow(`No related tasks found for document ${docId}`));
		await promptContinue();
		return;
	}

	// Try to load task information if available
	try {
		const taskDir = path.join(process.cwd(), '.task', 'tasks');
		const tasks = [];

		for (const taskId of related_tasks) {
			try {
				const content = await fs.readFile(path.join(taskDir, `${taskId}.md`), 'utf8');
				const taskInfo = parseTaskFile(content);
				if (taskInfo) {
					tasks.push(taskInfo);
				} else {
					tasks.push({ id: taskId, title: 'Unknown', status: 'Unknown' });
				}
			} catch (err) {
				tasks.push({ id: taskId, title: 'Unknown', status: 'Unknown' });
			}
		}

		const table = new Table({
			head: [
				chalk.bold('Task ID'),
				chalk.bold('Title'),
				chalk.bold('Status'),
				chalk.bold('Priority')
			],
			colWidths: [15, 35, 20, 15]
		});

		tasks.forEach(task => {
			table.push([
				task.id,
				task.title || 'Unknown',
				task.status || 'Unknown',
				task.priority || '-'
			]);
		});

		console.log(chalk.bold.magenta(`Related Tasks for ${docId}:`));
		console.log(table.toString());
	} catch (err) {
		console.log(chalk.yellow(`Related tasks: ${related_tasks.join(', ')}`));
		console.log(chalk.yellow('Task details not available. Is the task system configured?'));
	}

	await promptContinue();
}

// Function to generate documentation report
async function generateReport() {
	const docs = await loadAllDocs();

	if (docs.length === 0) {
		console.log(chalk.yellow('No documents found'));
		await promptContinue();
		return;
	}

	// Select report type
	const { reportType } = await inquirer.prompt([
		{
			type: 'list',
			name: 'reportType',
			message: 'Select report type:',
			choices: [
				{ name: 'Status summary', value: 'status' },
				{ name: 'Component coverage', value: 'component' },
				{ name: 'Task correlation', value: 'task' },
				{ name: 'Documentation health', value: 'health' },
				{ name: 'Back to main menu', value: 'back' }
			]
		}
	]);

	if (reportType === 'back') {
		await mainMenu();
		return;
	}

	switch (reportType) {
		case 'status': {
			// Group documents by status
			const statusGroups = {};
			Object.keys(STATUS).forEach(status => {
				statusGroups[status] = docs.filter(doc => doc.status === status);
			});

			// Count documents by status
			const counts = Object.entries(statusGroups).map(([status, docsInStatus]) => ({
				status,
				count: docsInStatus.length
			}));

			// Display counts
			console.log(chalk.bold.green('Documentation Status Summary:'));

			const table = new Table({
				head: [chalk.bold('Status'), chalk.bold('Count'), chalk.bold('Percentage')],
				colWidths: [25, 10, 15]
			});

			counts.forEach(({ status, count }) => {
				const percentage = ((count / docs.length) * 100).toFixed(1) + '%';
				table.push([
					STATUS[status] || status,
					count,
					percentage
				]);
			});

			console.log(table.toString());

			// Calculate health score
			const currentCount = statusGroups['🟢 Current']?.length || 0;
			const draftCount = statusGroups['⚪ Draft']?.length || 0;
			const updateRequiredCount = statusGroups['🟡 Update Required']?.length || 0;
			const outdatedCount = statusGroups['🔴 Outdated']?.length || 0;

			const healthScore = (
				(currentCount * 1.0) +
				(draftCount * 0.5) +
				(updateRequiredCount * 0.25)
			) / docs.length * 100;

			console.log(chalk.bold(`\nDocumentation Health Score: ${healthScore.toFixed(1)}%`));

			break;
		}

		case 'component': {
			// Group documents by component
			const componentGroups = {
				'master': docs.filter(doc => doc.component === 'master'),
				'justthink_justcreate': docs.filter(doc => doc.component === 'justthink_justcreate'),
				'juststuff': docs.filter(doc => doc.component === 'juststuff')
			};

			console.log(chalk.bold.green('Component Coverage:'));

			const table = new Table({
				head: [
					chalk.bold('Component'),
					chalk.bold('Count'),
					chalk.bold('Current'),
					chalk.bold('Needs Update'),
					chalk.bold('Coverage %')
				],
				colWidths: [20, 10, 10, 15, 15]
			});

			Object.entries(componentGroups).forEach(([component, componentDocs]) => {
				const currentDocs = componentDocs.filter(doc => doc.status === '🟢 Current');
				const needsUpdateDocs = componentDocs.filter(doc =>
					doc.status === '🟡 Update Required' || doc.status === '🔴 Outdated'
				);

				const coverage = currentDocs.length / (componentDocs.length || 1) * 100;

				let displayName;
				switch (component) {
					case 'master':
						displayName = 'Master (Sys-wide)';
						break;
					case 'justthink_justcreate':
						displayName = 'JustThink/Create';
						break;
					case 'juststuff':
						displayName = 'JustStuff';
						break;
					default:
						displayName = component;
				}

				table.push([
					displayName,
					componentDocs.length,
					currentDocs.length,
					needsUpdateDocs.length,
					`${coverage.toFixed(1)}%`
				]);
			});

			console.log(table.toString());

			break;
		}

		case 'task': {
			// Find all tasks mentioned in docs
			const relatedTasks = new Set();
			docs.forEach(doc => {
				if (doc.related_tasks && doc.related_tasks.length > 0) {
					doc.related_tasks.forEach(task => relatedTasks.add(task));
				}
			});

			const tasksCount = relatedTasks.size;

			// Count docs with and without related tasks
			const docsWithTasks = docs.filter(doc => doc.related_tasks && doc.related_tasks.length > 0);
			const docsWithoutTasks = docs.filter(doc => !doc.related_tasks || doc.related_tasks.length === 0);

			console.log(chalk.bold.green('Task Correlation:'));
			console.log(`Total tasks referenced: ${tasksCount}`);
			console.log(`Documents with task references: ${docsWithTasks.length} (${((docsWithTasks.length / docs.length) * 100).toFixed(1)}%)`);
			console.log(`Documents without task references: ${docsWithoutTasks.length} (${((docsWithoutTasks.length / docs.length) * 100).toFixed(1)}%)`);

			// List top tasks by document count
			if (tasksCount > 0) {
				// Count documents per task
				const taskCounts = {};
				docs.forEach(doc => {
					if (doc.related_tasks && doc.related_tasks.length > 0) {
						doc.related_tasks.forEach(task => {
							taskCounts[task] = (taskCounts[task] || 0) + 1;
						});
					}
				});

				// Sort by count
				const sortedTasks = Object.entries(taskCounts)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 10); // Top 10

				if (sortedTasks.length > 0) {
					console.log(chalk.bold('\nMost Referenced Tasks:'));

					const table = new Table({
						head: [chalk.bold('Task ID'), chalk.bold('Referenced in # Docs')],
						colWidths: [20, 25]
					});

					sortedTasks.forEach(([task, count]) => {
						table.push([task, count]);
					});

					console.log(table.toString());
				}
			}

			break;
		}

		case 'health': {
			// Calculate health scores for different aspects

			// Coverage: % of components with documentation
			const components = [...new Set(docs.map(doc => doc.component))];
			const componentCoverage = components.length / 3 * 100; // 3 is expected number of components

			// Currency: % of docs that are current
			const currentDocs = docs.filter(doc => doc.status === '🟢 Current');
			const currency = currentDocs.length / docs.length * 100;

			// Task correlation: % of docs with task references
			const docsWithTasks = docs.filter(doc => doc.related_tasks && doc.related_tasks.length > 0);
			const taskCorrelation = docsWithTasks.length / docs.length * 100;

			// Version hygiene: % of docs with proper versions
			const docsWithVersion = docs.filter(doc => doc.version && /^\d+\.\d+\.\d+$/.test(doc.version));
			const versionHygiene = docsWithVersion.length / docs.length * 100;

			// Tags: % of docs with tags
			const docsWithTags = docs.filter(doc => doc.tags && doc.tags.length > 0);
			const tagCoverage = docsWithTags.length / docs.length * 100;

			// Overall health
			const overallHealth = (
				componentCoverage * 0.2 +
				currency * 0.3 +
				taskCorrelation * 0.2 +
				versionHygiene * 0.15 +
				tagCoverage * 0.15
			);

			console.log(chalk.bold.green('Documentation Health Assessment:'));

			const table = new Table({
				head: [chalk.bold('Metric'), chalk.bold('Score'), chalk.bold('Weight'), chalk.bold('Details')],
				colWidths: [20, 10, 10, 40]
			});

			table.push(
				['Component Coverage', `${componentCoverage.toFixed(1)}%`, '20%', `${components.length}/3 components documented`],
				['Currency', `${currency.toFixed(1)}%`, '30%', `${currentDocs.length}/${docs.length} docs current`],
				['Task Correlation', `${taskCorrelation.toFixed(1)}%`, '20%', `${docsWithTasks.length}/${docs.length} docs with tasks`],
				['Version Hygiene', `${versionHygiene.toFixed(1)}%`, '15%', `${docsWithVersion.length}/${docs.length} docs with proper versions`],
				['Tag Coverage', `${tagCoverage.toFixed(1)}%`, '15%', `${docsWithTags.length}/${docs.length} docs with tags`]
			);

			console.log(table.toString());

			// Overall score with color coding
			let healthColor;
			if (overallHealth >= 90) {
				healthColor = chalk.green;
			} else if (overallHealth >= 70) {
				healthColor = chalk.blue;
			} else if (overallHealth >= 50) {
				healthColor = chalk.yellow;
			} else {
				healthColor = chalk.red;
			}

			console.log(`\nOverall Documentation Health: ${healthColor(overallHealth.toFixed(1) + '%')}`);

			// Recommendations
			console.log(chalk.bold('\nRecommendations:'));

			if (currency < 80) {
				console.log(chalk.yellow('- Update outdated documentation, focusing on high-priority items'));
			}

			if (taskCorrelation < 70) {
				console.log(chalk.yellow('- Improve task correlation by linking documents to related tasks'));
			}

			if (componentCoverage < 100) {
				console.log(chalk.yellow('- Ensure all components have documentation coverage'));
			}

			if (versionHygiene < 90) {
				console.log(chalk.yellow('- Standardize version numbers across all documentation'));
			}

			if (tagCoverage < 80) {
				console.log(chalk.yellow('- Add tags to documentation for improved searchability'));
			}

			break;
		}
	}

	await promptContinue();
}

// Function that parses a task file
function parseTaskFile(content) {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return null;
	}

	try {
		const metadata = yaml.load(match[1]);
		return metadata;
	} catch (err) {
		console.error('Error parsing task file:', err);
		return null;
	}
}

// Helper function for document list actions
async function docListActions(docs) {
	const { action } = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: [
				{ name: 'View document details', value: 'view' },
				{ name: 'Update a document', value: 'update' },
				{ name: 'Back to main menu', value: 'back' }
			]
		}
	]);

	switch (action) {
		case 'view':
			await viewDocDetails(docs);
			break;
		case 'update':
			await updateDoc();
			break;
		case 'back':
			await mainMenu();
			break;
	}
}

// Function to view document details
async function viewDocDetails(docs) {
	// Use fuzzy search for document selection
	const docChoices = docs.map(doc => ({
		name: `${doc.id}: ${doc.title}`,
		value: doc.id
	}));

	const { docId } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'docId',
			message: 'Select a document to view:',
			source: (answersSoFar, input = '') => {
				return new Promise(resolve => {
					const fuzzyResult = fuzzy.filter(input, docChoices, {
						extract: el => el.name
					});
					resolve(fuzzyResult.map(result => result.original));
				});
			}
		}
	]);

	const doc = docs.find(d => d.id === docId);

	if (!doc) {
		console.log(chalk.red(`Document ${docId} not found`));
		await promptContinue();
		return;
	}

	// Display document details
	console.clear();

	console.log(boxen(
		chalk.bold.green(`Document ${doc.id}: ${doc.title}`) + '\n\n' +
		`Status: ${STATUS[doc.status] || doc.status}\n` +
		`Version: ${doc.version || 'Not set'}\n` +
		`Component: ${doc.component || 'Not set'}\n` +
		`Tags: ${doc.tags?.join(', ') || 'None'}\n` +
		`Related Tasks: ${doc.related_tasks?.join(', ') || 'None'}\n` +
		`Contributors: ${doc.contributors?.join(', ') || 'None'}\n` +
		`Last Updated: ${doc.last_updated || 'Unknown'}`,
		{ padding: 1, borderColor: 'green' }
	));

	if (doc.content) {
		console.log(chalk.bold.underline('\nContent:'));
		console.log(doc.content);
	}

	await promptContinue();
}

// Helper function to prompt user to continue
async function promptContinue() {
	const { action } = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do next?',
			choices: [
				{ name: 'Back to main menu', value: 'main' },
				{ name: 'Exit', value: 'exit' }
			]
		}
	]);

	if (action === 'main') {
		await mainMenu();
	} else {
		console.log(chalk.green('Goodbye!'));
		process.exit(0);
	}
}

// Main function
async function main() {
	try {
		// Dynamically import ESM modules
		const autocompletePrompt = await import('inquirer-autocomplete-prompt');
		inquirer.registerPrompt('autocomplete', autocompletePrompt.default);

		await ensureDirectories();
		await mainMenu();
	} catch (err) {
		console.error('Error:', err);
		process.exit(1);
	}
}

// Run the main function
main().catch(err => {
	console.error('Unhandled error:', err);
	process.exit(1);
});
