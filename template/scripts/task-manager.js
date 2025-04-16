#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

// Configuration
const TASK_FILES = {
  main: 'task.md',
  user: 'taskuser.md',
  flow: 'task_implementation_flow.md'
};

// Status indicators
const STATUS = {
  BLOCKED: '🔴',
  PARTIAL: '🟡',
  UNBLOCKED: '🟢',
  NOT_STARTED: '⚪',
  COMPLETED: '✅'
};

// Task types
const TASK_TYPES = {
  MVP: 'MVP',
  INT: 'INT',
  DOC: 'DOC',
  FE: 'FE',
  BE: 'BE',
  UI: 'UI'
};

class TaskManager {
  constructor() {
    this.taskFiles = {};
    this.loadTaskFiles();
  }

  loadTaskFiles() {
    for (const [key, file] of Object.entries(TASK_FILES)) {
      try {
        this.taskFiles[key] = fs.readFileSync(file, 'utf8');
      } catch (error) {
        console.error(`Error loading ${file}:`, error.message);
        this.taskFiles[key] = '';
      }
    }
  }

  saveTaskFiles() {
    for (const [key, file] of Object.entries(TASK_FILES)) {
      try {
        fs.writeFileSync(file, this.taskFiles[key]);
      } catch (error) {
        console.error(`Error saving ${file}:`, error.message);
      }
    }
  }

  // Task Operations
  addTask(type, description, dependencies = [], priority = 'Medium') {
    const taskId = this.generateTaskId(type);
    const task = {
      id: taskId,
      description,
      dependencies,
      priority,
      status: STATUS.NOT_STARTED
    };

    this.taskFiles.main += `\n### ${taskId}\n- Description: ${description}\n- Dependencies: ${dependencies.join(', ')}\n- Priority: ${priority}\n- Status: ${STATUS.NOT_STARTED}\n`;
    this.saveTaskFiles();
    return taskId;
  }

  updateTaskStatus(taskId, status) {
    const statusSymbol = STATUS[status.toUpperCase()] || status;
    const regex = new RegExp(`### ${taskId}.*?Status: [🔴🟡🟢⚪✅]`, 's');
    this.taskFiles.main = this.taskFiles.main.replace(regex, `### ${taskId}\n- Status: ${statusSymbol}`);
    this.saveTaskFiles();
  }

  generateTaskId(type) {
    const prefix = TASK_TYPES[type.toUpperCase()] || type;
    const tasks = this.taskFiles.main.match(new RegExp(`${prefix}-\\d+`, 'g')) || [];
    const maxId = Math.max(...tasks.map(t => parseInt(t.split('-')[1])), 0);
    return `${prefix}-${String(maxId + 1).padStart(3, '0')}`;
  }

  // Resource Management
  addResource(name, requiredFor, status = STATUS.BLOCKED) {
    this.taskFiles.user += `\n| ${name} | ${requiredFor} | ${status} |`;
    this.saveTaskFiles();
  }

  updateResourceStatus(name, status) {
    const regex = new RegExp(`\\| ${name} \\| .*? \\| [🔴🟡🟢⚪✅] \\|`);
    this.taskFiles.user = this.taskFiles.user.replace(regex, `| ${name} | ${status} |`);
    this.saveTaskFiles();
  }

  // Implementation Flow
  addToFlow(phase, taskId, description) {
    this.taskFiles.flow += `\n### ${phase}\n- ${taskId}: ${description}`;
    this.saveTaskFiles();
  }

  // Status Reports
  getTaskSummary() {
    const tasks = this.taskFiles.main.match(/### ([A-Z]+-\d+).*?Status: ([🔴🟡🟢⚪✅])/gs) || [];
    const summary = {
      total: tasks.length,
      blocked: 0,
      inProgress: 0,
      completed: 0,
      notStarted: 0
    };

    tasks.forEach(task => {
      if (task.includes(STATUS.BLOCKED)) summary.blocked++;
      else if (task.includes(STATUS.COMPLETED)) summary.completed++;
      else if (task.includes(STATUS.NOT_STARTED)) summary.notStarted++;
      else summary.inProgress++;
    });

    return summary;
  }

  getBlockedResources() {
    const resources = this.taskFiles.user.match(/\|.*?\|.*?\| [🔴🟡🟢⚪✅] \|/g) || [];
    return resources.filter(r => r.includes(STATUS.BLOCKED)).map(r => {
      const [_, name, requiredFor] = r.match(/\| (.*?) \| (.*?) \| [🔴🟡🟢⚪✅] \|/);
      return { name, requiredFor };
    });
  }

  async showMainMenu() {
    console.log(chalk.blue(figlet.textSync('JustCreate Tasks', { horizontalLayout: 'full' })));
    
    const summary = this.getTaskSummary();
    console.log(chalk.cyan('\nTask Summary:'));
    console.log(`Total Tasks: ${summary.total}`);
    console.log(`${STATUS.BLOCKED} Blocked: ${summary.blocked}`);
    console.log(`${STATUS.PARTIAL} In Progress: ${summary.inProgress}`);
    console.log(`${STATUS.COMPLETED} Completed: ${summary.completed}`);
    console.log(`${STATUS.NOT_STARTED} Not Started: ${summary.notStarted}\n`);

    const blockedResources = this.getBlockedResources();
    if (blockedResources.length > 0) {
      console.log(chalk.red('\nBlocked Resources:'));
      blockedResources.forEach(r => {
        console.log(`${STATUS.BLOCKED} ${r.name} (Required for: ${r.requiredFor})`);
      });
      console.log('');
    }

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '📝 Add New Task', value: 'add' },
          { name: '🔄 Update Task Status', value: 'status' },
          { name: '📦 Manage Resources', value: 'resource' },
          { name: '📋 View All Tasks', value: 'view' },
          { name: '❌ Exit', value: 'exit' }
        ]
      }
    ]);

    switch (action) {
      case 'add':
        await this.addTaskPrompt();
        break;
      case 'status':
        await this.updateStatusPrompt();
        break;
      case 'resource':
        await this.manageResourcesPrompt();
        break;
      case 'view':
        await this.viewTasksPrompt();
        break;
      case 'exit':
        console.log(chalk.green('Goodbye!'));
        process.exit(0);
    }

    await this.showMainMenu();
  }

  async addTaskPrompt() {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select task type:',
        choices: Object.keys(TASK_TYPES)
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter task description:'
      },
      {
        type: 'input',
        name: 'dependencies',
        message: 'Enter dependencies (comma-separated) or press enter to skip:'
      },
      {
        type: 'list',
        name: 'priority',
        message: 'Select priority:',
        choices: ['High', 'Medium', 'Low']
      }
    ]);

    const dependencies = answers.dependencies ? answers.dependencies.split(',').map(d => d.trim()) : [];
    const taskId = this.addTask(answers.type, answers.description, dependencies, answers.priority);
    console.log(chalk.green(`\nTask ${taskId} created successfully!`));
  }

  async updateStatusPrompt() {
    const tasks = this.taskFiles.main.match(/### ([A-Z]+-\d+)/g) || [];
    const taskChoices = tasks.map(t => t.replace('### ', ''));

    if (taskChoices.length === 0) {
      console.log(chalk.yellow('\nNo tasks found!'));
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'taskId',
        message: 'Select task to update:',
        choices: taskChoices
      },
      {
        type: 'list',
        name: 'status',
        message: 'Select new status:',
        choices: Object.keys(STATUS)
      }
    ]);

    this.updateTaskStatus(answers.taskId, answers.status);
    console.log(chalk.green(`\nTask ${answers.taskId} status updated to ${STATUS[answers.status]}!`));
  }

  async manageResourcesPrompt() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Resource Management:',
        choices: [
          { name: '➕ Add New Resource', value: 'add' },
          { name: '🔄 Update Resource Status', value: 'update' }
        ]
      }
    ]);

    if (action === 'add') {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter resource name:'
        },
        {
          type: 'input',
          name: 'requiredFor',
          message: 'Required for (task ID):'
        },
        {
          type: 'list',
          name: 'status',
          message: 'Select status:',
          choices: Object.keys(STATUS)
        }
      ]);

      this.addResource(answers.name, answers.requiredFor, STATUS[answers.status]);
      console.log(chalk.green('\nResource added successfully!'));
    } else {
      const resources = this.taskFiles.user.match(/\| (.*?) \|/g) || [];
      if (resources.length === 0) {
        console.log(chalk.yellow('\nNo resources found!'));
        return;
      }

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Select resource to update:',
          choices: resources.map(r => r.replace(/\|/g, '').trim())
        },
        {
          type: 'list',
          name: 'status',
          message: 'Select new status:',
          choices: Object.keys(STATUS)
        }
      ]);

      this.updateResourceStatus(answers.name, STATUS[answers.status]);
      console.log(chalk.green('\nResource status updated successfully!'));
    }
  }

  async viewTasksPrompt() {
    const tasks = this.taskFiles.main.split(/### [A-Z]+-\d+/).slice(1);
    if (tasks.length === 0) {
      console.log(chalk.yellow('\nNo tasks found!'));
      return;
    }

    console.log(chalk.cyan('\nAll Tasks:'));
    tasks.forEach((task, index) => {
      const taskId = this.taskFiles.main.match(/### ([A-Z]+-\d+)/g)[index];
      console.log(`\n${taskId}${task}`);
    });

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press enter to continue...'
      }
    ]);
  }
}

// Start the interactive interface
if (require.main === module) {
  const taskManager = new TaskManager();
  taskManager.showMainMenu().catch(console.error);
}

module.exports = TaskManager; 