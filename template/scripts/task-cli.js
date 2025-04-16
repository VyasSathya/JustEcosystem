#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const Table = require('cli-table3');
// const open = require('open'); // ESM module, needs dynamic import
const { DateTime } = require('luxon');
const fuzzy = require('fuzzy');

// Helper for opening URLs or files (using dynamic import)
async function openUrl(url) {
	const open = await import('open');
	return open.default(url);
}

// We'll register the autocomplete prompt after dynamically importing it
// inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

// Path configuration
const TASK_DIR = path.join(process.cwd(), '.task', 'tasks');
const VIEWS_DIR = path.join(process.cwd(), '.task', 'views');
const HISTORY_DIR = path.join(process.cwd(), '.task', 'history');

// Status definitions with colors
const STATUS = {
	'🔴 Blocked': chalk.red('🔴 Blocked'),
	'🟡 Partially Blocked': chalk.yellow('🟡 Partially Blocked'),
	'🟢 In Progress': chalk.green('🟢 In Progress'),
	'⚪ Not Started': chalk.white('⚪ Not Started'),
	'✅ Completed': chalk.green('✅ Completed')
};

// Helper to ensure directories exist
async function ensureDirectories() {
	for (const dir of [TASK_DIR, VIEWS_DIR, HISTORY_DIR]) {
		try {
			await fs.mkdir(dir, { recursive: true });
		} catch (err) {
			console.error(`Error creating directory ${dir}:`, err);
		}
	}
}

// Helper to load all tasks
async function loadAllTasks() {
	try {
		const files = await fs.readdir(TASK_DIR);
		const tasks = [];

		for (const file of files) {
			if (file.endsWith('.md')) {
				const content = await fs.readFile(path.join(TASK_DIR, file), 'utf8');
				const task = parseTaskFile(content);
				task.filename = file;
				tasks.push(task);
			}
		}

		return tasks;
	} catch (err) {
		console.error('Error loading tasks:', err);
		return [];
	}
}

// Helper to parse task file
function parseTaskFile(content) {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		console.warn(chalk.yellow(`Warning: Malformed task file detected (missing or invalid frontmatter)`));
		return {
			id: 'unknown',
			title: 'Malformed Task File',
			status: '⚪ Not Started',
			content: content || ''
		};
	}

	try {
		const metadata = yaml.load(match[1]);
		const description = match[2].trim();

		// Validate required fields
		if (!metadata.id) {
			console.warn(chalk.yellow(`Warning: Task missing required 'id' field`));
			metadata.id = 'unknown';
		}

		if (!metadata.title) {
			console.warn(chalk.yellow(`Warning: Task ${metadata.id} missing required 'title' field`));
			metadata.title = 'Untitled Task';
		}

		if (!metadata.status) {
			console.warn(chalk.yellow(`Warning: Task ${metadata.id} missing required 'status' field`));
			metadata.status = '⚪ Not Started';
		}

		return {
			...metadata,
			content: description
		};
	} catch (err) {
		console.error(chalk.red(`Error parsing task metadata: ${err.message}`));
		return {
			id: 'unknown',
			title: 'Error Parsing Task',
			status: '⚪ Not Started',
			content: content || ''
		};
	}
}

// Helper to save a task
async function saveTask(task) {
	const { content, filename, ...metadata } = task;

	// Ensure content has proper markdown formatting with correct spacing
	const formattedContent = ensureProperMarkdownFormatting(content);

	const taskFile = `---
${yaml.dump(metadata)}---

${formattedContent}
`;

	const taskFilename = filename || `${task.id}.md`;
	await fs.writeFile(path.join(TASK_DIR, taskFilename), taskFile);

	// Record history
	const timestamp = DateTime.now().toISO();
	const historyEntry = {
		timestamp,
		task_id: task.id,
		status: task.status,
		assignee: task.assignee,
		action: filename ? 'update' : 'create'
	};

	const historyFilename = `${task.id}-${timestamp.replace(/:/g, '-')}.json`;
	await fs.writeFile(
		path.join(HISTORY_DIR, historyFilename),
		JSON.stringify(historyEntry, null, 2)
	);
}

// Helper function to ensure proper markdown formatting
function ensureProperMarkdownFormatting(content) {
	if (!content) return '';

	// Fix headings: ensure blank lines before and after headings
	let formatted = content.replace(/^(#{1,6} .+)$/gm, '\n$1\n');

	// Fix lists: ensure blank lines before and after lists
	formatted = formatted.replace(/^(\s*[-*+] .+)$/gm, '\n$1');

	// Remove multiple consecutive blank lines (more than 2)
	formatted = formatted.replace(/\n{3,}/g, '\n\n');

	// Ensure there's only one blank line at the beginning
	formatted = formatted.replace(/^\n+/, '\n');

	// Ensure there's only one blank line at the end
	formatted = formatted.replace(/\n+$/, '\n');

	return formatted;
}

// Main menu
async function mainMenu() {
	console.log(
		drawBox(chalk.bold.blue('Just.cool Task Management'), {
			padding: 1,
			margin: 1,
			borderColor: 'blue'
		})
	);

	const mainChoices = [
		{ name: 'View all tasks', value: 'viewAll' },
		{ name: 'View tasks by status', value: 'viewByStatus' },
		{ name: 'View MVP tasks', value: 'viewMvp' },
		{ name: 'View high priority tasks', value: 'viewHighPriority' },
		{ name: 'View recently updated tasks', value: 'viewRecent' },
		{ name: 'View blocked tasks', value: 'viewBlocked' },
		{ name: 'Search tasks', value: 'search' },
		new inquirer.Separator(),
		{ name: 'Update a task', value: 'update' },
		{ name: 'Create a new task', value: 'create' },
		new inquirer.Separator(),
		{ name: 'Generate report', value: 'report' },
		{ name: 'View task dependencies', value: 'dependencies' },
		{ name: 'View affected documentation', value: 'documentation' },
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
			await viewAllTasks();
			break;
		case 'viewByStatus':
			await viewTasksByStatus();
			break;
		case 'viewMvp':
			await viewMvpTasks();
			break;
		case 'viewHighPriority':
			await viewHighPriorityTasks();
			break;
		case 'viewRecent':
			await viewRecentTasks();
			break;
		case 'viewBlocked':
			await viewBlockedTasks();
			break;
		case 'search':
			await searchTasks();
			break;
		case 'update':
			await updateTask();
			break;
		case 'create':
			await createTask();
			break;
		case 'report':
			await generateReport();
			break;
		case 'dependencies':
			await viewDependencies();
			break;
		case 'documentation':
			await viewDocumentation();
			break;
		case 'exit':
			console.log(chalk.blue('Goodbye!'));
			process.exit(0);
		default:
			console.log(chalk.yellow('Function not implemented yet'));
			await mainMenu();
	}
}

// Function to display all tasks
async function viewAllTasks() {
	const tasks = await loadAllTasks();

	if (tasks.length === 0) {
		console.log(chalk.yellow('No tasks found'));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Priority'),
			chalk.bold('Phase'),
			chalk.bold('Assignee')
		],
		colWidths: [12, 35, 20, 12, 10, 15],
		wordWrap: true,
		truncate: '...'
	});

	tasks.forEach(task => {
		const status = STATUS[task.status] || task.status;
		table.push([
			task.id || 'unknown',
			task.title || 'Unknown',
			status,
			task.priority || '-',
			task.phase || '-',
			task.assignee || '-'
		]);
	});

	console.log(table.toString());

	await taskListActions(tasks);
}

// Function to view tasks by status
async function viewTasksByStatus() {
	const tasks = await loadAllTasks();

	const statusChoices = Object.keys(STATUS).map(status => ({
		name: STATUS[status],
		value: status
	}));

	const { selectedStatus } = await inquirer.prompt([
		{
			type: 'list',
			name: 'selectedStatus',
			message: 'Select a status to filter by:',
			choices: statusChoices
		}
	]);

	const filteredTasks = tasks.filter(task => task.status === selectedStatus);

	if (filteredTasks.length === 0) {
		console.log(chalk.yellow(`No tasks with status: ${STATUS[selectedStatus] || selectedStatus}`));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Priority'),
			chalk.bold('Phase'),
			chalk.bold('Assignee')
		],
		colWidths: [12, 40, 12, 10, 15],
		wordWrap: true,
		truncate: '...'
	});

	filteredTasks.forEach(task => {
		table.push([
			task.id || 'unknown',
			task.title || 'Unknown',
			task.priority || '-',
			task.phase || '-',
			task.assignee || '-'
		]);
	});

	console.log(chalk.bold(`Tasks with status: ${STATUS[selectedStatus] || selectedStatus}`));
	console.log(table.toString());

	await taskListActions(filteredTasks);
}

// Function to update a task
async function updateTask() {
	const tasks = await loadAllTasks();

	if (tasks.length === 0) {
		console.log(chalk.yellow('No tasks found'));
		await promptContinue();
		return;
	}

	// Use fuzzy search for task selection
	const taskChoices = tasks.map(task => ({
		name: `${task.id}: ${task.title}`,
		value: task.id
	}));

	const { taskId } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'taskId',
			message: 'Select a task to update:',
			source: (answersSoFar, input = '') => {
				return new Promise(resolve => {
					const fuzzyResult = fuzzy.filter(input, taskChoices, {
						extract: el => el.name
					});
					resolve(fuzzyResult.map(result => result.original));
				});
			}
		}
	]);

	const task = tasks.find(t => t.id === taskId);

	if (!task) {
		console.log(chalk.red(`Task ${taskId} not found`));
		await promptContinue();
		return;
	}

	// Display current task details
	console.log(drawBox(
		chalk.bold(`Task ${task.id}: ${task.title}`) + '\n\n' +
		`Status: ${STATUS[task.status] || task.status}\n` +
		`Priority: ${task.priority || 'Not set'}\n` +
		`Assignee: ${task.assignee || 'Unassigned'}\n` +
		`Phase: ${task.phase || 'Not set'}\n` +
		`MVP: ${task.mvp ? 'Yes' : 'No'}\n` +
		`Dependencies: ${task.dependencies?.join(', ') || 'None'}\n` +
		`Doc Impact: ${task.doc_impact || 'None'}\n` +
		`Affected Docs: ${task.affected_docs?.join(', ') || 'None'}\n\n` +
		chalk.dim(task.content?.substring(0, 200) + (task.content?.length > 200 ? '...' : '')),
		{ padding: 1, borderColor: 'blue' }
	));

	// Ask what to update
	const updateChoices = [
		{ name: 'Status', value: 'status' },
		{ name: 'Priority', value: 'priority' },
		{ name: 'Assignee', value: 'assignee' },
		{ name: 'Phase', value: 'phase' },
		{ name: 'MVP flag', value: 'mvp' },
		{ name: 'Dependencies', value: 'dependencies' },
		{ name: 'Doc Impact', value: 'doc_impact' },
		{ name: 'Affected Docs', value: 'affected_docs' },
		{ name: 'Description/Content', value: 'content' },
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
					default: task.status
				}
			]);
			task.status = newStatus;
			break;
		}

		case 'priority': {
			const { newPriority } = await inquirer.prompt([
				{
					type: 'list',
					name: 'newPriority',
					message: 'Select new priority:',
					choices: ['Critical', 'High', 'Medium', 'Low'],
					default: task.priority
				}
			]);
			task.priority = newPriority;
			break;
		}

		case 'assignee': {
			const { newAssignee } = await inquirer.prompt([
				{
					type: 'input',
					name: 'newAssignee',
					message: 'Enter new assignee:',
					default: task.assignee || ''
				}
			]);
			task.assignee = newAssignee;
			break;
		}

		case 'phase': {
			const { newPhase } = await inquirer.prompt([
				{
					type: 'input',
					name: 'newPhase',
					message: 'Enter new phase:',
					default: task.phase || '',
					validate: input => {
						const num = parseInt(input);
						return (input === '' || (!isNaN(num) && num > 0)) ?
							true : 'Phase must be a positive number or empty';
					}
				}
			]);
			task.phase = newPhase === '' ? undefined : parseInt(newPhase);
			break;
		}

		case 'mvp': {
			const { newMvp } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'newMvp',
					message: 'Is this task part of the MVP?',
					default: task.mvp || false
				}
			]);
			task.mvp = newMvp;
			break;
		}

		case 'dependencies': {
			const allTaskIds = tasks.map(t => t.id);
			const { newDependencies } = await inquirer.prompt([
				{
					type: 'checkbox',
					name: 'newDependencies',
					message: 'Select dependencies:',
					choices: allTaskIds.filter(id => id !== task.id),
					default: task.dependencies || []
				}
			]);
			task.dependencies = newDependencies.length > 0 ? newDependencies : undefined;
			break;
		}

		case 'doc_impact': {
			const { newDocImpact } = await inquirer.prompt([
				{
					type: 'list',
					name: 'newDocImpact',
					message: 'Select documentation impact level:',
					choices: ['high', 'medium', 'low', 'none'],
					default: task.doc_impact || 'none'
				}
			]);
			task.doc_impact = newDocImpact === 'none' ? undefined : newDocImpact;
			break;
		}

		case 'affected_docs': {
			// This would be better with an integration to the actual doc system
			const { docsInput } = await inquirer.prompt([
				{
					type: 'input',
					name: 'docsInput',
					message: 'Enter affected doc IDs (comma-separated):',
					default: task.affected_docs?.join(', ') || '',
				}
			]);

			const docIds = docsInput.split(',')
				.map(id => id.trim())
				.filter(id => id !== '');

			task.affected_docs = docIds.length > 0 ? docIds : undefined;
			break;
		}

		case 'content': {
			// Launch editor (this requires the EDITOR env var to be set)
			console.log(chalk.yellow('Opening editor... (close editor to continue)'));

			const tempFile = path.join(process.cwd(), `.task_temp_${Date.now()}.md`);
			await fs.writeFile(tempFile, task.content || '');

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
				task.content = updatedContent;

				// Clean up
				await fs.unlink(tempFile);
			} catch (err) {
				console.error('Error using editor:', err);
				await fs.unlink(tempFile).catch(() => { });
			}
			break;
		}
	}

	// Save the updated task
	await saveTask(task);
	console.log(chalk.green(`Task ${task.id} updated successfully`));

	// Check if we need to update documentation based on task status
	if (
		task.status === '✅ Completed' &&
		task.doc_impact &&
		task.doc_impact !== 'none' &&
		task.affected_docs?.length > 0
	) {
		console.log(chalk.yellow.bold('This completed task affects documentation!'));
		console.log(chalk.yellow(`Affected docs: ${task.affected_docs.join(', ')}`));
		console.log(chalk.yellow('Please update the documentation accordingly.'));
	}

	await promptContinue();
}

// Function to create a new task
async function createTask() {
	const tasks = await loadAllTasks();

	// Get the highest existing task number to suggest the next one
	const taskIds = tasks.map(task => task.id)
		.filter(id => id.match(/^MIG-\d+$/))
		.map(id => parseInt(id.split('-')[1]));

	const nextTaskNum = taskIds.length > 0 ? Math.max(...taskIds) + 1 : 1;
	const suggestedId = `MIG-${String(nextTaskNum).padStart(3, '0')}`;

	// Collect task details
	const { id, title, status, priority, phase, mvp, assignee, doc_impact } = await inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Task ID:',
			default: suggestedId,
			validate: input => {
				if (input.trim() === '') return 'ID cannot be empty';
				if (tasks.some(t => t.id === input)) return 'ID already exists';
				return true;
			}
		},
		{
			type: 'input',
			name: 'title',
			message: 'Task title:',
			validate: input => input.trim() !== '' ? true : 'Title cannot be empty'
		},
		{
			type: 'list',
			name: 'status',
			message: 'Initial status:',
			choices: Object.keys(STATUS),
			default: '⚪ Not Started'
		},
		{
			type: 'list',
			name: 'priority',
			message: 'Priority:',
			choices: ['Critical', 'High', 'Medium', 'Low'],
			default: 'Medium'
		},
		{
			type: 'input',
			name: 'phase',
			message: 'Phase number:',
			validate: input => {
				if (input === '') return true;
				const num = parseInt(input);
				return !isNaN(num) && num > 0 ? true : 'Phase must be a positive number';
			}
		},
		{
			type: 'confirm',
			name: 'mvp',
			message: 'Is this task part of the MVP?',
			default: false
		},
		{
			type: 'input',
			name: 'assignee',
			message: 'Assignee:'
		},
		{
			type: 'list',
			name: 'doc_impact',
			message: 'Documentation impact:',
			choices: ['high', 'medium', 'low', 'none'],
			default: 'none'
		}
	]);

	let dependencies = [];
	if (tasks.length > 0) {
		const { hasDependencies } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'hasDependencies',
				message: 'Does this task have dependencies?',
				default: false
			}
		]);

		if (hasDependencies) {
			const { selectedDependencies } = await inquirer.prompt([
				{
					type: 'checkbox',
					name: 'selectedDependencies',
					message: 'Select dependencies:',
					choices: tasks.map(t => ({
						name: `${t.id}: ${t.title}`,
						value: t.id
					}))
				}
			]);

			dependencies = selectedDependencies;
		}
	}

	let affected_docs = [];
	if (doc_impact !== 'none') {
		const { docsInput } = await inquirer.prompt([
			{
				type: 'input',
				name: 'docsInput',
				message: 'Enter affected doc IDs (comma-separated):',
			}
		]);

		affected_docs = docsInput.split(',')
			.map(id => id.trim())
			.filter(id => id !== '');
	}

	console.log(chalk.yellow('Enter task description (close editor to save):'));

	// Use temporary file for description
	const tempFile = path.join(process.cwd(), `.task_temp_${Date.now()}.md`);
	await fs.writeFile(tempFile, `## Description

Add your task description here.

## Required Resources

- Resource 1
- Resource 2
- Resource 3

## Success Criteria

- Criterion 1
- Criterion 2
- Criterion 3

## Progress Updates

- **${DateTime.now().toISODate()}**: Task created and dependencies identified
`);

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

	// Create and save the task
	const task = {
		id,
		title,
		status,
		priority,
		phase: phase ? parseInt(phase) : undefined,
		mvp,
		assignee: assignee || undefined,
		dependencies: dependencies.length > 0 ? dependencies : undefined,
		doc_impact: doc_impact === 'none' ? undefined : doc_impact,
		affected_docs: affected_docs.length > 0 ? affected_docs : undefined,
		last_updated: DateTime.now().toISODate(),
		content
	};

	await saveTask(task);
	console.log(chalk.green(`Task ${id} created successfully`));

	await promptContinue();
}

// Function to generate report
async function generateReport() {
	const tasks = await loadAllTasks();

	if (tasks.length === 0) {
		console.log(chalk.yellow('No tasks found'));
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
				{ name: 'Phase progress', value: 'phase' },
				{ name: 'MVP progress', value: 'mvp' },
				{ name: 'Documentation impact', value: 'doc' },
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
			// Group tasks by status
			const statusGroups = {};
			Object.keys(STATUS).forEach(status => {
				statusGroups[status] = tasks.filter(task => task.status === status);
			});

			// Count tasks by status
			const counts = Object.entries(statusGroups).map(([status, tasksInStatus]) => ({
				status,
				count: tasksInStatus.length
			}));

			// Display counts
			console.log(chalk.bold.blue('Status Summary:'));

			const table = new Table({
				head: [chalk.bold('Status'), chalk.bold('Count'), chalk.bold('Percentage')],
				colWidths: [25, 10, 15]
			});

			counts.forEach(({ status, count }) => {
				const percentage = ((count / tasks.length) * 100).toFixed(1) + '%';
				table.push([
					STATUS[status] || status,
					count,
					percentage
				]);
			});

			console.log(table.toString());

			// Calculate overall progress
			const completedCount = statusGroups['✅ Completed']?.length || 0;
			const totalCount = tasks.length;
			const progressPercent = ((completedCount / totalCount) * 100).toFixed(1);

			console.log(chalk.bold(`\nOverall Progress: ${progressPercent}% (${completedCount}/${totalCount} tasks completed)`));

			// Simple progress bar
			const progressBar = Array(20).fill('▓').join('');
			const emptyBar = Array(20).fill('░').join('');
			const progressPos = Math.round((completedCount / totalCount) * 20);

			const bar = progressBar.substring(0, progressPos) + emptyBar.substring(progressPos);
			console.log(`\n${bar} ${progressPercent}%`);

			break;
		}

		case 'phase': {
			// Group tasks by phase
			const phases = [...new Set(tasks.map(task => task.phase).filter(Boolean))].sort((a, b) => a - b);

			const table = new Table({
				head: [
					chalk.bold('Phase'),
					chalk.bold('Total'),
					chalk.bold('Completed'),
					chalk.bold('Progress'),
					chalk.bold('Status')
				],
				colWidths: [10, 10, 12, 12, 20]
			});

			phases.forEach(phase => {
				const phaseTasks = tasks.filter(task => task.phase === phase);
				const completedTasks = phaseTasks.filter(task => task.status === '✅ Completed');
				const progress = ((completedTasks.length / phaseTasks.length) * 100).toFixed(1) + '%';

				// Determine phase status
				let phaseStatus;
				if (completedTasks.length === phaseTasks.length) {
					phaseStatus = chalk.green('Complete');
				} else if (phaseTasks.some(task => task.status === '🟢 In Progress')) {
					phaseStatus = chalk.blue('In Progress');
				} else if (phaseTasks.some(task => task.status === '🔴 Blocked')) {
					phaseStatus = chalk.red('Blocked');
				} else if (phaseTasks.some(task => task.status === '🟡 Partially Blocked')) {
					phaseStatus = chalk.yellow('Partially Blocked');
				} else {
					phaseStatus = chalk.white('Not Started');
				}

				table.push([
					`Phase ${phase}`,
					phaseTasks.length,
					completedTasks.length,
					progress,
					phaseStatus
				]);
			});

			console.log(chalk.bold.blue('Phase Progress:'));
			console.log(table.toString());

			break;
		}

		case 'mvp': {
			const mvpTasks = tasks.filter(task => task.mvp === true);

			if (mvpTasks.length === 0) {
				console.log(chalk.yellow('No MVP tasks found'));
				break;
			}

			// Group MVP tasks by status
			const statusGroups = {};
			Object.keys(STATUS).forEach(status => {
				statusGroups[status] = mvpTasks.filter(task => task.status === status);
			});

			// Display MVP progress
			const completedMvpTasks = mvpTasks.filter(task => task.status === '✅ Completed');
			const mvpProgress = ((completedMvpTasks.length / mvpTasks.length) * 100).toFixed(1);

			console.log(chalk.bold.magenta('MVP Progress:'));
			console.log(chalk.bold(`${mvpProgress}% (${completedMvpTasks.length}/${mvpTasks.length} tasks completed)`));

			// Simple progress bar
			const progressBar = Array(20).fill('▓').join('');
			const emptyBar = Array(20).fill('░').join('');
			const progressPos = Math.round((completedMvpTasks.length / mvpTasks.length) * 20);

			const bar = progressBar.substring(0, progressPos) + emptyBar.substring(progressPos);
			console.log(`\n${bar} ${mvpProgress}%`);

			// Display status breakdown
			const table = new Table({
				head: [chalk.bold('Status'), chalk.bold('Count')],
				colWidths: [25, 10]
			});

			Object.entries(statusGroups)
				.filter(([_, tasksInStatus]) => tasksInStatus.length > 0)
				.forEach(([status, tasksInStatus]) => {
					table.push([
						STATUS[status] || status,
						tasksInStatus.length
					]);
				});

			console.log('\nMVP Tasks by Status:');
			console.log(table.toString());

			break;
		}

		case 'doc': {
			const docImpactTasks = tasks.filter(task =>
				task.doc_impact && task.doc_impact !== 'none'
			);

			if (docImpactTasks.length === 0) {
				console.log(chalk.yellow('No tasks with documentation impact found'));
				break;
			}

			// Group by impact level
			const impactGroups = {
				high: docImpactTasks.filter(task => task.doc_impact === 'high'),
				medium: docImpactTasks.filter(task => task.doc_impact === 'medium'),
				low: docImpactTasks.filter(task => task.doc_impact === 'low')
			};

			console.log(chalk.bold.cyan('Documentation Impact Summary:'));

			// Display impact counts
			const impactTable = new Table({
				head: [chalk.bold('Impact Level'), chalk.bold('Count')],
				colWidths: [15, 10]
			});

			impactTable.push(
				[chalk.red('High'), impactGroups.high.length],
				[chalk.yellow('Medium'), impactGroups.medium.length],
				[chalk.green('Low'), impactGroups.low.length]
			);

			console.log(impactTable.toString());

			// Find affected docs
			const affectedDocs = new Set();
			docImpactTasks.forEach(task => {
				if (task.affected_docs && task.affected_docs.length > 0) {
					task.affected_docs.forEach(doc => affectedDocs.add(doc));
				}
			});

			if (affectedDocs.size > 0) {
				console.log(chalk.bold('\nAffected Documentation:'));

				const docsTable = new Table({
					head: [chalk.bold('Doc ID'), chalk.bold('Related Tasks')],
					colWidths: [20, 30]
				});

				[...affectedDocs].sort().forEach(docId => {
					const relatedTasks = docImpactTasks
						.filter(task => task.affected_docs && task.affected_docs.includes(docId))
						.map(task => task.id);

					docsTable.push([
						docId,
						relatedTasks.join(', ')
					]);
				});

				console.log(docsTable.toString());
			}

			break;
		}
	}

	await promptContinue();
}

// Function to view task dependencies
async function viewDependencies() {
	const tasks = await loadAllTasks();

	if (tasks.length === 0) {
		console.log(chalk.yellow('No tasks found'));
		await promptContinue();
		return;
	}

	// Create dependency graph
	const dependencyGraph = {};
	const reverseDependencyGraph = {};

	tasks.forEach(task => {
		dependencyGraph[task.id] = task.dependencies || [];

		// Build reverse dependencies
		if (task.dependencies && task.dependencies.length > 0) {
			task.dependencies.forEach(depId => {
				if (!reverseDependencyGraph[depId]) {
					reverseDependencyGraph[depId] = [];
				}
				reverseDependencyGraph[depId].push(task.id);
			});
		}
	});

	// Ask which task to view
	const taskChoices = tasks.map(task => ({
		name: `${task.id}: ${task.title}`,
		value: task.id
	}));

	const { taskId } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'taskId',
			message: 'Select a task to view dependencies:',
			source: (answersSoFar, input = '') => {
				return new Promise(resolve => {
					const fuzzyResult = fuzzy.filter(input, taskChoices, {
						extract: el => el.name
					});
					resolve(fuzzyResult.map(result => result.original));
				});
			}
		}
	]);

	const task = tasks.find(t => t.id === taskId);

	if (!task) {
		console.log(chalk.red(`Task ${taskId} not found`));
		await promptContinue();
		return;
	}

	console.log(drawBox(
		chalk.bold(`Dependencies for ${task.id}: ${task.title}`),
		{ padding: 1, borderColor: 'blue' }
	));

	// Display dependencies (what this task depends on)
	const dependencies = dependencyGraph[task.id] || [];

	if (dependencies.length > 0) {
		console.log(chalk.bold('\nThis task depends on:'));

		const depTable = new Table({
			head: [chalk.bold('ID'), chalk.bold('Title'), chalk.bold('Status')],
			colWidths: [10, 30, 20]
		});

		dependencies.forEach(depId => {
			const depTask = tasks.find(t => t.id === depId);

			if (depTask) {
				const status = STATUS[depTask.status] || depTask.status;
				depTable.push([
					depTask.id,
					depTask.title,
					status
				]);
			} else {
				depTable.push([
					depId,
					chalk.red('Not found'),
					chalk.red('Unknown')
				]);
			}
		});

		console.log(depTable.toString());
	} else {
		console.log(chalk.dim('This task has no dependencies.'));
	}

	// Display reverse dependencies (tasks that depend on this)
	const reverseDependencies = reverseDependencyGraph[task.id] || [];

	if (reverseDependencies.length > 0) {
		console.log(chalk.bold('\nThese tasks depend on this task:'));

		const revDepTable = new Table({
			head: [chalk.bold('ID'), chalk.bold('Title'), chalk.bold('Status')],
			colWidths: [10, 30, 20]
		});

		reverseDependencies.forEach(depId => {
			const depTask = tasks.find(t => t.id === depId);

			if (depTask) {
				const status = STATUS[depTask.status] || depTask.status;
				revDepTable.push([
					depTask.id,
					depTask.title,
					status
				]);
			} else {
				revDepTable.push([
					depId,
					chalk.red('Not found'),
					chalk.red('Unknown')
				]);
			}
		});

		console.log(revDepTable.toString());
	} else {
		console.log(chalk.dim('No tasks depend on this task.'));
	}

	await promptContinue();
}

// Function to view documentation related to tasks
async function viewDocumentation() {
	const tasks = await loadAllTasks();

	// Find all unique doc IDs across tasks
	const docIds = new Set();
	tasks.forEach(task => {
		if (task.affected_docs && task.affected_docs.length > 0) {
			task.affected_docs.forEach(docId => docIds.add(docId));
		}
	});

	if (docIds.size === 0) {
		console.log(chalk.yellow('No documentation references found in tasks'));
		await promptContinue();
		return;
	}

	// Ask which doc to view
	const { docId } = await inquirer.prompt([
		{
			type: 'list',
			name: 'docId',
			message: 'Select a document to view related tasks:',
			choices: [...docIds].sort()
		}
	]);

	// Find tasks that affect this doc
	const relatedTasks = tasks.filter(task =>
		task.affected_docs && task.affected_docs.includes(docId)
	);

	console.log(drawBox(
		chalk.bold(`Tasks affecting document: ${docId}`),
		{ padding: 1, borderColor: 'cyan' }
	));

	if (relatedTasks.length > 0) {
		const table = new Table({
			head: [
				chalk.bold('Task ID'),
				chalk.bold('Title'),
				chalk.bold('Status'),
				chalk.bold('Doc Impact')
			],
			colWidths: [10, 30, 20, 15]
		});

		relatedTasks.forEach(task => {
			const status = STATUS[task.status] || task.status;

			let docImpact;
			switch (task.doc_impact) {
				case 'high':
					docImpact = chalk.yellow('Medium');
					break;
				case 'low':
					docImpact = chalk.green('Low');
					break;
				default:
					docImpact = chalk.dim('None');
			}

			table.push([
				task.id,
				task.title,
				status,
				docImpact
			]);
		});

		console.log(table.toString());

		// Check if any tasks are completed that might affect documentation
		const completedTasks = relatedTasks.filter(task => task.status === '✅ Completed');

		if (completedTasks.length > 0) {
			console.log(chalk.yellow.bold('\nAttention: Completed tasks that may require documentation updates:'));

			completedTasks.forEach(task => {
				console.log(`- ${task.id}: ${task.title} (${task.doc_impact || 'unknown'} impact)`);
			});
		}
	} else {
		console.log(chalk.dim('No tasks associated with this document were found.'));
	}

	await promptContinue();
}

// Helper function for task list actions
async function taskListActions(tasks) {
	const { action } = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: [
				{ name: 'View task details', value: 'view' },
				{ name: 'Update a task', value: 'update' },
				{ name: 'Back to main menu', value: 'back' }
			]
		}
	]);

	switch (action) {
		case 'view':
			await viewTaskDetails(tasks);
			break;
		case 'update':
			await updateTask();
			break;
		case 'back':
			await mainMenu();
			break;
	}
}

// Function to view task details
async function viewTaskDetails(tasks) {
	// Use fuzzy search for task selection
	const taskChoices = tasks.map(task => ({
		name: `${task.id}: ${task.title}`,
		value: task.id
	}));

	const { taskId } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'taskId',
			message: 'Select a task to view:',
			source: (answersSoFar, input = '') => {
				return new Promise(resolve => {
					const fuzzyResult = fuzzy.filter(input, taskChoices, {
						extract: el => el.name
					});
					resolve(fuzzyResult.map(result => result.original));
				});
			}
		}
	]);

	const task = tasks.find(t => t.id === taskId);

	if (!task) {
		console.log(chalk.red(`Task ${taskId} not found`));
		await promptContinue();
		return;
	}

	// Display task details
	console.clear();

	console.log(drawBox(
		chalk.bold.blue(`Task ${task.id}: ${task.title}`) + '\n\n' +
		`Status: ${STATUS[task.status] || task.status}\n` +
		`Priority: ${task.priority || 'Not set'}\n` +
		`Phase: ${task.phase || 'Not set'}\n` +
		`MVP: ${task.mvp ? 'Yes' : 'No'}\n` +
		`Assignee: ${task.assignee || 'Unassigned'}\n` +
		`Dependencies: ${task.dependencies?.join(', ') || 'None'}\n` +
		`Doc Impact: ${task.doc_impact || 'None'}\n` +
		`Affected Docs: ${task.affected_docs?.join(', ') || 'None'}\n` +
		`Last Updated: ${task.last_updated || 'Unknown'}`,
		{ padding: 1, borderColor: 'blue' }
	));

	if (task.content) {
		console.log(chalk.bold.underline('\nDescription:'));
		console.log(task.content);
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
		console.log(chalk.blue('Goodbye!'));
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

// Function to view MVP tasks
async function viewMvpTasks() {
	const tasks = await loadAllTasks();
	const mvpTasks = tasks.filter(task => task.mvp === true);

	if (mvpTasks.length === 0) {
		console.log(chalk.yellow('No MVP tasks found'));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Priority'),
			chalk.bold('Phase'),
			chalk.bold('Assignee')
		],
		colWidths: [12, 35, 20, 12, 10, 15],
		wordWrap: true,
		truncate: '...'
	});

	mvpTasks.forEach(task => {
		const status = STATUS[task.status] || task.status;
		table.push([
			task.id || 'unknown',
			task.title || 'Unknown',
			status,
			task.priority || '-',
			task.phase || '-',
			task.assignee || '-'
		]);
	});

	console.log(chalk.bold.magenta('MVP Tasks:'));
	console.log(table.toString());

	await taskListActions(mvpTasks);
}

// Function to view high priority tasks
async function viewHighPriorityTasks() {
	const tasks = await loadAllTasks();
	const highPriorityTasks = tasks.filter(task =>
		task.priority === 'High' || task.priority === 'Critical'
	);

	if (highPriorityTasks.length === 0) {
		console.log(chalk.yellow('No high priority tasks found'));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Priority'),
			chalk.bold('Phase'),
			chalk.bold('Assignee')
		],
		colWidths: [12, 35, 20, 12, 10, 15],
		wordWrap: true,
		truncate: '...'
	});

	highPriorityTasks.forEach(task => {
		const status = STATUS[task.status] || task.status;
		const priority = task.priority === 'Critical' ?
			chalk.bgRed.white('Critical') : chalk.red('High');

		table.push([
			task.id || 'unknown',
			task.title || 'Unknown',
			status,
			priority,
			task.phase || '-',
			task.assignee || '-'
		]);
	});

	console.log(chalk.bold.red('High Priority Tasks:'));
	console.log(table.toString());

	await taskListActions(highPriorityTasks);
}

// Function to view recently updated tasks
async function viewRecentTasks() {
	try {
		const historyFiles = await fs.readdir(HISTORY_DIR);

		if (historyFiles.length === 0) {
			console.log(chalk.yellow('No task history found'));
			await promptContinue();
			return;
		}

		// Sort by modification time (newest first)
		const sortedFiles = historyFiles.sort().reverse();

		// Get the 10 most recent entries
		const recentFiles = sortedFiles.slice(0, 20);

		// Load the history entries
		const historyEntries = await Promise.all(
			recentFiles.map(async file => {
				try {
					const content = await fs.readFile(path.join(HISTORY_DIR, file), 'utf8');
					return JSON.parse(content);
				} catch (err) {
					console.warn(chalk.yellow(`Warning: Could not parse history file ${file}: ${err.message}`));
					return null;
				}
			})
		);

		// Filter out nulls from parsing errors
		const validHistoryEntries = historyEntries.filter(entry => entry !== null);

		// Get unique task IDs from history
		const recentTaskIds = [...new Set(validHistoryEntries.map(entry => entry.task_id))];

		// Load all tasks
		const allTasks = await loadAllTasks();

		// Filter to only recent tasks
		const recentTasks = allTasks.filter(task => recentTaskIds.includes(task.id));

		if (recentTasks.length === 0) {
			console.log(chalk.yellow('No recently updated tasks found'));
			await promptContinue();
			return;
		}

		// Display recent tasks
		const table = new Table({
			head: [
				chalk.bold('ID'),
				chalk.bold('Title'),
				chalk.bold('Status'),
				chalk.bold('Last Updated'),
				chalk.bold('Assignee')
			],
			colWidths: [12, 35, 20, 20, 15],
			wordWrap: true,
			truncate: '...'
		});

		recentTasks.forEach(task => {
			// Find the most recent history entry for this task
			const taskHistory = validHistoryEntries
				.filter(entry => entry.task_id === task.id)
				.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

			const lastUpdated = taskHistory ?
				DateTime.fromISO(taskHistory.timestamp).toFormat('yyyy-MM-dd HH:mm') :
				'Unknown';

			const status = STATUS[task.status] || task.status;

			table.push([
				task.id || 'unknown',
				task.title || 'Unknown',
				status,
				lastUpdated,
				task.assignee || '-'
			]);
		});

		console.log(chalk.bold.blue('Recently Updated Tasks:'));
		console.log(table.toString());

		await taskListActions(recentTasks);
	} catch (err) {
		console.error(chalk.red(`Error loading recent tasks: ${err.message}`));
		await promptContinue();
	}
}

// Function to view blocked tasks
async function viewBlockedTasks() {
	const tasks = await loadAllTasks();
	const blockedTasks = tasks.filter(task =>
		task.status === '🔴 Blocked' || task.status === '🟡 Partially Blocked'
	);

	if (blockedTasks.length === 0) {
		console.log(chalk.yellow('No blocked tasks found'));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Blocked By'),
			chalk.bold('Priority')
		],
		colWidths: [12, 35, 20, 20, 12],
		wordWrap: true,
		truncate: '...'
	});

	blockedTasks.forEach(task => {
		const status = STATUS[task.status] || task.status;
		const blockedBy = task.dependencies && task.dependencies.length > 0 ?
			task.dependencies.join(', ') : '-';

		table.push([
			task.id || 'unknown',
			task.title || 'Unknown',
			status,
			blockedBy,
			task.priority || '-'
		]);
	});

	console.log(chalk.bold.red('Blocked Tasks:'));
	console.log(table.toString());

	await taskListActions(blockedTasks);
}

// Function to search for tasks
async function searchTasks() {
	const tasks = await loadAllTasks();

	const answers = await inquirer.prompt([
		{
			type: 'input',
			name: 'searchTerm',
			message: 'Enter a search term:',
			validate: input => input.trim() !== '' ? true : 'Please enter a search term'
		}
	]);

	const searchTerm = answers.searchTerm.toLowerCase();
	const searchResults = tasks.filter(task => {
		return (
			(task.id && task.id.toLowerCase().includes(searchTerm)) ||
			(task.title && task.title.toLowerCase().includes(searchTerm)) ||
			(task.description && task.description.toLowerCase().includes(searchTerm)) ||
			(task.assignee && task.assignee.toLowerCase().includes(searchTerm))
		);
	});

	if (searchResults.length === 0) {
		console.log(chalk.yellow(`No tasks found matching "${answers.searchTerm}"`));
		await promptContinue();
		return;
	}

	const table = new Table({
		head: [
			chalk.bold('ID'),
			chalk.bold('Title'),
			chalk.bold('Status'),
			chalk.bold('Priority'),
			chalk.bold('Assignee')
		],
		colWidths: [12, 35, 20, 12, 15],
		wordWrap: true,
		truncate: '...'
	});

	searchResults.forEach(task => {
		const status = STATUS[task.status] || task.status || 'Unknown';

		table.push([
			task.id || 'unknown',
			task.title || 'Unknown',
			status,
			task.priority || '-',
			task.assignee || '-'
		]);
	});

	console.log(chalk.bold.cyan(`Search Results for "${answers.searchTerm}":`));
	console.log(table.toString());

	await taskListActions(searchResults);
}

// Simple box drawing function to replace boxen
function drawBox(text, options = {}) {
	const padding = options.padding || 1;
	const borderColor = options.borderColor || 'blue';

	const lines = text.split('\n');
	const contentWidth = Math.max(...lines.map(line => line.length));
	const width = contentWidth + (padding * 2);

	const colorFn = chalk[borderColor] || chalk.blue;

	// Top border
	let result = colorFn('┌' + '─'.repeat(width) + '┐\n');

	// Empty lines for top padding
	for (let i = 0; i < padding; i++) {
		result += colorFn('│' + ' '.repeat(width) + '│\n');
	}

	// Content lines
	for (const line of lines) {
		const paddedLine = line + ' '.repeat(width - line.length - (padding * 2));
		result += colorFn('│' + ' '.repeat(padding) + paddedLine + ' '.repeat(padding) + '│\n');
	}

	// Empty lines for bottom padding
	for (let i = 0; i < padding; i++) {
		result += colorFn('│' + ' '.repeat(width) + '│\n');
	}

	// Bottom border
	result += colorFn('└' + '─'.repeat(width) + '┘');

	return result;
}
