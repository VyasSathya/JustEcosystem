#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const checklistPath = path.resolve(process.cwd(), 'CHECKLIST.md');
if (!fs.existsSync(checklistPath)) {
  console.error('❌ CHECKLIST.md not found.');
  process.exit(1);
}
const checklist = fs.readFileSync(checklistPath, 'utf8');
const unchecked = checklist.match(/\[ \]/g);
if (unchecked && unchecked.length > 0) {
  console.error(`❌ ${unchecked.length} checklist items are incomplete. Please complete all items before committing.`);
  process.exit(1);
}
console.log('✅ All checklist items are complete!');
process.exit(0);
