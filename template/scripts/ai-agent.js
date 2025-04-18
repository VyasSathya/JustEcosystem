#!/usr/bin/env node
// AI Agent CLI for .task/ and .docs/ automation
const fs = require('fs');
const path = require('path');

function parseTasks(taskDir) {
  if (!fs.existsSync(taskDir)) return [];
  return fs.readdirSync(taskDir).filter(f => f.endsWith('.md')).map(f => {
    const content = fs.readFileSync(path.join(taskDir, f), 'utf8');
    const statusMatch = content.match(/status:\s*([\w\s]+)/i);
    return { file: f, status: statusMatch ? statusMatch[1].trim() : 'Unknown' };
  });
}
function parseDocs(docDir) {
  if (!fs.existsSync(docDir)) return [];
  return fs.readdirSync(docDir).filter(f => f.endsWith('.md')).map(f => {
    const content = fs.readFileSync(path.join(docDir, f), 'utf8');
    const title = content.match(/^# (.+)$/m);
    return { file: f, title: title ? title[1] : 'Untitled' };
  });
}

const args = process.argv.slice(2);
if (args[0] === 'status') {
  const tasks = parseTasks('.task/tasks');
  const docs = parseDocs('.docs/master');
  console.log('Task Status:');
  tasks.forEach(t => console.log(`- ${t.file}: ${t.status}`));
  console.log('\nMaster Docs:');
  docs.forEach(d => console.log(`- ${d.file}: ${d.title}`));
  process.exit(0);
}
if (args[0] === 'suggest') {
  const tasks = parseTasks('.task/tasks');
  const incomplete = tasks.filter(t => !/done|complete/i.test(t.status));
  if (incomplete.length === 0) {
    console.log('🎉 All tasks appear complete!');
  } else {
    console.log('📝 Incomplete tasks:');
    incomplete.forEach(t => console.log(`- ${t.file}: ${t.status}`));
  }
  process.exit(0);
}
console.log('Usage: ai-agent.js <status|suggest>');
process.exit(1);
