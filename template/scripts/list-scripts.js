#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
const descriptions = {
  'ai:status': 'Show status of all tasks and docs',
  'ai:suggest': 'Suggest next actions for tasks',
  'brand:apply': 'Apply JustEcosystem branding to README',
  'dash:start': 'Start the compliance dashboard server',
  'repo:new': 'Scaffold a new repo from this template',
  'list:scripts': 'List all available npm scripts',
  'lint:all': 'Lint all code and markdown',
  'task:open': 'Open the interactive task manager',
  'doc:open': 'Open the interactive doc manager',
  'fix:markdown': 'Auto-fix markdown formatting'
};
console.log('\nAvailable npm scripts (two words):\n');
for (const [key, value] of Object.entries(pkg.scripts)) {
  if (descriptions[key]) {
    console.log(`npm run ${key.padEnd(12)} # ${descriptions[key]}`);
  }
}
